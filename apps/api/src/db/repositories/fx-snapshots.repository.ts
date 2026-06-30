import { randomUUID } from "node:crypto";
import {
  mutateCollection,
  readCollection,
} from "../json-store.js";
import type { StoredFxSnapshot } from "../storage/types.js";

export async function recordFxSnapshot(input: {
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  source: string;
}): Promise<void> {
  const snapshot: StoredFxSnapshot = {
    id: randomUUID(),
    baseCurrency: input.baseCurrency,
    quoteCurrency: input.quoteCurrency,
    rate: input.rate,
    source: input.source,
    recordedAt: new Date().toISOString(),
  };
  mutateCollection<StoredFxSnapshot>("fx-rate-snapshots", (items) => [
    ...items,
    snapshot,
  ]);
}

export async function getRateHistory(
  baseCurrency: string,
  quoteCurrency: string,
  days = 30,
): Promise<{ rate: number; recordedAt: string }[]> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return readCollection<StoredFxSnapshot>("fx-rate-snapshots")
    .filter(
      (s) =>
        s.baseCurrency === baseCurrency &&
        s.quoteCurrency === quoteCurrency &&
        new Date(s.recordedAt).getTime() >= cutoff,
    )
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))
    .map((s) => ({ rate: s.rate, recordedAt: s.recordedAt }));
}
