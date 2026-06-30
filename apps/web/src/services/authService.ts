import type {
  AuthSession,
  ComparisonSummary,
  PaginatedMeta,
  SavedCurrencyPair,
  UserProfile,
} from "@truerate/shared";
import { apiRequest, apiRequestWithMeta } from "./apiClient";

export function register(input: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthSession> {
  return apiRequest<AuthSession>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  return apiRequest<AuthSession>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function refreshAccessToken(): Promise<{
  accessToken: string;
  user: UserProfile;
}> {
  return apiRequest<{ accessToken: string; user: UserProfile }>("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function logout(): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>("/api/v1/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function fetchCurrentUser(): Promise<UserProfile> {
  return apiRequest<UserProfile>("/api/v1/users/me");
}

export async function fetchComparisonHistory(
  page = 1,
  limit = 20,
): Promise<{ items: ComparisonSummary[]; meta: PaginatedMeta }> {
  const { data, meta } = await apiRequestWithMeta<ComparisonSummary[]>(
    `/api/v1/comparisons?page=${page}&limit=${limit}`,
  );
  return {
    items: data,
    meta: meta as unknown as PaginatedMeta,
  };
}

export function fetchSavedPairs(): Promise<SavedCurrencyPair[]> {
  return apiRequest<SavedCurrencyPair[]>("/api/v1/saved-pairs");
}

export function createSavedPair(input: {
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  label?: string;
}): Promise<SavedCurrencyPair> {
  return apiRequest<SavedCurrencyPair>("/api/v1/saved-pairs", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateNotificationPreferences(
  preferences: Record<string, unknown>,
): Promise<UserProfile> {
  return apiRequest<UserProfile>("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify({ notificationPreferences: preferences }),
  });
}

export function deleteSavedPair(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/v1/saved-pairs/${id}`, {
    method: "DELETE",
  });
}
