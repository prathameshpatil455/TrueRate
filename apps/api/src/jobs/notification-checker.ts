import cron from "node-cron";
import { runNotificationChecks } from "../services/notifications/notification.service.js";

export function startNotificationChecker(): void {
  cron.schedule("0 * * * *", () => {
    runNotificationChecks().catch((error) => {
      console.error("Notification check failed:", error);
    });
  });
}
