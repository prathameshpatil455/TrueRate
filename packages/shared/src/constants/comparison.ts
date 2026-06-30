export const PROVIDER_URLS: Record<string, string> = {
  swift: "https://www.swift.com/",
  wise: "https://wise.com/",
  remitly: "https://www.remitly.com/",
  "western-union": "https://www.westernunion.com/us/en/home.html",
  xoom: "https://www.xoom.com/",
  "usdc-ethereum": "https://www.circle.com/en/usdc",
  "usdc-polygon": "https://www.circle.com/en/usdc",
  "eth-ethereum": "https://ethereum.org/",
};

export const AMOUNT_PRESETS_BY_CURRENCY: Record<string, readonly number[]> = {
  USD: [500, 1000, 5000],
  EUR: [500, 1000, 5000],
  GBP: [400, 800, 4000],
  INR: [50000, 100000, 500000],
  MXN: [10000, 20000, 100000],
  PHP: [30000, 60000, 300000],
};

export function getAmountPresets(currency: string): readonly number[] {
  return AMOUNT_PRESETS_BY_CURRENCY[currency] ?? AMOUNT_PRESETS_BY_CURRENCY.USD;
}

export const AMOUNT_PRESETS = AMOUNT_PRESETS_BY_CURRENCY.USD;
