import type { ComparisonResult } from "@truerate/shared";
import { EXPORT_FOOTER_DISCLAIMER } from "@truerate/shared";

export function exportComparisonCsv(result: ComparisonResult): void {
  const headers = [
    "Rank",
    "Provider",
    "Type",
    "Platform Fee",
    "FX Markup",
    "Network Fee",
    "Total Fee",
    "Effective Rate",
    "Amount Received",
    "Est. Time (hours)",
    "Recommended",
  ];

  const rows = result.routes.map((route) => [
    route.rank,
    route.providerName,
    route.providerType,
    route.platformFee,
    route.fxMarkup,
    route.networkFee,
    route.totalFee,
    route.effectiveRate,
    route.amountReceived,
    route.estimatedTimeHours,
    route.isRecommended ? "Yes" : "No",
  ]);

  const meta = [
    [`Send Amount`, result.sendAmount],
    [`Source Currency`, result.sourceCurrency],
    [`Destination Currency`, result.destCurrency],
    [`Mid-Market Rate`, result.midMarketRate],
    [`Rate Fetched At`, result.fxRateFetchedAt],
    [`Priority`, result.priority],
    [],
    [EXPORT_FOOTER_DISCLAIMER],
    [],
  ];

  const csv = [...meta, headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `truerate-comparison-${result.id.slice(0, 8)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
