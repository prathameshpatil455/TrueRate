import type { NotificationPreferences } from "@truerate/shared";
import { readCollection } from "../../db/json-store.js";
import type { StoredComparison } from "../../db/storage/types.js";
import {
  findUsersWithNotificationFlag,
} from "../../db/repositories/users.repository.js";
import { createFxProvider } from "../../providers/fx/fx-provider.js";
import { sendEmail, logNotification } from "./email.service.js";

const fxProvider = createFxProvider();

export async function checkRateAlerts(): Promise<void> {
  const users = await findUsersWithNotificationFlag("rateAlertsEnabled");

  for (const user of users) {
    const prefs = user.notificationPreferences as NotificationPreferences;
    const source = prefs.alertSourceCurrency ?? "USD";
    const dest = prefs.alertDestCurrency ?? "INR";
    const threshold = prefs.rateAlertThreshold;

    if (threshold === undefined) continue;

    try {
      const fx = await fxProvider.getRates(source);
      const currentRate = fx.rates[dest];
      if (!currentRate) continue;

      if (currentRate >= threshold) {
        await sendEmail({
          to: user.email,
          subject: `TrueRate: ${source}/${dest} rate alert`,
          text: `The ${source} to ${dest} rate is now ${currentRate.toFixed(4)}, at or above your threshold of ${threshold}.`,
        });
        await logNotification(user.id, "RATE_ALERT", {
          source,
          dest,
          currentRate,
          threshold,
        });
      }
    } catch (error) {
      console.error(`Rate alert check failed for user ${user.id}:`, error);
    }
  }
}

export async function checkBetterRouteAlerts(): Promise<void> {
  const users = await findUsersWithNotificationFlag("betterRouteAlertsEnabled");
  const comparisons = readCollection<StoredComparison>("comparisons");

  for (const user of users) {
    const history = comparisons
      .filter((c) => c.userId === user.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 2);

    if (history.length < 2) continue;
    const [latest, previous] = history;
    if (latest.recommendedRouteId === previous.recommendedRouteId) continue;

    await sendEmail({
      to: user.email,
      subject: "TrueRate: Better route available",
      text: `Your latest comparison recommends ${latest.recommendedRouteId}, which differs from your previous best route (${previous.recommendedRouteId}).`,
    });
    await logNotification(user.id, "BETTER_ROUTE", {
      recommendedRouteId: latest.recommendedRouteId,
      previousRouteId: previous.recommendedRouteId,
    });
  }
}

export async function runNotificationChecks(): Promise<void> {
  await checkRateAlerts();
  await checkBetterRouteAlerts();
}
