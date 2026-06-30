import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import {
  getAnalyticsOverview,
  getCorridorUsage,
  getCountryAnalytics,
  getFeeComparison,
  getMonthlySavings,
  getProviderPerformance,
} from "../db/repositories/analytics.repository.js";
import { getRateHistory } from "../db/repositories/fx-snapshots.repository.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get("/overview", async (req: AuthenticatedRequest, res) => {
  const data = await getAnalyticsOverview(req.userId!);
  res.json({ data });
});

analyticsRouter.get("/savings", async (req: AuthenticatedRequest, res) => {
  const data = await getMonthlySavings(req.userId!);
  res.json({ data });
});

analyticsRouter.get("/providers", async (req: AuthenticatedRequest, res) => {
  const data = await getProviderPerformance(req.userId!);
  res.json({ data });
});

analyticsRouter.get("/corridors", async (req: AuthenticatedRequest, res) => {
  const data = await getCorridorUsage(req.userId!);
  res.json({ data });
});

analyticsRouter.get("/countries", async (req: AuthenticatedRequest, res) => {
  const data = await getCountryAnalytics(req.userId!);
  res.json({ data });
});

analyticsRouter.get("/fees", async (req: AuthenticatedRequest, res) => {
  const data = await getFeeComparison(req.userId!);
  res.json({ data });
});

analyticsRouter.get("/rates/:base/:quote", async (req: AuthenticatedRequest, res) => {
  const days = Math.min(90, Number(req.query.days) || 30);
  const data = await getRateHistory(
    String(req.params.base).toUpperCase(),
    String(req.params.quote).toUpperCase(),
    days,
  );
  res.json({ data });
});
