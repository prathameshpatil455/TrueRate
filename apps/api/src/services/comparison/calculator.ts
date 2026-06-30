import type { ComparisonRoute } from "@truerate/shared";
import { PROVIDER_URLS } from "@truerate/shared";
import type { ProviderFeeConfig } from "../../config/providers/mvp-providers.js";

export interface RouteCalculationInput {
  sendAmount: number;
  midMarketRate: number;
  provider: ProviderFeeConfig;
  networkFeeUsd: number;
  usdToSourceRate: number;
}

export interface RouteCalculationResult
  extends Omit<
    ComparisonRoute,
    "rank" | "isRecommended" | "explanation"
  > {}

export function calculateRoute(
  input: RouteCalculationInput,
): RouteCalculationResult {
  const { sendAmount, midMarketRate, provider, networkFeeUsd, usdToSourceRate } =
    input;

  const networkFee = networkFeeUsd * usdToSourceRate;

  const platformFee =
    sendAmount * (provider.platformFeePercent / 100) + provider.platformFeeFlat;

  const convertible = Math.max(0, sendAmount - platformFee - networkFee);
  const effectiveRate = midMarketRate * (1 - provider.fxSpreadPercent / 100);
  const amountReceived = convertible * effectiveRate;

  const midAtMarket = convertible * midMarketRate;
  const fxMarkupDest = midAtMarket - amountReceived;
  const fxMarkup = midMarketRate > 0 ? fxMarkupDest / midMarketRate : 0;
  const totalFee = platformFee + networkFee + fxMarkup;

  return {
    routeId: provider.routeId,
    providerName: provider.providerName,
    providerType: provider.providerType,
    platformFee: roundMoney(platformFee),
    fxMarkup: roundMoney(fxMarkup),
    networkFee: roundMoney(networkFee),
    totalFee: roundMoney(totalFee),
    effectiveRate: roundRate(effectiveRate),
    amountReceived: roundMoney(amountReceived),
    estimatedTimeHours: provider.estimatedTimeHours,
    providerUrl: PROVIDER_URLS[provider.routeId],
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundRate(value: number): number {
  return Math.round(value * 10000) / 10000;
}
