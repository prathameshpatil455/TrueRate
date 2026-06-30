import type {
  ComparisonRequest,
  ComparisonResult,
  ComparisonSummary,
  CorridorOption,
  CurrencyOption,
} from "@truerate/shared";
import { apiRequest, apiRequestWithMeta, downloadAuthenticatedFile } from "./apiClient";

export function fetchCurrencies(): Promise<CurrencyOption[]> {
  return apiRequest<CurrencyOption[]>("/api/v1/currencies");
}

export function fetchCorridors(): Promise<CorridorOption[]> {
  return apiRequest<CorridorOption[]>("/api/v1/corridors");
}

export function runComparison(
  request: ComparisonRequest,
): Promise<ComparisonResult> {
  return apiRequest<ComparisonResult>("/api/v1/comparisons", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function fetchComparisonById(id: string): Promise<ComparisonResult> {
  return apiRequest<ComparisonResult>(`/api/v1/comparisons/${id}`);
}

export async function searchComparisons(
  query: string,
  page = 1,
  limit = 20,
): Promise<{ items: ComparisonSummary[]; meta: { page: number; limit: number; total: number } }> {
  const { data, meta } = await apiRequestWithMeta<ComparisonSummary[]>(
    `/api/v1/comparisons/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
  );
  return { items: data, meta: meta as { page: number; limit: number; total: number } };
}

export function downloadComparisonPdf(id: string): Promise<void> {
  return downloadAuthenticatedFile(
    `/api/v1/comparisons/${id}/export/pdf`,
    `truerate-${id.slice(0, 8)}.pdf`,
  );
}
