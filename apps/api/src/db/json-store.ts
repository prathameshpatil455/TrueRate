import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_DIR = join(__dirname, "../../data");

export function getDataDir(): string {
  const configured = process.env.DATA_DIR?.trim();
  return configured || DEFAULT_DATA_DIR;
}

export function ensureDataDir(): void {
  const dir = getDataDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function readCollection<T>(collection: string): T[] {
  ensureDataDir();
  const filePath = join(getDataDir(), `${collection}.json`);
  if (!existsSync(filePath)) {
    return [];
  }
  const raw = readFileSync(filePath, "utf-8");
  if (!raw.trim()) return [];
  return JSON.parse(raw) as T[];
}

export function writeCollection<T>(collection: string, items: T[]): void {
  ensureDataDir();
  const filePath = join(getDataDir(), `${collection}.json`);
  writeFileSync(filePath, `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}

export function mutateCollection<T>(
  collection: string,
  mutator: (items: T[]) => T[],
): T[] {
  const items = readCollection<T>(collection);
  const next = mutator(items);
  writeCollection(collection, next);
  return next;
}

export const COLLECTIONS = [
  "users",
  "refresh-tokens",
  "comparisons",
  "saved-pairs",
  "fx-rate-snapshots",
  "notification-logs",
] as const;

export function initJsonStore(): void {
  ensureDataDir();
  for (const collection of COLLECTIONS) {
    const filePath = join(getDataDir(), `${collection}.json`);
    if (!existsSync(filePath)) {
      writeFileSync(filePath, "[]\n", "utf-8");
    }
  }
}

export function isStorageReady(): boolean {
  try {
    ensureDataDir();
    return true;
  } catch {
    return false;
  }
}
