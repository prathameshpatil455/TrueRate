import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ComparisonResult } from "@truerate/shared";
import { COMPARISON_DISCLAIMER, EXPORT_FOOTER_DISCLAIMER } from "@truerate/shared";

export async function generateComparisonPdf(
  result: ComparisonResult,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const left = 50;
  const lineHeight = 16;

  const drawText = (text: string, bold = false, size = 11) => {
    page.drawText(text, {
      x: left,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= lineHeight;
  };

  drawText("TrueRate Comparison Report", true, 18);
  y -= 8;
  drawText(`Send: ${result.sendAmount} ${result.sourceCurrency}`);
  drawText(`Destination: ${result.destCurrency}`);
  drawText(`Mid-market rate: ${result.midMarketRate}`);
  drawText(`Priority: ${result.priority}`);
  drawText(`Rate as of: ${result.fxRateFetchedAt}`);
  y -= 8;
  drawText("Routes", true, 13);
  y -= 4;

  for (const route of result.routes) {
    const marker = route.isRecommended ? " [Recommended]" : "";
    drawText(
      `${route.rank}. ${route.providerName}${marker}`,
      route.isRecommended,
    );
    drawText(
      `   Fee: ${route.totalFee} ${result.sourceCurrency} | Received: ${route.amountReceived} ${result.destCurrency} | Time: ~${route.estimatedTimeHours}h`,
    );
    y -= 4;
  }

  y -= 8;
  page.drawText(COMPARISON_DISCLAIMER, {
    x: left,
    y,
    size: 8,
    font,
    color: rgb(0.4, 0.4, 0.4),
    maxWidth: 495,
    lineHeight: 10,
  });
  y -= 30;
  page.drawText(EXPORT_FOOTER_DISCLAIMER, {
    x: left,
    y,
    size: 8,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  return doc.save();
}
