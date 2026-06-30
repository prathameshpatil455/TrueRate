const USD_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  MXN: 17.2,
  PHP: 56.5,
  AUD: 1.52,
  CAD: 1.36,
  JPY: 150,
  SGD: 1.34,
  AED: 3.67,
  CHF: 0.88,
  CNY: 7.24,
  HKD: 7.82,
  NZD: 1.64,
  ZAR: 18.5,
  BRL: 5.05,
  PKR: 278,
  BDT: 110,
  NGN: 1500,
  KES: 129,
  GHS: 15.5,
  EGP: 48,
  THB: 35.5,
  VND: 24500,
  IDR: 15700,
  MYR: 4.47,
  KRW: 1320,
  TRY: 32,
  PLN: 3.95,
  SEK: 10.5,
  NOK: 10.7,
  DKK: 6.88,
};

export function getStaticRates(base: string): Record<string, number> {
  const normalizedBase = base.toUpperCase();
  const baseToUsd = USD_RATES[normalizedBase];

  if (!baseToUsd) {
    throw new Error(`Unsupported base currency for static rates: ${base}`);
  }

  const rates: Record<string, number> = {};
  for (const [currency, usdRate] of Object.entries(USD_RATES)) {
    rates[currency] = usdRate / baseToUsd;
  }
  return rates;
}
