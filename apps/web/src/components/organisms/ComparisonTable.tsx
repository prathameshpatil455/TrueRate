import { useMemo, useState } from "react";
import type { ComparisonResult, ProviderType } from "@truerate/shared";
import { PROVIDER_TYPE_LABELS } from "@truerate/shared";
import { Button } from "@/components/atoms/Button";
import { SelectField } from "@/components/atoms/SelectField";
import { SavingsHero } from "@/components/molecules/SavingsHero";
import { exportComparisonCsv } from "@/helpers/exportCsv";
import { downloadComparisonPdf } from "@/services/comparisonService";
import { useAuth } from "@/context/AuthContext";
import {
  formatDate,
  formatDuration,
  formatMoney,
  formatRate,
} from "@/helpers/format";
import { cn } from "@/utils/cn";

type SortKey = "rank" | "totalFee" | "estimatedTimeHours";
type FilterType = "all" | ProviderType;

interface ComparisonTableProps {
  result: ComparisonResult;
  onShare?: () => void;
}

const SORT_OPTIONS = [
  { value: "rank", label: "Recommendation" },
  { value: "totalFee", label: "Total fee" },
  { value: "estimatedTimeHours", label: "Speed" },
];

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "swift", label: "SWIFT" },
  { value: "remittance", label: "Remittance" },
  { value: "stablecoin", label: "Stablecoin" },
  { value: "crypto", label: "Crypto" },
];

export function ComparisonTable({ result, onShare }: ComparisonTableProps) {
  const { isAuthenticated } = useAuth();
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const routes = useMemo(() => {
    let filtered = result.routes;
    if (filterType !== "all") {
      filtered = filtered.filter((r) => r.providerType === filterType);
    }

    return [...filtered].sort((a, b) => {
      if (sortKey === "rank") return a.rank - b.rank;
      return a[sortKey] - b[sortKey];
    });
  }, [result.routes, sortKey, filterType]);

  const recommended = result.routes.find((r) => r.isRecommended);

  return (
    <section className="space-y-4">
      <SavingsHero result={result} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Results</h2>
          <p className="mt-1 text-sm text-slate-500">
            Mid-market rate: {formatRate(result.midMarketRate)}{" "}
            {result.destCurrency}/{result.sourceCurrency} · Updated{" "}
            {formatDate(result.fxRateFetchedAt)} via {result.fxRateSource}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onShare && (
            <Button variant="secondary" onClick={onShare}>
              Share link
            </Button>
          )}
          <Button variant="secondary" onClick={() => exportComparisonCsv(result)}>
            Export CSV
          </Button>
          {isAuthenticated && (
            <Button
              variant="secondary"
              onClick={() => downloadComparisonPdf(result.id)}
            >
              Export PDF
            </Button>
          )}
        </div>
      </div>

      {recommended && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-900">
            Recommended: {recommended.providerName}
          </p>
          <p className="mt-1 text-sm text-emerald-800">{recommended.explanation}</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField
          label="Sort by"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Filter by type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Total fee</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr
                key={route.routeId}
                className={cn(
                  "border-b border-slate-100 last:border-0",
                  route.isRecommended && "bg-emerald-50/60",
                )}
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {route.providerName}
                  {route.isRecommended && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      Best
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {PROVIDER_TYPE_LABELS[route.providerType]}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {formatMoney(route.totalFee, result.sourceCurrency)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Platform {formatMoney(route.platformFee, result.sourceCurrency)} · FX{" "}
                    {formatMoney(route.fxMarkup, result.sourceCurrency)} · Net{" "}
                    {formatMoney(route.networkFee, result.sourceCurrency)}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatMoney(route.amountReceived, result.destCurrency)}
                </td>
                <td className="px-4 py-3">{formatRate(route.effectiveRate)}</td>
                <td className="px-4 py-3">{formatDuration(route.estimatedTimeHours)}</td>
                <td className="px-4 py-3">
                  {route.providerUrl && (
                    <a
                      href={route.providerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap text-sm font-medium text-slate-900 hover:underline"
                    >
                      Go →
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">{result.disclaimer}</p>
    </section>
  );
}
