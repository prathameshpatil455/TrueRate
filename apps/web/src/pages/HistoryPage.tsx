import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import type { ComparisonPriority } from "@truerate/shared";
import { InputField } from "@/components/atoms/InputField";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatMoney } from "@/helpers/format";
import { buildComparePath } from "@/helpers/comparisonUrl";
import { fetchComparisonHistory } from "@/services/authService";
import { searchComparisons } from "@/services/comparisonService";
import { cn } from "@/utils/cn";

export function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const historyQuery = useQuery({
    queryKey: ["comparison-history"],
    queryFn: () => fetchComparisonHistory(),
    enabled: isAuthenticated && !activeQuery,
  });

  const searchQuery = useQuery({
    queryKey: ["comparison-search", activeQuery],
    queryFn: () => searchComparisons(activeQuery),
    enabled: isAuthenticated && Boolean(activeQuery),
  });

  const data = activeQuery ? searchQuery.data : historyQuery.data;
  const isLoading = activeQuery ? searchQuery.isLoading : historyQuery.isLoading;
  const error = activeQuery ? searchQuery.error : historyQuery.error;

  if (authLoading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setActiveQuery(search.trim());
  };

  return (
    <div className={cn("space-y-6")}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Comparison history</h1>
        <p className="mt-1 text-sm text-slate-500">
          Past comparisons are saved automatically when you are signed in.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <InputField
          label="Search"
          className="flex-1"
          placeholder="USD, INR, wise, balanced…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Search
        </button>
      </form>

      {activeQuery && (
        <button
          type="button"
          className="text-sm text-slate-500 hover:text-slate-900"
          onClick={() => {
            setActiveQuery("");
            setSearch("");
          }}
        >
          Clear search
        </button>
      )}

      {isLoading && <p className="text-sm text-slate-500">Loading history…</p>}

      {error && (
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load history"}
        </p>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">No comparisons found.</p>
          <Link to="/" className="mt-2 inline-block text-sm font-medium text-slate-900 hover:underline">
            Run a comparison
          </Link>
        </div>
      )}

      {data && data.items.length > 0 && (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {data.items.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to={`/history/${item.id}`}
                className="flex-1 transition-colors hover:text-slate-700"
              >
                <p className="font-medium text-slate-900">
                  {formatMoney(item.sendAmount, item.sourceCurrency)} → {item.destCurrency}
                </p>
                <p className="text-sm text-slate-500">
                  {item.priority} · {formatDate(item.createdAt)}
                </p>
              </Link>
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-600">
                  Best: <span className="font-medium">{item.recommendedRouteId}</span>
                </p>
                <Link
                  to={buildComparePath({
                    sendAmount: item.sendAmount,
                    sourceCurrency: item.sourceCurrency,
                    destCurrency: item.destCurrency,
                    sourceCountry: item.sourceCountry,
                    destCountry: item.destCountry,
                    priority: item.priority as ComparisonPriority,
                  })}
                  className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  Compare again
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
