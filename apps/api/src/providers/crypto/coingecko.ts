import { memoryCache } from "../../cache/memory-cache.js";
import type { CryptoProvider, CryptoPriceResult } from "../interfaces.js";

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_KEY_PREFIX = "crypto:price:";

export class CoinGeckoProvider implements CryptoProvider {
  async getUsdPrice(coinId: string): Promise<CryptoPriceResult> {
    const cacheKey = `${CACHE_KEY_PREFIX}${coinId}`;
    const cached = memoryCache.get<CryptoPriceResult>(cacheKey);
    if (cached) return cached;

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CoinGecko error: ${response.status}`);
    }

    const json = (await response.json()) as Record<string, { usd: number }>;
    const price = json[coinId]?.usd;

    if (!price) {
      throw new Error(`CoinGecko: no price for ${coinId}`);
    }

    const result: CryptoPriceResult = {
      id: coinId,
      usd: price,
      fetchedAt: new Date().toISOString(),
    };

    memoryCache.set(cacheKey, result, CACHE_TTL_MS);
    return result;
  }
}

export const coinGeckoProvider = new CoinGeckoProvider();
