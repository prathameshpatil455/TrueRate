import type {
  AnalyticsOverview,
  CorridorUsage,
  CountryAnalytics,
  FeeComparisonPoint,
  MonthlySavings,
  ProviderPerformance,
  RateHistoryPoint,
} from "@truerate/shared";
import { apiRequest } from "./apiClient";

export function fetchAnalyticsOverview(): Promise<AnalyticsOverview> {
  return apiRequest<AnalyticsOverview>("/api/v1/analytics/overview");
}

export function fetchMonthlySavings(): Promise<MonthlySavings[]> {
  return apiRequest<MonthlySavings[]>("/api/v1/analytics/savings");
}

export function fetchProviderPerformance(): Promise<ProviderPerformance[]> {
  return apiRequest<ProviderPerformance[]>("/api/v1/analytics/providers");
}

export function fetchCorridorUsage(): Promise<CorridorUsage[]> {
  return apiRequest<CorridorUsage[]>("/api/v1/analytics/corridors");
}

export function fetchCountryAnalytics(): Promise<CountryAnalytics[]> {
  return apiRequest<CountryAnalytics[]>("/api/v1/analytics/countries");
}

export function fetchFeeComparison(): Promise<FeeComparisonPoint[]> {
  return apiRequest<FeeComparisonPoint[]>("/api/v1/analytics/fees");
}

export function fetchRateHistory(
  base: string,
  quote: string,
  days = 30,
): Promise<RateHistoryPoint[]> {
  return apiRequest<RateHistoryPoint[]>(
    `/api/v1/analytics/rates/${base}/${quote}?days=${days}`,
  );
}
