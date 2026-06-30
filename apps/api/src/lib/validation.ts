import type { ComparisonPriority } from "@truerate/shared";
import { COMPARISON_PRIORITY_VALUES, MVP_CORRIDORS, SUPPORTED_CURRENCIES } from "@truerate/shared";

const PRIORITIES = COMPARISON_PRIORITY_VALUES as ComparisonPriority[];
const CURRENCY_CODES = new Set<string>(SUPPORTED_CURRENCIES.map((c) => c.code));

export interface ComparisonBody {
  sendAmount: number;
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  priority: ComparisonPriority;
}

export function parseComparisonBody(body: unknown):
  | { ok: true; data: ComparisonBody }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Request body is required" };
  }

  const raw = body as Record<string, unknown>;
  const sendAmount = Number(raw.sendAmount);
  const sourceCurrency = String(raw.sourceCurrency ?? "").toUpperCase();
  const destCurrency = String(raw.destCurrency ?? "").toUpperCase();
  const priority = String(raw.priority ?? "balanced") as ComparisonPriority;

  if (!Number.isFinite(sendAmount) || sendAmount <= 0) {
    return { ok: false, message: "sendAmount must be a positive number" };
  }

  if (sendAmount > 1_000_000) {
    return { ok: false, message: "sendAmount must not exceed 1,000,000" };
  }

  if (!CURRENCY_CODES.has(sourceCurrency)) {
    return { ok: false, message: `Unsupported source currency: ${sourceCurrency}` };
  }

  if (!CURRENCY_CODES.has(destCurrency)) {
    return { ok: false, message: `Unsupported destination currency: ${destCurrency}` };
  }

  if (sourceCurrency === destCurrency) {
    return { ok: false, message: "Source and destination currencies must differ" };
  }

  if (!PRIORITIES.includes(priority)) {
    return { ok: false, message: "priority is invalid" };
  }

  return {
    ok: true,
    data: {
      sendAmount,
      sourceCurrency,
      destCurrency,
      sourceCountry: raw.sourceCountry ? String(raw.sourceCountry) : undefined,
      destCountry: raw.destCountry ? String(raw.destCountry) : undefined,
      priority,
    },
  };
}

export function getCorridors() {
  return MVP_CORRIDORS.map((c) => ({ ...c }));
}

export function getCurrencies() {
  return SUPPORTED_CURRENCIES.map((c) => ({ ...c }));
}
