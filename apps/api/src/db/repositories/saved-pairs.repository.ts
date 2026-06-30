import { randomUUID } from "node:crypto";
import type { SavedCurrencyPair } from "@truerate/shared";
import {
  mutateCollection,
  readCollection,
} from "../json-store.js";
import type { StoredSavedPair } from "../storage/types.js";

export async function listSavedPairs(userId: string): Promise<SavedCurrencyPair[]> {
  return readCollection<StoredSavedPair>("saved-pairs")
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((row) => ({
      id: row.id,
      sourceCurrency: row.sourceCurrency,
      destCurrency: row.destCurrency,
      sourceCountry: row.sourceCountry,
      destCountry: row.destCountry,
      label: row.label,
      createdAt: row.createdAt,
    }));
}

export async function createSavedPair(
  userId: string,
  input: {
    sourceCurrency: string;
    destCurrency: string;
    sourceCountry?: string;
    destCountry?: string;
    label?: string;
  },
): Promise<SavedCurrencyPair> {
  const pairs = readCollection<StoredSavedPair>("saved-pairs");
  const duplicate = pairs.some(
    (p) =>
      p.userId === userId &&
      p.sourceCurrency === input.sourceCurrency &&
      p.destCurrency === input.destCurrency &&
      p.sourceCountry === input.sourceCountry &&
      p.destCountry === input.destCountry,
  );
  if (duplicate) {
    throw new Error("DUPLICATE_PAIR");
  }

  const pair: StoredSavedPair = {
    id: randomUUID(),
    userId,
    sourceCurrency: input.sourceCurrency,
    destCurrency: input.destCurrency,
    sourceCountry: input.sourceCountry,
    destCountry: input.destCountry,
    label: input.label,
    createdAt: new Date().toISOString(),
  };

  mutateCollection<StoredSavedPair>("saved-pairs", (items) => [...items, pair]);

  return {
    id: pair.id,
    sourceCurrency: pair.sourceCurrency,
    destCurrency: pair.destCurrency,
    sourceCountry: pair.sourceCountry,
    destCountry: pair.destCountry,
    label: pair.label,
    createdAt: pair.createdAt,
  };
}

export async function deleteSavedPair(id: string, userId: string): Promise<boolean> {
  const before = readCollection<StoredSavedPair>("saved-pairs").length;
  mutateCollection<StoredSavedPair>("saved-pairs", (pairs) =>
    pairs.filter((p) => !(p.id === id && p.userId === userId)),
  );
  const after = readCollection<StoredSavedPair>("saved-pairs").length;
  return after < before;
}
