import { memoryCache } from "../../cache/memory-cache.js";
import type { GasFeeProvider, GasFeeResult } from "../interfaces.js";

const CACHE_TTL_MS = 2 * 60 * 1000;
const CACHE_KEY = "gas:ethereum";
const ERC20_TRANSFER_GAS = 65_000;
const FALLBACK_GAS_GWEI = 25;

export class EtherscanGasProvider implements GasFeeProvider {
  constructor(private readonly apiKey: string) {}

  async getEthereumTransferFeeUsd(ethUsdPrice: number): Promise<GasFeeResult> {
    const cached = memoryCache.get<GasFeeResult>(CACHE_KEY);
    if (cached) return cached;

    let gasPriceGwei = FALLBACK_GAS_GWEI;
    let source = "fallback";

    try {
      const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const json = (await response.json()) as {
        status: string;
        result?: { ProposeGasPrice: string };
      };

      if (json.status === "1" && json.result?.ProposeGasPrice) {
        gasPriceGwei = Number(json.result.ProposeGasPrice);
        source = "etherscan";
      }
    } catch {
      gasPriceGwei = FALLBACK_GAS_GWEI;
    }

    const feeEth = (gasPriceGwei * ERC20_TRANSFER_GAS) / 1e9;
    const result: GasFeeResult = {
      gasPriceGwei,
      estimatedTransferFeeUsd: feeEth * ethUsdPrice,
      fetchedAt: new Date().toISOString(),
      source,
    };

    memoryCache.set(CACHE_KEY, result, CACHE_TTL_MS);
    return result;
  }
}

export class FallbackGasProvider implements GasFeeProvider {
  async getEthereumTransferFeeUsd(ethUsdPrice: number): Promise<GasFeeResult> {
    const cached = memoryCache.get<GasFeeResult>(CACHE_KEY);
    if (cached) return cached;

    const feeEth = (FALLBACK_GAS_GWEI * ERC20_TRANSFER_GAS) / 1e9;
    const result: GasFeeResult = {
      gasPriceGwei: FALLBACK_GAS_GWEI,
      estimatedTransferFeeUsd: feeEth * ethUsdPrice,
      fetchedAt: new Date().toISOString(),
      source: "fallback",
    };

    memoryCache.set(CACHE_KEY, result, CACHE_TTL_MS);
    return result;
  }
}

export function createGasProvider(): GasFeeProvider {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const hasValidKey =
    apiKey && apiKey !== "your-etherscan-api-key" && apiKey.length > 8;

  if (hasValidKey) {
    return new EtherscanGasProvider(apiKey);
  }

  return new FallbackGasProvider();
}
