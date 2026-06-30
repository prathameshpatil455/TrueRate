export type ComparisonPriority =
  | "cheapest"
  | "fastest"
  | "balanced"
  | "highest_received"
  | "traditional"
  | "digital";

export type ProviderType = "swift" | "remittance" | "stablecoin" | "crypto";

export interface ComparisonRoute {
  routeId: string;
  providerName: string;
  providerType: ProviderType;
  platformFee: number;
  fxMarkup: number;
  networkFee: number;
  totalFee: number;
  effectiveRate: number;
  amountReceived: number;
  estimatedTimeHours: number;
  rank: number;
  isRecommended: boolean;
  explanation: string | null;
  providerUrl?: string;
}

export interface ComparisonRequest {
  sendAmount: number;
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  priority: ComparisonPriority;
}

export interface ComparisonResult {
  id: string;
  sendAmount: number;
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  midMarketRate: number;
  fxRateFetchedAt: string;
  fxRateSource: string;
  priority: ComparisonPriority;
  disclaimer: string;
  routes: ComparisonRoute[];
  recommendedRouteId: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
}

export interface CorridorOption {
  sourceCountry: string;
  destCountry: string;
  sourceCurrency: string;
  destCurrency: string;
  label: string;
}
