import "dotenv/config";
import { initJsonStore } from "./db/json-store.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { COMPARISON_DISCLAIMER } from "@truerate/shared";
import { startNotificationChecker } from "./jobs/notification-checker.js";
import { startRatePoller } from "./jobs/rate-poller.js";
import { generalRateLimit } from "./middleware/rate-limit.js";
import { analyticsRouter } from "./routes/analytics.js";
import { authRouter } from "./routes/auth.js";
import { comparisonsRouter } from "./routes/comparisons.js";
import { healthRouter } from "./routes/health.js";
import { referenceRouter } from "./routes/reference.js";
import { savedPairsRouter } from "./routes/saved-pairs.js";
import { usersRouter } from "./routes/users.js";

initJsonStore();

const app = express();
const port = Number(process.env.PORT) || 3001;

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(generalRateLimit);

app.get("/api/v1", (_req, res) => {
  res.json({
    data: {
      name: "TrueRate API",
      version: "1.0.0",
      disclaimer: COMPARISON_DISCLAIMER,
    },
  });
});

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comparisons", comparisonsRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/saved-pairs", savedPairsRouter);
app.use("/api/v1", referenceRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  },
);

startRatePoller();
startNotificationChecker();

app.listen(port, () => {
  console.log(`TrueRate API listening on http://localhost:${port}`);
});
