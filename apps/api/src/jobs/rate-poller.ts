import cron from "node-cron";
import { recordFxSnapshot } from "../db/repositories/fx-snapshots.repository.js";
import { createFxProvider } from "../providers/fx/fx-provider.js";
import { coinGeckoProvider } from "../providers/crypto/coingecko.js";
import { createGasProvider } from "../providers/gas/etherscan.js";

const WARM_BASES = ["USD", "EUR", "GBP"];
const SNAPSHOT_QUOTES = ["INR", "MXN", "PHP"];
const fxProvider = createFxProvider();
const gasProvider = createGasProvider();

async function warmRates(): Promise<void> {
  const results = await Promise.allSettled(
    WARM_BASES.map((base) => fxProvider.getRates(base)),
  );

  for (const settled of results) {
    if (settled.status !== "fulfilled") continue;
    const fx = settled.value;
    for (const quote of SNAPSHOT_QUOTES) {
      const rate = fx.rates[quote];
      if (rate) {
        await recordFxSnapshot({
          baseCurrency: fx.base,
          quoteCurrency: quote,
          rate,
          source: fx.source,
        }).catch(() => undefined);
      }
    }
  }

  await Promise.allSettled([
    coinGeckoProvider.getUsdPrice("ethereum"),
    coinGeckoProvider.getUsdPrice("usd-coin"),
    gasProvider.getEthereumTransferFeeUsd(3000),
  ]);
}

export function startRatePoller(): void {
  const minutes = Number(process.env.RATE_POLL_INTERVAL_MINUTES) || 10;
  const cronExpr = `*/${Math.min(Math.max(minutes, 5), 15)} * * * *`;

  warmRates().catch(() => undefined);

  cron.schedule(cronExpr, () => {
    warmRates().catch(() => undefined);
  });
}
