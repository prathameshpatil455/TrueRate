import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserProfile } from "@truerate/shared";
import {
  getStoredAccessToken,
  setStoredAccessToken,
} from "@/services/apiClient";
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
  register as registerRequest,
} from "@/services/authService";

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = getStoredAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
    } catch {
      try {
        const refreshed = await refreshAccessToken();
        setStoredAccessToken(refreshed.accessToken);
        setUser(refreshed.user);
      } catch {
        setStoredAccessToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginRequest({ email, password });
    setStoredAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const session = await registerRequest({ name, email, password });
    setStoredAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setStoredAccessToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
