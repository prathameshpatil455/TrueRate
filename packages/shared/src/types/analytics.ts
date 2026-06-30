export interface NotificationPreferences {
  rateAlertsEnabled?: boolean;
  rateAlertThreshold?: number;
  alertSourceCurrency?: string;
  alertDestCurrency?: string;
  feeDropAlertsEnabled?: boolean;
  betterRouteAlertsEnabled?: boolean;
}

export interface RateHistoryPoint {
  rate: number;
  recordedAt: string;
}

export interface MonthlySavings {
  month: string;
  estimatedSavings: number;
  destCurrency: string;
  comparisonCount: number;
}

export interface ProviderPerformance {
  routeId: string;
  providerName: string;
  providerType: string;
  avgTotalFee: number;
  avgAmountReceived: number;
  usageCount: number;
}

export interface CorridorUsage {
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  count: number;
}

export interface CountryAnalytics {
  destCountry: string;
  comparisonCount: number;
  totalSendVolume: number;
}

export interface FeeComparisonPoint {
  routeId: string;
  providerName: string;
  avgTotalFee: number;
}

export interface AnalyticsOverview {
  totalComparisons: number;
  totalEstimatedSavings: number;
  topCorridor?: CorridorUsage;
  topProvider?: ProviderPerformance;
}
