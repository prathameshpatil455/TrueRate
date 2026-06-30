export interface FxRateResult {
  base: string;
  rates: Record<string, number>;
  fetchedAt: string;
  source: string;
}

export interface CryptoPriceResult {
  id: string;
  usd: number;
  fetchedAt: string;
}

export interface GasFeeResult {
  gasPriceGwei: number;
  estimatedTransferFeeUsd: number;
  fetchedAt: string;
  source: string;
}

export interface FxProvider {
  getRates(base: string): Promise<FxRateResult>;
}

export interface CryptoProvider {
  getUsdPrice(coinId: string): Promise<CryptoPriceResult>;
}

export interface GasFeeProvider {
  getEthereumTransferFeeUsd(ethUsdPrice: number): Promise<GasFeeResult>;
}
