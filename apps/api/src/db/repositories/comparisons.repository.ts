import type { ComparisonResult, ComparisonSummary } from "@truerate/shared";
import {
  mutateCollection,
  readCollection,
} from "../json-store.js";
import type { StoredComparison } from "../storage/types.js";

function toSummary(row: StoredComparison): ComparisonSummary {
  return {
    id: row.id,
    sendAmount: row.sendAmount,
    sourceCurrency: row.sourceCurrency,
    destCurrency: row.destCurrency,
    sourceCountry: row.sourceCountry,
    destCountry: row.destCountry,
    priority: row.priority,
    recommendedRouteId: row.recommendedRouteId,
    midMarketRate: row.midMarketRate,
    createdAt: row.createdAt,
  };
}

function matchesSearch(row: StoredComparison, query: string): boolean {
  const q = query.toLowerCase();
  return (
    row.sourceCurrency.toLowerCase().includes(q) ||
    row.destCurrency.toLowerCase().includes(q) ||
    (row.sourceCountry?.toLowerCase().includes(q) ?? false) ||
    (row.destCountry?.toLowerCase().includes(q) ?? false) ||
    row.priority.toLowerCase().includes(q) ||
    row.recommendedRouteId.toLowerCase().includes(q)
  );
}

export async function saveComparison(
  result: ComparisonResult,
  userId: string,
): Promise<void> {
  const stored: StoredComparison = {
    ...result,
    userId,
    createdAt: new Date().toISOString(),
  };
  mutateCollection<StoredComparison>("comparisons", (items) => [...items, stored]);
}

export async function listComparisons(
  userId: string,
  page: number,
  limit: number,
): Promise<{ items: ComparisonSummary[]; total: number }> {
  const all = readCollection<StoredComparison>("comparisons")
    .filter((c) => c.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const offset = (page - 1) * limit;
  const items = all.slice(offset, offset + limit).map(toSummary);
  return { items, total: all.length };
}

export async function getComparisonById(
  id: string,
  userId: string,
): Promise<ComparisonResult | null> {
  const row = readCollection<StoredComparison>("comparisons").find(
    (c) => c.id === id && c.userId === userId,
  );
  if (!row) return null;

  return {
    id: row.id,
    sendAmount: row.sendAmount,
    sourceCurrency: row.sourceCurrency,
    destCurrency: row.destCurrency,
    sourceCountry: row.sourceCountry,
    destCountry: row.destCountry,
    midMarketRate: row.midMarketRate,
    fxRateFetchedAt: row.fxRateFetchedAt,
    fxRateSource: row.fxRateSource ?? "stored",
    priority: row.priority,
    disclaimer: "",
    recommendedRouteId: row.recommendedRouteId,
    routes: row.routes,
  };
}

export async function searchComparisons(
  userId: string,
  query: string,
  page: number,
  limit: number,
): Promise<{ items: ComparisonSummary[]; total: number }> {
  const all = readCollection<StoredComparison>("comparisons")
    .filter((c) => c.userId === userId && matchesSearch(c, query))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const offset = (page - 1) * limit;
  return {
    items: all.slice(offset, offset + limit).map(toSummary),
    total: all.length,
  };
}

export async function comparisonOwnedByUser(
  id: string,
  userId: string,
): Promise<boolean> {
  return readCollection<StoredComparison>("comparisons").some(
    (c) => c.id === id && c.userId === userId,
  );
}

export function getUserComparisons(userId: string): StoredComparison[] {
  return readCollection<StoredComparison>("comparisons").filter(
    (c) => c.userId === userId,
  );
}
