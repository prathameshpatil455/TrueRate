import { randomUUID } from "node:crypto";
import {
  mutateCollection,
  readCollection,
} from "../json-store.js";
import type { StoredRefreshToken } from "../storage/types.js";

export async function storeRefreshToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  const token: StoredRefreshToken = {
    id: randomUUID(),
    userId,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  };
  mutateCollection<StoredRefreshToken>("refresh-tokens", (tokens) => [
    ...tokens,
    token,
  ]);
}

export async function findRefreshToken(
  tokenHash: string,
): Promise<{ userId: string; expiresAt: Date } | null> {
  const tokens = readCollection<StoredRefreshToken>("refresh-tokens");
  const now = Date.now();
  const match = tokens.find(
    (t) => t.tokenHash === tokenHash && new Date(t.expiresAt).getTime() > now,
  );
  if (!match) return null;
  return { userId: match.userId, expiresAt: new Date(match.expiresAt) };
}

export async function deleteRefreshToken(tokenHash: string): Promise<void> {
  mutateCollection<StoredRefreshToken>("refresh-tokens", (tokens) =>
    tokens.filter((t) => t.tokenHash !== tokenHash),
  );
}

export async function deleteUserRefreshTokens(userId: string): Promise<void> {
  mutateCollection<StoredRefreshToken>("refresh-tokens", (tokens) =>
    tokens.filter((t) => t.userId !== userId),
  );
}
