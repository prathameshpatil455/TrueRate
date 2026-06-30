import { randomUUID } from "node:crypto";
import { COMPARISON_DISCLAIMER } from "@truerate/shared";
import type { ComparisonRequest, ComparisonResult } from "@truerate/shared";
import { MVP_PROVIDERS } from "../../config/providers/mvp-providers.js";
import { recordFxSnapshot } from "../../db/repositories/fx-snapshots.repository.js";
import { createFxProvider } from "../../providers/fx/fx-provider.js";
import { coinGeckoProvider } from "../../providers/crypto/coingecko.js";
import { createGasProvider } from "../../providers/gas/etherscan.js";
import { calculateRoute } from "./calculator.js";
import {
  getRecommendedRouteId,
  rankRoutes,
} from "../recommendation/recommendation.engine.js";

const fxProvider = createFxProvider();
const gasProvider = createGasProvider();

export async function runComparison(
  input: ComparisonRequest,
): Promise<ComparisonResult> {
  const fx = await fxProvider.getRates(input.sourceCurrency);

  const destRate = fx.rates[input.destCurrency];
  if (!destRate) {
    throw new Error(
      `Unsupported currency pair: ${input.sourceCurrency} → ${input.destCurrency}`,
    );
  }

  const usdRate = fx.rates.USD ?? (input.sourceCurrency === "USD" ? 1 : null);
  const usdToSourceRate =
    input.sourceCurrency === "USD" ? 1 : usdRate ? 1 / usdRate : 1;

  let ethNetworkFeeUsd = 5;

  try {
    const ethPrice = await coinGeckoProvider.getUsdPrice("ethereum");
    const gas = await gasProvider.getEthereumTransferFeeUsd(ethPrice.usd);
    ethNetworkFeeUsd = gas.estimatedTransferFeeUsd;
  } catch {
    ethNetworkFeeUsd = 5;
  }

  const rawRoutes = MVP_PROVIDERS.map((provider) => {
    const usesLiveGas =
      provider.routeId === "usdc-ethereum" || provider.routeId === "eth-ethereum";

    const networkFeeUsd = usesLiveGas
      ? ethNetworkFeeUsd
      : (provider.networkFeeUsd ?? 0);

    return calculateRoute({
      sendAmount: input.sendAmount,
      midMarketRate: destRate,
      provider,
      networkFeeUsd,
      usdToSourceRate,
    });
  });

  const routes = rankRoutes(rawRoutes, input.priority);

  recordFxSnapshot({
    baseCurrency: input.sourceCurrency,
    quoteCurrency: input.destCurrency,
    rate: destRate,
    source: fx.source,
  }).catch(() => undefined);

  return {
    id: randomUUID(),
    sendAmount: input.sendAmount,
    sourceCurrency: input.sourceCurrency,
    destCurrency: input.destCurrency,
    sourceCountry: input.sourceCountry,
    destCountry: input.destCountry,
    midMarketRate: destRate,
    fxRateFetchedAt: fx.fetchedAt,
    fxRateSource: fx.source,
    priority: input.priority,
    disclaimer: COMPARISON_DISCLAIMER,
    routes,
    recommendedRouteId: getRecommendedRouteId(routes),
  };
}
