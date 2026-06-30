import type { ApiErrorResponse, ApiResponse } from "@truerate/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const ACCESS_TOKEN_KEY = "TRUERATE_ACCESS_TOKEN";

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function getStoredAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredAccessToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const { data } = await apiRequestWithMeta<T>(path, options);
  return data;
}

export async function apiRequestWithMeta<T>(
  path: string,
  options?: RequestInit,
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const token = getStoredAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const json = (await response.json()) as
    | (ApiResponse<T> & { meta?: Record<string, unknown> })
    | ApiErrorResponse;

  if (!response.ok || "error" in json) {
    const error = "error" in json ? json.error : { code: "UNKNOWN", message: "Request failed" };
    throw new ApiClientError(error.code, error.message);
  }

  return { data: json.data, meta: json.meta };
}

export async function downloadAuthenticatedFile(
  path: string,
  filename: string,
): Promise<void> {
  const token = getStoredAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new ApiClientError("DOWNLOAD_FAILED", "Failed to download file");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
