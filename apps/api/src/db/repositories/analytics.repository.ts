import type {
  AnalyticsOverview,
  CorridorUsage,
  CountryAnalytics,
  FeeComparisonPoint,
  MonthlySavings,
  ProviderPerformance,
} from "@truerate/shared";
import { getUserComparisons } from "./comparisons.repository.js";
import type { StoredComparison } from "../storage/types.js";

function routeSpread(comparison: StoredComparison): number {
  if (comparison.routes.length === 0) return 0;
  const received = comparison.routes.map((r) => r.amountReceived);
  return Math.max(...received) - Math.min(...received);
}

export async function getMonthlySavings(userId: string): Promise<MonthlySavings[]> {
  const comparisons = getUserComparisons(userId);
  const byMonth = new Map<string, MonthlySavings>();

  for (const c of comparisons) {
    const month = c.createdAt.slice(0, 7);
    const key = `${month}-${c.destCurrency}`;
    const existing = byMonth.get(key) ?? {
      month,
      estimatedSavings: 0,
      destCurrency: c.destCurrency,
      comparisonCount: 0,
    };
    existing.estimatedSavings += routeSpread(c);
    existing.comparisonCount += 1;
    byMonth.set(key, existing);
  }

  return [...byMonth.values()]
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12);
}

export async function getProviderPerformance(
  userId: string,
): Promise<ProviderPerformance[]> {
  const comparisons = getUserComparisons(userId);
  const stats = new Map<
    string,
    {
      routeId: string;
      providerName: string;
      providerType: string;
      totalFee: number;
      totalReceived: number;
      count: number;
    }
  >();

  for (const c of comparisons) {
    for (const route of c.routes) {
      const key = route.routeId;
      const existing = stats.get(key) ?? {
        routeId: route.routeId,
        providerName: route.providerName,
        providerType: route.providerType,
        totalFee: 0,
        totalReceived: 0,
        count: 0,
      };
      existing.totalFee += route.totalFee;
      existing.totalReceived += route.amountReceived;
      existing.count += 1;
      stats.set(key, existing);
    }
  }

  return [...stats.values()]
    .map((s) => ({
      routeId: s.routeId,
      providerName: s.providerName,
      providerType: s.providerType,
      avgTotalFee: s.totalFee / s.count,
      avgAmountReceived: s.totalReceived / s.count,
      usageCount: s.count,
    }))
    .sort((a, b) => b.usageCount - a.usageCount);
}

export async function getCorridorUsage(userId: string): Promise<CorridorUsage[]> {
  const comparisons = getUserComparisons(userId);
  const counts = new Map<string, CorridorUsage>();

  for (const c of comparisons) {
    const key = `${c.sourceCurrency}-${c.destCurrency}-${c.sourceCountry ?? ""}-${c.destCountry ?? ""}`;
    const existing = counts.get(key) ?? {
      sourceCurrency: c.sourceCurrency,
      destCurrency: c.destCurrency,
      sourceCountry: c.sourceCountry,
      destCountry: c.destCountry,
      count: 0,
    };
    existing.count += 1;
    counts.set(key, existing);
  }

  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 10);
}

export async function getCountryAnalytics(
  userId: string,
): Promise<CountryAnalytics[]> {
  const comparisons = getUserComparisons(userId).filter((c) => c.destCountry);
  const stats = new Map<string, CountryAnalytics>();

  for (const c of comparisons) {
    const country = c.destCountry!;
    const existing = stats.get(country) ?? {
      destCountry: country,
      comparisonCount: 0,
      totalSendVolume: 0,
    };
    existing.comparisonCount += 1;
    existing.totalSendVolume += c.sendAmount;
    stats.set(country, existing);
  }

  return [...stats.values()].sort((a, b) => b.comparisonCount - a.comparisonCount);
}

export async function getFeeComparison(
  userId: string,
): Promise<FeeComparisonPoint[]> {
  const comparisons = getUserComparisons(userId);
  const stats = new Map<string, { routeId: string; providerName: string; total: number; count: number }>();

  for (const c of comparisons) {
    for (const route of c.routes) {
      const existing = stats.get(route.routeId) ?? {
        routeId: route.routeId,
        providerName: route.providerName,
        total: 0,
        count: 0,
      };
      existing.total += route.totalFee;
      existing.count += 1;
      stats.set(route.routeId, existing);
    }
  }

  return [...stats.values()]
    .map((s) => ({
      routeId: s.routeId,
      providerName: s.providerName,
      avgTotalFee: s.total / s.count,
    }))
    .sort((a, b) => a.avgTotalFee - b.avgTotalFee);
}

export async function getAnalyticsOverview(
  userId: string,
): Promise<AnalyticsOverview> {
  const comparisons = getUserComparisons(userId);
  const corridors = await getCorridorUsage(userId);
  const providers = await getProviderPerformance(userId);

  return {
    totalComparisons: comparisons.length,
    totalEstimatedSavings: comparisons.reduce((sum, c) => sum + routeSpread(c), 0),
    topCorridor: corridors[0],
    topProvider: providers[0],
  };
}
