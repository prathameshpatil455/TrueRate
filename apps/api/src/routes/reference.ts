import { Router } from "express";
import { getCorridors, getCurrencies } from "../lib/validation.js";

export const referenceRouter = Router();

referenceRouter.get("/currencies", (_req, res) => {
  res.json({ data: getCurrencies() });
});

referenceRouter.get("/corridors", (_req, res) => {
  res.json({ data: getCorridors() });
});
