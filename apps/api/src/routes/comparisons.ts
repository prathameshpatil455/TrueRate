import { Router } from "express";
import { parseComparisonBody } from "../lib/validation.js";
import { runComparison } from "../services/comparison/comparison.service.js";
import { comparisonRateLimit } from "../middleware/rate-limit.js";
import { optionalAuth, requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import {
  comparisonOwnedByUser,
  getComparisonById,
  listComparisons,
  saveComparison,
  searchComparisons,
} from "../db/repositories/comparisons.repository.js";
import { COMPARISON_DISCLAIMER, EXPORT_FOOTER_DISCLAIMER } from "@truerate/shared";
import { generateComparisonPdf } from "../services/reporting/pdf.service.js";

export const comparisonsRouter = Router();

comparisonsRouter.post("/", comparisonRateLimit, optionalAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = parseComparisonBody(req.body);

  if (!parsed.ok) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: parsed.message },
    });
    return;
  }

  try {
    const result = await runComparison(parsed.data);

    if (req.userId) {
      await saveComparison(result, req.userId);
    }

    res.json({ data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Comparison failed";
    res.status(400).json({ error: { code: "COMPARISON_ERROR", message } });
  }
});

comparisonsRouter.get("/search", requireAuth, async (req: AuthenticatedRequest, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Query parameter q is required" },
    });
    return;
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const { items, total } = await searchComparisons(req.userId!, q, page, limit);

  res.json({ data: items, meta: { page, limit, total } });
});

comparisonsRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const { items, total } = await listComparisons(req.userId!, page, limit);

  res.json({
    data: items,
    meta: { page, limit, total },
  });
});

comparisonsRouter.get("/:id/export/pdf", requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  const result = await getComparisonById(id, req.userId!);

  if (!result) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Comparison not found" } });
    return;
  }

  result.disclaimer = COMPARISON_DISCLAIMER;
  const pdf = await generateComparisonPdf(result);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="truerate-${result.id.slice(0, 8)}.pdf"`,
  );
  res.send(Buffer.from(pdf));
});

comparisonsRouter.get("/:id/export/csv", requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  const owned = await comparisonOwnedByUser(id, req.userId!);
  if (!owned) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Comparison not found" } });
    return;
  }

  const result = await getComparisonById(id, req.userId!);
  if (!result) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Comparison not found" } });
    return;
  }

  const headers = [
    "Rank",
    "Provider",
    "Type",
    "Platform Fee",
    "FX Markup",
    "Network Fee",
    "Total Fee",
    "Effective Rate",
    "Amount Received",
    "Est. Time (hours)",
    "Recommended",
  ];

  const rows = result.routes.map((route) => [
    route.rank,
    route.providerName,
    route.providerType,
    route.platformFee,
    route.fxMarkup,
    route.networkFee,
    route.totalFee,
    route.effectiveRate,
    route.amountReceived,
    route.estimatedTimeHours,
    route.isRecommended ? "Yes" : "No",
  ]);

  const lines = [
    `Send Amount,${result.sendAmount}`,
    `Source,${result.sourceCurrency}`,
    `Destination,${result.destCurrency}`,
    `Mid-Market Rate,${result.midMarketRate}`,
    "",
    headers.join(","),
    ...rows.map((row) => row.join(",")),
    "",
    EXPORT_FOOTER_DISCLAIMER,
  ];

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="truerate-${result.id.slice(0, 8)}.csv"`,
  );
  res.send(lines.join("\n"));
});

comparisonsRouter.get("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = String(req.params.id);
  const result = await getComparisonById(id, req.userId!);

  if (!result) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Comparison not found" } });
    return;
  }

  result.disclaimer = COMPARISON_DISCLAIMER;
  res.json({ data: result });
});
