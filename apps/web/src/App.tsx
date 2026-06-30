import { Link, Route, Routes } from "react-router-dom";
import { COMPARISON_FORM_DISCLAIMER } from "@truerate/shared";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/context/AuthContext";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { ComparePage } from "@/pages/ComparePage";
import { ComparisonDetailPage } from "@/pages/ComparisonDetailPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { cn } from "@/utils/cn";

function AppHeader() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          TrueRate
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {isAuthenticated && (
            <>
              <Link to="/history" className="text-slate-600 hover:text-slate-900">
                History
              </Link>
              <Link to="/analytics" className="text-slate-600 hover:text-slate-900">
                Analytics
              </Link>
              <Link to="/settings" className="text-slate-600 hover:text-slate-900">
                Settings
              </Link>
            </>
          )}
          {!isLoading && isAuthenticated && user && (
            <>
              <span className="hidden text-slate-500 sm:inline">{user.name}</span>
              <Button variant="secondary" onClick={() => logout()}>
                Sign out
              </Button>
            </>
          )}
          {!isLoading && !isAuthenticated && (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900">
                Sign in
              </Link>
              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className={cn("flex min-h-screen flex-col bg-slate-50 text-slate-900")}>
      <AppHeader />

      <main className={cn("mx-auto w-full max-w-5xl flex-1 px-4 py-8")}>
        <Routes>
          <Route path="/" element={<ComparePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<ComparisonDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <p className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-slate-500">
          {COMPARISON_FORM_DISCLAIMER}
        </p>
      </footer>
    </div>
  );
}

export default App;
