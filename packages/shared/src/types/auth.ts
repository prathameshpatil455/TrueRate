export interface UserProfile {
  id: string;
  email: string;
  name: string;
  defaultSourceCurrency: string;
  defaultDestCurrency: string;
  notificationPreferences: Record<string, unknown>;
}

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
}

export interface ComparisonSummary {
  id: string;
  sendAmount: number;
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  priority: string;
  recommendedRouteId: string;
  midMarketRate: number;
  createdAt: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface SavedCurrencyPair {
  id: string;
  sourceCurrency: string;
  destCurrency: string;
  sourceCountry?: string;
  destCountry?: string;
  label?: string;
  createdAt: string;
}
