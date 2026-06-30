import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import {
  fetchAnalyticsOverview,
  fetchCorridorUsage,
  fetchCountryAnalytics,
  fetchFeeComparison,
  fetchMonthlySavings,
  fetchProviderPerformance,
  fetchRateHistory,
} from "@/services/analyticsService";
import { cn } from "@/utils/cn";

export function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const overview = useQuery({ queryKey: ["analytics-overview"], queryFn: fetchAnalyticsOverview, enabled: isAuthenticated });
  const savings = useQuery({ queryKey: ["analytics-savings"], queryFn: fetchMonthlySavings, enabled: isAuthenticated });
  const fees = useQuery({ queryKey: ["analytics-fees"], queryFn: fetchFeeComparison, enabled: isAuthenticated });
  const providers = useQuery({ queryKey: ["analytics-providers"], queryFn: fetchProviderPerformance, enabled: isAuthenticated });
  const corridors = useQuery({ queryKey: ["analytics-corridors"], queryFn: fetchCorridorUsage, enabled: isAuthenticated });
  const countries = useQuery({ queryKey: ["analytics-countries"], queryFn: fetchCountryAnalytics, enabled: isAuthenticated });
  const rates = useQuery({
    queryKey: ["analytics-rates"],
    queryFn: () => fetchRateHistory("USD", "INR", 30),
    enabled: isAuthenticated,
  });

  if (authLoading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className={cn("space-y-8")}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">
          Insights from your comparison history and rate snapshots.
        </p>
      </div>

      {overview.data && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total comparisons" value={String(overview.data.totalComparisons)} />
          <StatCard
            label="Est. savings (dest. currency)"
            value={overview.data.totalEstimatedSavings.toFixed(0)}
          />
          <StatCard
            label="Top corridor"
            value={
              overview.data.topCorridor
                ? `${overview.data.topCorridor.sourceCurrency}→${overview.data.topCorridor.destCurrency}`
                : "—"
            }
          />
        </div>
      )}

      <ChartCard title="Exchange rate history (USD → INR)">
        {rates.data && rates.data.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={rates.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="recordedAt" tickFormatter={(v) => v.slice(5, 10)} fontSize={11} />
              <YAxis fontSize={11} domain={["auto", "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#0f172a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500">Rate history builds up as you run comparisons.</p>
        )}
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly savings estimate">
          {savings.data && savings.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[...savings.data].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="estimatedSavings" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">Run comparisons to see savings over time.</p>
          )}
        </ChartCard>

        <ChartCard title="Avg fee by provider">
          {fees.data && fees.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fees.data} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" fontSize={11} />
                <YAxis type="category" dataKey="providerName" fontSize={10} width={80} />
                <Tooltip />
                <Bar dataKey="avgTotalFee" fill="#334155" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">No fee data yet.</p>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Most-used corridors">
          <ul className="space-y-2 text-sm">
            {corridors.data?.map((c) => (
              <li key={`${c.sourceCurrency}-${c.destCurrency}`} className="flex justify-between">
                <span>{c.sourceCurrency} → {c.destCurrency}</span>
                <span className="font-medium">{c.count}</span>
              </li>
            )) ?? <p className="text-slate-500">No corridor data yet.</p>}
          </ul>
        </ChartCard>

        <ChartCard title="Destination countries">
          <ul className="space-y-2 text-sm">
            {countries.data?.map((c) => (
              <li key={c.destCountry} className="flex justify-between">
                <span>{c.destCountry}</span>
                <span className="font-medium">{c.comparisonCount} comparisons</span>
              </li>
            )) ?? <p className="text-slate-500">No country data yet.</p>}
          </ul>
        </ChartCard>
      </div>

      {providers.data && providers.data.length > 0 && (
        <ChartCard title="Provider performance">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="pb-2">Provider</th>
                  <th className="pb-2">Avg fee</th>
                  <th className="pb-2">Avg received</th>
                  <th className="pb-2">Uses</th>
                </tr>
              </thead>
              <tbody>
                {providers.data.map((p) => (
                  <tr key={p.routeId} className="border-t border-slate-100">
                    <td className="py-2 font-medium">{p.providerName}</td>
                    <td className="py-2">{p.avgTotalFee.toFixed(2)}</td>
                    <td className="py-2">{p.avgAmountReceived.toFixed(0)}</td>
                    <td className="py-2">{p.usageCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
