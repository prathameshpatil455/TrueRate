import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { COMPARISON_DISCLAIMER } from "@truerate/shared";
import {
  ComparisonForm,
  type ComparisonFormValues,
} from "@/components/organisms/ComparisonForm";
import { ComparisonTable } from "@/components/organisms/ComparisonTable";
import { SavedCorridorsPanel } from "@/components/organisms/SavedCorridorsPanel";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  buildComparisonSearchParams,
  parseComparisonSearchParams,
} from "@/helpers/comparisonUrl";
import { runComparison } from "@/services/comparisonService";
import { cn } from "@/utils/cn";

export function ComparePage() {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const autoRanRef = useRef(false);

  const urlValues = useMemo(
    () => parseComparisonSearchParams(searchParams),
    [searchParams],
  );

  const profileDefaults = useMemo((): Partial<ComparisonFormValues> | undefined => {
    if (!user || urlValues) return undefined;
    return {
      sourceCurrency: user.defaultSourceCurrency,
      destCurrency: user.defaultDestCurrency,
    };
  }, [user, urlValues]);

  const [formSeed, setFormSeed] = useState<Partial<ComparisonFormValues> | undefined>(
    () => urlValues ?? profileDefaults,
  );
  const [formResetKey, setFormResetKey] = useState("initial");
  const [selectedCorridor, setSelectedCorridor] = useState<ComparisonFormValues | null>(
    null,
  );

  useEffect(() => {
    if (urlValues) {
      setFormSeed(urlValues);
      setFormResetKey(`url-${searchParams.toString()}`);
    } else if (profileDefaults) {
      setFormSeed(profileDefaults);
      setFormResetKey(`profile-${user?.id}`);
    }
  }, [urlValues, profileDefaults, searchParams, user?.id]);

  const mutation = useMutation({
    mutationFn: runComparison,
    onSuccess: (_result, variables) => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["comparison-history"] });
      }
      const params = buildComparisonSearchParams(variables);
      setSearchParams(params, { replace: true });
    },
  });

  const handleSubmit = useCallback(
    (values: ComparisonFormValues) => {
      mutation.mutate(values);
    },
    [mutation],
  );

  const { mutate, isPending, data, variables } = mutation;

  useEffect(() => {
    autoRanRef.current = false;
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!urlValues || autoRanRef.current || isPending) return;
    autoRanRef.current = true;
    mutate(urlValues);
  }, [urlValues, mutate, isPending]);

  const handleShare = async () => {
    const params = variables
      ? buildComparisonSearchParams(variables)
      : urlValues
        ? buildComparisonSearchParams(urlValues)
        : null;

    if (!params) {
      showToast("Run a comparison first to share.", "error");
      return;
    }

    const url = `${window.location.origin}/?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    showToast("Comparison link copied.");
  };

  const handleSavedPairSelect = (pair: {
    id: string;
    sourceCurrency: string;
    destCurrency: string;
    sourceCountry?: string;
    destCountry?: string;
  }) => {
    setFormSeed({
      sourceCurrency: pair.sourceCurrency,
      destCurrency: pair.destCurrency,
      sourceCountry: pair.sourceCountry,
      destCountry: pair.destCountry,
      sendAmount: selectedCorridor?.sendAmount ?? urlValues?.sendAmount ?? 1000,
      priority: selectedCorridor?.priority ?? urlValues?.priority ?? "balanced",
    });
    setFormResetKey(pair.id);
  };

  return (
    <div className={cn("space-y-8")}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Cross-border payment comparison
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Compare SWIFT, remittance apps, stablecoins, and crypto rails — see true
          costs, effective rates, and the best route for your priority.
        </p>
      </div>

      {isAuthenticated && (
        <SavedCorridorsPanel
          selected={selectedCorridor}
          onSelect={handleSavedPairSelect}
        />
      )}

      <ComparisonForm
        loading={isPending}
        onSubmit={handleSubmit}
        initialValues={formSeed}
        resetKey={formResetKey}
        onCorridorChange={setSelectedCorridor}
      />

      {mutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Comparison failed. Please try again."}
        </div>
      )}

      {data && (
        <ComparisonTable
          result={data}
          onShare={handleShare}
        />
      )}

      {!data && (
        <p className="text-xs text-slate-500">{COMPARISON_DISCLAIMER}</p>
      )}
    </div>
  );
}
