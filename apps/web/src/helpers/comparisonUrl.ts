import type { ComparisonFormValues } from "@/components/organisms/ComparisonForm";
import { COMPARISON_PRIORITY_VALUES, type ComparisonPriority } from "@truerate/shared";

const PRIORITIES = COMPARISON_PRIORITY_VALUES as ComparisonPriority[];

export function buildComparisonSearchParams(
  values: ComparisonFormValues,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("amount", String(values.sendAmount));
  params.set("source", values.sourceCurrency);
  params.set("dest", values.destCurrency);
  params.set("priority", values.priority);
  if (values.sourceCountry) params.set("sourceCountry", values.sourceCountry);
  if (values.destCountry) params.set("destCountry", values.destCountry);
  return params;
}

export function parseComparisonSearchParams(
  searchParams: URLSearchParams,
): ComparisonFormValues | null {
  const amount = Number(searchParams.get("amount"));
  const source = searchParams.get("source")?.toUpperCase();
  const dest = searchParams.get("dest")?.toUpperCase();
  const priority = searchParams.get("priority") as ComparisonPriority | null;

  if (!amount || amount <= 0 || !source || !dest || !priority) {
    return null;
  }

  if (!PRIORITIES.includes(priority)) {
    return null;
  }

  return {
    sendAmount: amount,
    sourceCurrency: source,
    destCurrency: dest,
    sourceCountry: searchParams.get("sourceCountry") ?? undefined,
    destCountry: searchParams.get("destCountry") ?? undefined,
    priority,
  };
}

export function buildComparePath(values: ComparisonFormValues): string {
  return `/?${buildComparisonSearchParams(values).toString()}`;
}
