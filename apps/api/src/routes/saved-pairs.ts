import { Router } from "express";
import {
  createSavedPair,
  deleteSavedPair,
  listSavedPairs,
} from "../db/repositories/saved-pairs.repository.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

export const savedPairsRouter = Router();

savedPairsRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const pairs = await listSavedPairs(req.userId!);
  res.json({ data: pairs });
});

savedPairsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const body = req.body as Record<string, unknown>;

  if (!body.sourceCurrency || !body.destCurrency) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "sourceCurrency and destCurrency are required",
      },
    });
    return;
  }

  try {
    const pair = await createSavedPair(req.userId!, {
      sourceCurrency: String(body.sourceCurrency).toUpperCase(),
      destCurrency: String(body.destCurrency).toUpperCase(),
      sourceCountry: body.sourceCountry ? String(body.sourceCountry) : undefined,
      destCountry: body.destCountry ? String(body.destCountry) : undefined,
      label: body.label ? String(body.label) : undefined,
    });
    res.status(201).json({ data: pair });
  } catch {
    res.status(400).json({
      error: { code: "DUPLICATE_PAIR", message: "This currency pair is already saved" },
    });
  }
});

savedPairsRouter.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const deleted = await deleteSavedPair(String(req.params.id), req.userId!);
  if (!deleted) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Saved pair not found" } });
    return;
  }
  res.json({ data: { success: true } });
});
