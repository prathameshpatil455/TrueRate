import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import type { NotificationPreferences } from "@truerate/shared";
import { Button } from "@/components/atoms/Button";
import { InputField } from "@/components/atoms/InputField";
import { useAuth } from "@/context/AuthContext";
import { updateNotificationPreferences } from "@/services/authService";
import { cn } from "@/utils/cn";

export function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const prefs = (user?.notificationPreferences ?? {}) as NotificationPreferences;

  const [rateAlertsEnabled, setRateAlertsEnabled] = useState(Boolean(prefs.rateAlertsEnabled));
  const [threshold, setThreshold] = useState(String(prefs.rateAlertThreshold ?? ""));
  const [betterRouteAlerts, setBetterRouteAlerts] = useState(
    Boolean(prefs.betterRouteAlertsEnabled),
  );
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate({
      rateAlertsEnabled,
      rateAlertThreshold: threshold ? Number(threshold) : undefined,
      alertSourceCurrency: "USD",
      alertDestCurrency: "INR",
      betterRouteAlertsEnabled: betterRouteAlerts,
      feeDropAlertsEnabled: false,
    });
  };

  return (
    <div className={cn("mx-auto max-w-lg space-y-6")}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notification settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Alerts are checked hourly. Without SMTP config, emails log to the API console.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={rateAlertsEnabled}
            onChange={(e) => setRateAlertsEnabled(e.target.checked)}
          />
          Exchange rate alerts (USD → INR)
        </label>

        {rateAlertsEnabled && (
          <InputField
            label="Alert when rate reaches or exceeds"
            type="number"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="e.g. 85.00"
          />
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={betterRouteAlerts}
            onChange={(e) => setBetterRouteAlerts(e.target.checked)}
          />
          Notify when a better route is recommended
        </label>

        {saved && <p className="text-sm text-emerald-700">Settings saved.</p>}
        {mutation.isError && (
          <p className="text-sm text-red-600">Failed to save settings.</p>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save preferences"}
        </Button>
      </form>
    </div>
  );
}
