// utils/currencyTools.ts
/**
 * Currency Tools - Utility functions for currency conversion
 * Supports multiple free APIs with fallback options
 */

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
  timestamp: string;
  source?: string;
  success?: boolean;
}

interface CacheEntry {
  data: ExchangeRatesResponse;
  timestamp: number;
}

interface APIConfig {
  name: string;
  url: (base: string) => string;
  parseResponse: (
    data: Record<string, unknown>,
    base?: string
  ) => ExchangeRatesResponse;
}

interface ConversionResult {
  result: number;
  rate: number;
}

interface CacheStatus {
  key: string;
  age: number;
  isExpired: boolean;
  source: string;
}

class CurrencyTools {
  private cache = new Map<string, CacheEntry>();
  private readonly cacheTimeout = 10 * 60 * 1000; // 10 minutes cache

  private apis: APIConfig[] = [
    {
      name: "ExchangeRate-API",
      url: (base: string) =>
        `https://api.exchangerate-api.com/v4/latest/${base}`,
      parseResponse: (
        data: Record<string, unknown>,
        base?: string
      ): ExchangeRatesResponse => ({
        rates: data.rates as Record<string, number>,
        base: base || (data.base as string),
        timestamp: data.date as string,
      }),
    },
    {
      name: "Fixer.io",
      url: (base: string) => `https://api.fixer.io/latest?base=${base}`,
      parseResponse: (
        data: Record<string, unknown>,
        base?: string
      ): ExchangeRatesResponse => ({
        rates: data.rates as Record<string, number>,
        base: base || (data.base as string),
        timestamp: data.date as string,
      }),
    },
    {
      name: "CurrencyAPI",
      url: (base: string) =>
        `https://api.currencyapi.com/v3/latest?base_currency=${base}`,
      parseResponse: (
        data: Record<string, unknown>,
        base?: string
      ): ExchangeRatesResponse => {
        const rates: Record<string, number> = {};
        const dataObj = data.data as Record<string, { value: number }>;
        Object.keys(dataObj).forEach((key) => {
          rates[key] = dataObj[key].value;
        });
        return {
          rates,
          base: base || (data.base_currency as string) || "USD", // Use parameter, fallback to data, then 'USD'
          timestamp: new Date().toISOString(),
        };
      },
    },
  ];

  /**
   * Get cached exchange rates or fetch new ones
   */
  async getExchangeRates(base: string = "USD"): Promise<ExchangeRatesResponse> {
    const cacheKey = `rates_${base}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    // Fetch fresh data
    try {
      const data = await this.fetchExchangeRates(base);

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      // Return cached data even if expired, if available
      if (cached) {
        console.warn("Using expired cache due to API failure");
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Fetch exchange rates from multiple APIs with fallback
   */
  private async fetchExchangeRates(
    base: string = "USD"
  ): Promise<ExchangeRatesResponse> {
    let lastError: Error | null = null;

    for (const api of this.apis) {
      try {
        console.log(`Trying ${api.name} API...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(api.url(base), {
          signal: controller.signal,
          headers: {
            "User-Agent": "Currency-Converter-App/1.0",
            Accept: "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const rawData = (await response.json()) as Record<string, unknown>;
        const parsedData = api.parseResponse(rawData);

        console.log(`Successfully fetched rates from ${api.name}`);
        return {
          ...parsedData,
          source: api.name,
          success: true,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.warn(`${api.name} API failed:`, errorMessage);
        lastError = error instanceof Error ? error : new Error(errorMessage);
        continue;
      }
    }

    // If all APIs failed, throw the last error
    throw new Error(
      `All currency APIs failed. Last error: ${
        lastError?.message || "Unknown error"
      }`
    );
  }

  /**
   * Convert currency amount from one currency to another
   */
  convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
  ): number {
    if (!rates || typeof amount !== "number" || amount < 0) {
      throw new Error("Invalid input parameters");
    }

    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Get exchange rates (assuming USD as base in rates object)
    const fromRate = fromCurrency === "USD" ? 1 : rates[fromCurrency];
    const toRate = toCurrency === "USD" ? 1 : rates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency} or ${toCurrency}`
      );
    }

    // Convert: amount * (toRate / fromRate)
    const convertedAmount = (amount / fromRate) * toRate;
    return convertedAmount;
  }

  /**
   * Get conversion rate between two currencies
   */
  getConversionRate(
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
  ): number {
    if (!rates) {
      throw new Error("Exchange rates not available");
    }

    if (fromCurrency === toCurrency) {
      return 1;
    }

    const fromRate = fromCurrency === "USD" ? 1 : rates[fromCurrency];
    const toRate = toCurrency === "USD" ? 1 : rates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency} or ${toCurrency}`
      );
    }

    return toRate / fromRate;
  }

  /**
   * Format currency amount with proper locale and currency symbol
   */
  formatCurrency(
    amount: number,
    currency: string,
    locale: string = "en-US",
    options: Intl.NumberFormatOptions = {}
  ): string {
    const defaultOptions: Intl.NumberFormatOptions = {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: currency === "IDR" ? 0 : 4, // IDR typically doesn't use decimals
    };

    const formatOptions = { ...defaultOptions, ...options };

    try {
      return new Intl.NumberFormat(locale, formatOptions).format(amount);
    } catch (error) {
      // Fallback to basic formatting if Intl fails
      console.log(error);
      return `${amount.toFixed(
        formatOptions.maximumFractionDigits || 4
      )} ${currency}`;
    }
  }

  /**
   * Get list of supported currencies
   */
  getSupportedCurrencies(): CurrencyInfo[] {
    return [
      { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
      { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
      { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
      { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
      { code: "GBP", name: "British Pound Sterling", symbol: "£", flag: "🇬🇧" },
      { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
      { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
      { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
      { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
      { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
      { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
      { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
      { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
      { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
      { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
      { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
      { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
      { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
      { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
      { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
    ];
  }

  /**
   * Validate currency code
   */
  isValidCurrency(currencyCode: string): boolean {
    const supportedCurrencies = this.getSupportedCurrencies();
    return supportedCurrencies.some(
      (currency) => currency.code === currencyCode
    );
  }

  /**
   * Get currency info by code
   */
  getCurrencyInfo(currencyCode: string): CurrencyInfo | undefined {
    const supportedCurrencies = this.getSupportedCurrencies();
    return supportedCurrencies.find(
      (currency) => currency.code === currencyCode
    );
  }

  /**
   * Clear cache (useful for testing or forcing fresh data)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache status
   */
  getCacheStatus(): CacheStatus[] {
    const status: CacheStatus[] = [];
    for (const [key, value] of this.cache.entries()) {
      const age = Date.now() - value.timestamp;
      const isExpired = age > this.cacheTimeout;
      status.push({
        key,
        age: Math.round(age / 1000), // in seconds
        isExpired,
        source: value.data.source || "Unknown",
      });
    }
    return status;
  }
}

// Export singleton instance
const currencyTools = new CurrencyTools();

// For CommonJS environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = currencyTools;
}

// For ES6 modules
export default currencyTools;

// Named exports for specific functions
export const {
  getExchangeRates,
  convertCurrency,
  getConversionRate,
  formatCurrency,
  getSupportedCurrencies,
  isValidCurrency,
  getCurrencyInfo,
  clearCache,
  getCacheStatus,
} = currencyTools;

// Export types for external use
export type {
  CurrencyInfo,
  ExchangeRatesResponse,
  ConversionResult,
  CacheStatus,
};
