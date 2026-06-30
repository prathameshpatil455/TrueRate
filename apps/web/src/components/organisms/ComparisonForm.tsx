import { useEffect, useMemo, useState } from "react";
import type { ComparisonPriority, CorridorOption } from "@truerate/shared";
import { COMPARISON_PRIORITIES, getAmountPresets } from "@truerate/shared";
import { Button } from "@/components/atoms/Button";
import { InputField } from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import { formatMoney } from "@/helpers/format";
import { fetchCorridors } from "@/services/comparisonService";
import { cn } from "@/utils/cn";

export interface ComparisonFormValues {
  sendAmount: number;
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  priority: ComparisonPriority;
}

interface ComparisonFormProps {
  loading: boolean;
  onSubmit: (values: ComparisonFormValues) => void;
  initialValues?: Partial<ComparisonFormValues>;
  resetKey?: string;
  onCorridorChange?: (values: ComparisonFormValues | null) => void;
}

function findCorridorIndex(
  corridors: CorridorOption[],
  values: Partial<ComparisonFormValues>,
): number {
  const index = corridors.findIndex(
    (corridor) =>
      corridor.sourceCurrency === values.sourceCurrency &&
      corridor.destCurrency === values.destCurrency &&
      (values.sourceCountry
        ? corridor.sourceCountry === values.sourceCountry
        : true) &&
      (values.destCountry ? corridor.destCountry === values.destCountry : true),
  );
  return index >= 0 ? index : 0;
}

export function ComparisonForm({
  loading,
  onSubmit,
  initialValues,
  resetKey,
  onCorridorChange,
}: ComparisonFormProps) {
  const [corridors, setCorridors] = useState<CorridorOption[]>([]);
  const [corridorIndex, setCorridorIndex] = useState("0");
  const [sendAmount, setSendAmount] = useState(
    String(initialValues?.sendAmount ?? 1000),
  );
  const [priority, setPriority] = useState<ComparisonPriority>(
    initialValues?.priority ?? "balanced",
  );

  useEffect(() => {
    fetchCorridors().then(setCorridors).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (corridors.length === 0 || !initialValues?.sourceCurrency) return;
    setCorridorIndex(String(findCorridorIndex(corridors, initialValues)));
    if (initialValues.sendAmount !== undefined) {
      setSendAmount(String(initialValues.sendAmount));
    }
    if (initialValues.priority) {
      setPriority(initialValues.priority);
    }
  }, [corridors, initialValues, resetKey]);

  const selectedCorridor = corridors[Number(corridorIndex)];
  const sourceCurrency = selectedCorridor?.sourceCurrency ?? "USD";
  const amountPresets = getAmountPresets(sourceCurrency);

  const currentValues = useMemo((): ComparisonFormValues | null => {
    if (!selectedCorridor) return null;
    return {
      sendAmount: Number(sendAmount),
      sourceCurrency: selectedCorridor.sourceCurrency,
      destCurrency: selectedCorridor.destCurrency,
      sourceCountry: selectedCorridor.sourceCountry,
      destCountry: selectedCorridor.destCountry,
      priority,
    };
  }, [selectedCorridor, sendAmount, priority]);

  useEffect(() => {
    onCorridorChange?.(currentValues);
  }, [currentValues, onCorridorChange]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentValues || !Number.isFinite(currentValues.sendAmount)) return;
    onSubmit(currentValues);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h2 className="text-lg font-semibold text-slate-900">Compare routes</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your transfer details to see fees, rates, and recommendations.
        </p>
      </div>

      <div className="sm:col-span-2">
        <SelectField
          label="Corridor"
          value={corridorIndex}
          onChange={(e) => setCorridorIndex(e.target.value)}
          disabled={corridors.length === 0}
        >
          {corridors.map((corridor, index) => (
            <option
              key={`${corridor.sourceCountry}-${corridor.destCountry}-${corridor.sourceCurrency}-${corridor.destCurrency}`}
              value={index}
            >
              {corridor.label} ({corridor.sourceCurrency} → {corridor.destCurrency})
            </option>
          ))}
        </SelectField>
        <p className="mt-1.5 text-xs text-slate-500">
          A corridor is where you send money from and where it arrives — the country
          and currency pair (e.g. India → United Kingdom, INR → GBP).
        </p>
      </div>

      <div className="sm:col-span-2">
        <InputField
          label={`Send amount (${sourceCurrency})`}
          type="number"
          min="1"
          step="0.01"
          required
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {amountPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSendAmount(String(preset))}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                Number(sendAmount) === preset
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-600 hover:border-slate-400",
              )}
            >
              {formatMoney(preset, sourceCurrency)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SelectField
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as ComparisonPriority)}
        >
          {COMPARISON_PRIORITIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <p className="mt-1.5 text-xs text-slate-500">
          How TrueRate ranks routes — by cost, speed, amount received, or rail type.
        </p>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading || !selectedCorridor} className="w-full sm:w-auto">
          {loading ? "Comparing…" : "Compare routes"}
        </Button>
      </div>
    </form>
  );
}
