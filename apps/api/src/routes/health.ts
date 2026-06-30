import { Router } from "express";
import { getDataDir, isStorageReady } from "../db/json-store.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const storage = isStorageReady() ? "ok" : "unavailable";

  res.status(200).json({
    data: {
      status: storage === "ok" ? "ok" : "degraded",
      version: "1.0.0",
      services: {
        storage,
        dataDir: getDataDir(),
        redis: "skipped",
      },
    },
  });
});
