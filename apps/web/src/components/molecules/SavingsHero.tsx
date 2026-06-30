import type { ComparisonResult } from "@truerate/shared";
import { FeeBreakdown } from "@/components/molecules/FeeBreakdown";
import { computeSavingsSummary } from "@/helpers/savings";
import { formatMoney } from "@/helpers/format";
import { cn } from "@/utils/cn";

interface SavingsHeroProps {
  result: ComparisonResult;
}

export function SavingsHero({ result }: SavingsHeroProps) {
  const summary = computeSavingsSummary(result);
  const recommended = result.routes.find((route) => route.isRecommended);
  if (!summary || !recommended) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm",
      )}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
        Your best option
      </p>
      <p className="mt-1 text-2xl font-bold text-emerald-950">
        {summary.recommendedName}
      </p>
      <p className="mt-2 text-sm text-emerald-900">
        Receive up to{" "}
        <span className="font-semibold">
          {formatMoney(summary.savings, result.destCurrency)} more
        </span>{" "}
        than {summary.worstName} on this transfer.
      </p>
      <div className="mt-4 rounded-lg border border-emerald-200/80 bg-white/60 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
          Fee breakdown
        </p>
        <FeeBreakdown
          variant="stacked"
          className="mt-2 text-emerald-950"
          platformFee={recommended.platformFee}
          fxMarkup={recommended.fxMarkup}
          networkFee={recommended.networkFee}
          currency={result.sourceCurrency}
        />
      </div>
    </div>
  );
}
