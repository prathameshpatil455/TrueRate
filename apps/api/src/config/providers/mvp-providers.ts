import type { ProviderType } from "@truerate/shared";

export interface ProviderFeeConfig {
  routeId: string;
  providerName: string;
  providerType: ProviderType;
  platformFeePercent: number;
  platformFeeFlat: number;
  fxSpreadPercent: number;
  estimatedTimeHours: number;
  networkFeeUsd?: number;
}

export const MVP_PROVIDERS: ProviderFeeConfig[] = [
  {
    routeId: "swift",
    providerName: "SWIFT Bank Transfer",
    providerType: "swift",
    platformFeePercent: 0,
    platformFeeFlat: 25,
    fxSpreadPercent: 2.5,
    estimatedTimeHours: 72,
  },
  {
    routeId: "wise",
    providerName: "Wise",
    providerType: "remittance",
    platformFeePercent: 0.43,
    platformFeeFlat: 0,
    fxSpreadPercent: 0.35,
    estimatedTimeHours: 24,
  },
  {
    routeId: "remitly",
    providerName: "Remitly",
    providerType: "remittance",
    platformFeePercent: 0,
    platformFeeFlat: 3.99,
    fxSpreadPercent: 1.5,
    estimatedTimeHours: 12,
  },
  {
    routeId: "usdc-ethereum",
    providerName: "USDC (Ethereum)",
    providerType: "stablecoin",
    platformFeePercent: 0,
    platformFeeFlat: 0,
    fxSpreadPercent: 0.1,
    estimatedTimeHours: 0.5,
    networkFeeUsd: 5,
  },
  {
    routeId: "usdc-polygon",
    providerName: "USDC (Polygon)",
    providerType: "stablecoin",
    platformFeePercent: 0,
    platformFeeFlat: 0,
    fxSpreadPercent: 0.1,
    estimatedTimeHours: 0.25,
    networkFeeUsd: 0.01,
  },
  {
    routeId: "eth-ethereum",
    providerName: "ETH (Ethereum)",
    providerType: "crypto",
    platformFeePercent: 0,
    platformFeeFlat: 0,
    fxSpreadPercent: 0.5,
    estimatedTimeHours: 0.5,
    networkFeeUsd: 5,
  },
  {
    routeId: "western-union",
    providerName: "Western Union",
    providerType: "remittance",
    platformFeePercent: 0,
    platformFeeFlat: 4.99,
    fxSpreadPercent: 2.0,
    estimatedTimeHours: 24,
  },
  {
    routeId: "xoom",
    providerName: "Xoom",
    providerType: "remittance",
    platformFeePercent: 0,
    platformFeeFlat: 5.99,
    fxSpreadPercent: 1.8,
    estimatedTimeHours: 18,
  },
];
