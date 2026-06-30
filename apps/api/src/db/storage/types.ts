import type { ComparisonRoute, ComparisonResult } from "@truerate/shared";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  defaultSourceCurrency: string;
  defaultDestCurrency: string;
  notificationPreferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StoredRefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

export interface StoredComparison extends ComparisonResult {
  userId: string;
  createdAt: string;
}

export interface StoredSavedPair {
  id: string;
  userId: string;
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  label?: string;
  createdAt: string;
}

export interface StoredFxSnapshot {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  source: string;
  recordedAt: string;
}

export interface StoredNotificationLog {
  id: string;
  userId: string;
  notificationType: string;
  payload: Record<string, unknown>;
  sentAt: string;
}

export type { ComparisonRoute };
