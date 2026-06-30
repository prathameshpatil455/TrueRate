import type { ComparisonResult } from "@truerate/shared";

export interface SavingsSummary {
  savings: number;
  recommendedName: string;
  worstName: string;
}

export function computeSavingsSummary(result: ComparisonResult): SavingsSummary | null {
  if (result.routes.length < 2) return null;

  const sorted = [...result.routes].sort(
    (a, b) => b.amountReceived - a.amountReceived,
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const savings = best.amountReceived - worst.amountReceived;

  if (savings <= 0) return null;

  const recommended =
    result.routes.find((route) => route.isRecommended) ?? best;

  return {
    savings,
    recommendedName: recommended.providerName,
    worstName: worst.providerName,
  };
}
