import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SavedCurrencyPair } from "@truerate/shared";
import { Button } from "@/components/atoms/Button";
import {
  createSavedPair,
  deleteSavedPair,
  fetchSavedPairs,
} from "@/services/authService";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/utils/cn";

interface SavedCorridorsPanelProps {
  selected: {
    sourceCurrency: string;
    destCurrency: string;
    sourceCountry?: string;
    destCountry?: string;
  } | null;
  onSelect: (pair: SavedCurrencyPair) => void;
}

export function SavedCorridorsPanel({
  selected,
  onSelect,
}: SavedCorridorsPanelProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const pairsQuery = useQuery({
    queryKey: ["saved-pairs"],
    queryFn: fetchSavedPairs,
  });

  const saveMutation = useMutation({
    mutationFn: createSavedPair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-pairs"] });
      showToast("Corridor saved.");
    },
    onError: () => {
      showToast("This corridor is already saved.", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSavedPair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-pairs"] });
      showToast("Corridor removed.");
    },
  });

  const pairs = pairsQuery.data ?? [];
  const canSave = Boolean(selected);

  const handleSave = () => {
    if (!selected) return;
    saveMutation.mutate({
      sourceCurrency: selected.sourceCurrency,
      destCurrency: selected.destCurrency,
      sourceCountry: selected.sourceCountry,
      destCountry: selected.destCountry,
    });
  };

  return (
    <section className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-sm")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Saved corridors</h2>
          <p className="text-xs text-slate-500">Quick access to your frequent routes.</p>
        </div>
        <Button
          variant="secondary"
          disabled={!canSave || saveMutation.isPending}
          onClick={handleSave}
        >
          Save current corridor
        </Button>
      </div>

      {pairsQuery.isLoading && (
        <p className="mt-3 text-sm text-slate-500">Loading saved corridors…</p>
      )}

      {!pairsQuery.isLoading && pairs.length === 0 && (
        <p className="mt-3 text-sm text-slate-500">No saved corridors yet.</p>
      )}

      {pairs.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {pairs.map((pair) => (
            <li key={pair.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(pair)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  selected?.sourceCurrency === pair.sourceCurrency &&
                    selected?.destCurrency === pair.destCurrency
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400",
                )}
              >
                {pair.label ??
                  `${pair.sourceCurrency} → ${pair.destCurrency}`}
              </button>
              <button
                type="button"
                aria-label="Remove saved corridor"
                className="rounded-full px-1 text-slate-400 hover:text-red-600"
                onClick={() => deleteMutation.mutate(pair.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
