import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useParams } from "react-router-dom";
import { ComparisonTable } from "@/components/organisms/ComparisonTable";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/context/AuthContext";
import { fetchComparisonById, downloadComparisonPdf } from "@/services/comparisonService";
import { cn } from "@/utils/cn";

export function ComparisonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["comparison", id],
    queryFn: () => fetchComparisonById(id!),
    enabled: Boolean(id) && isAuthenticated,
  });

  if (authLoading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className={cn("space-y-6")}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/history" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to history
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Comparison detail</h1>
        </div>
        {data && (
          <Button
            variant="secondary"
            onClick={() => downloadComparisonPdf(data.id)}
          >
            Download PDF
          </Button>
        )}
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">Comparison not found.</p>}
      {data && <ComparisonTable result={data} />}
    </div>
  );
}
