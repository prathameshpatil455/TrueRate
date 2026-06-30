import { memoryCache } from "../../cache/memory-cache.js";
import type { FxProvider, FxRateResult } from "../interfaces.js";
import { getStaticRates } from "./static-rates.js";

const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_KEY_PREFIX = "fx:rates:";

export class ExchangeRateApiProvider implements FxProvider {
  constructor(private readonly apiKey: string) {}

  async getRates(base: string): Promise<FxRateResult> {
    const cacheKey = `${CACHE_KEY_PREFIX}${base}`;
    const cached = memoryCache.get<FxRateResult>(cacheKey);
    if (cached) return cached;

    const url = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/${base}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`ExchangeRate-API error: ${response.status}`);
    }

    const json = (await response.json()) as {
      conversion_rates: Record<string, number>;
    };

    const result: FxRateResult = {
      base,
      rates: json.conversion_rates,
      fetchedAt: new Date().toISOString(),
      source: "exchangerate-api",
    };

    memoryCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }
}

export class FrankfurterFxProvider implements FxProvider {
  async getRates(base: string): Promise<FxRateResult> {
    const cacheKey = `${CACHE_KEY_PREFIX}${base}:frankfurter`;
    const cached = memoryCache.get<FxRateResult>(cacheKey);
    if (cached) return cached;

    const url = `https://api.frankfurter.app/latest?from=${base}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status}`);
    }

    const json = (await response.json()) as {
      base: string;
      rates: Record<string, number>;
    };

    const rates = { ...json.rates, [base]: 1 };
    const result: FxRateResult = {
      base,
      rates,
      fetchedAt: new Date().toISOString(),
      source: "frankfurter",
    };

    memoryCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }
}

export class StaticFxProvider implements FxProvider {
  async getRates(base: string): Promise<FxRateResult> {
    const cacheKey = `${CACHE_KEY_PREFIX}${base}:static`;
    const cached = memoryCache.get<FxRateResult>(cacheKey);
    if (cached) return cached;

    const result: FxRateResult = {
      base,
      rates: getStaticRates(base),
      fetchedAt: new Date().toISOString(),
      source: "static-fallback",
    };

    memoryCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }
}

class ResilientFxProvider implements FxProvider {
  constructor(private readonly providers: FxProvider[]) {}

  async getRates(base: string): Promise<FxRateResult> {
    let lastError: Error | undefined;

    for (const provider of this.providers) {
      try {
        return await provider.getRates(base);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    throw lastError ?? new Error("All FX providers failed");
  }
}

export function createFxProvider(): FxProvider {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  const hasValidKey =
    apiKey && apiKey !== "your-exchangerate-api-key" && apiKey.length > 8;

  const providers: FxProvider[] = hasValidKey
    ? [new ExchangeRateApiProvider(apiKey), new FrankfurterFxProvider()]
    : [new FrankfurterFxProvider()];

  providers.push(new StaticFxProvider());

  return new ResilientFxProvider(providers);
}
