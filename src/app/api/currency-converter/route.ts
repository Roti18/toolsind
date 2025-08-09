// api/currency-converter/route.ts
import { NextRequest, NextResponse } from "next/server";

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
  parseResponse: (data: unknown) => ExchangeRatesResponse;
}

interface ConversionRequest {
  amount: number;
  from: string;
  to: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

class CurrencyAPI {
  private cache = new Map<string, CacheEntry>();
  private readonly cacheTimeout = 10 * 60 * 1000; // 10 menit

  private apis: APIConfig[] = [
    {
      name: "ExchangeRate-API",
      url: (base: string) =>
        `https://api.exchangerate-api.com/v4/latest/${base}`,
      parseResponse: (data: unknown): ExchangeRatesResponse => {
        if (isExchangeRateAPIResponse(data)) {
          return {
            rates: data.rates,
            base: data.base,
            timestamp: data.date,
            success: true,
          };
        }
        throw new Error("Invalid response format from ExchangeRate-API");
      },
    },
    {
      name: "Fixer.io",
      url: (base: string) =>
        `https://data.fixer.io/api/latest?access_key=YOUR_FIXER_API_KEY&base=${base}`,
      parseResponse: (data: unknown): ExchangeRatesResponse => {
        if (isFixerIOResponse(data)) {
          return {
            rates: data.rates,
            base: data.base,
            timestamp: data.date,
            success: data.success,
          };
        }
        throw new Error("Invalid response format from Fixer.io");
      },
    },
  ];

  async getExchangeRates(base: string = "USD"): Promise<ExchangeRatesResponse> {
    const cacheKey = `rates_${base}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`Cache hit for base ${base}`);
      return cached.data;
    }

    try {
      const data = await this.fetchExchangeRates(base);
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      console.log(`Cache updated for base ${base}`);
      return data;
    } catch (error) {
      console.warn("Failed to fetch exchange rates:", error);
      if (cached) {
        console.warn("Using expired cache due to fetch failure");
        return cached.data;
      }
      throw error;
    }
  }

  private async fetchExchangeRates(
    base: string = "USD"
  ): Promise<ExchangeRatesResponse> {
    let lastError: Error | null = null;

    for (const api of this.apis) {
      try {
        console.log(`Fetching from ${api.name} with base ${base}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(api.url(base), {
          signal: controller.signal,
          headers: {
            "User-Agent": "Currency-Converter-App/1.0",
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const rawData = await response.json();
        const parsedData = api.parseResponse(rawData);

        if (parsedData.success === false) {
          throw new Error(`${api.name} API returned unsuccessful response`);
        }

        console.log(`Successfully fetched rates from ${api.name}`);
        return {
          ...parsedData,
          source: api.name,
        };
      } catch (error) {
        console.warn(`${api.name} API error:`, error);
        lastError = error instanceof Error ? error : new Error("Unknown error");
      }
    }
    throw new Error(
      `All currency APIs failed. Last error: ${
        lastError?.message ?? "Unknown error"
      }`
    );
  }

  convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
  ): { result: number; rate: number } {
    if (!rates || typeof amount !== "number" || amount < 0) {
      throw new Error("Invalid input parameters");
    }

    if (fromCurrency === toCurrency) {
      return {
        result: amount,
        rate: 1,
      };
    }

    const fromRate = fromCurrency === "USD" ? 1 : rates[fromCurrency];
    const toRate = toCurrency === "USD" ? 1 : rates[toCurrency];

    if (fromRate === undefined) {
      throw new Error(
        `Exchange rate not available for currency: ${fromCurrency}`
      );
    }
    if (toRate === undefined) {
      throw new Error(
        `Exchange rate not available for currency: ${toCurrency}`
      );
    }

    const rate = toRate / fromRate;
    const result = amount * rate;

    return {
      result: Math.round(result * 1e8) / 1e8,
      rate: Math.round(rate * 1e8) / 1e8,
    };
  }
}

// Helper untuk safe cek property pada object tanpa pakai 'any'
function hasProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// Type guard untuk ExchangeRate-API response
function isExchangeRateAPIResponse(data: unknown): data is {
  rates: Record<string, number>;
  base: string;
  date: string;
} {
  return (
    typeof data === "object" &&
    data !== null &&
    hasProperty(data, "rates") &&
    typeof (data as { rates: unknown }).rates === "object" &&
    hasProperty(data, "base") &&
    typeof (data as { base: unknown }).base === "string" &&
    hasProperty(data, "date") &&
    typeof (data as { date: unknown }).date === "string"
  );
}

// Type guard untuk Fixer.io response
function isFixerIOResponse(data: unknown): data is {
  rates: Record<string, number>;
  base: string;
  date: string;
  success: boolean;
} {
  return (
    typeof data === "object" &&
    data !== null &&
    hasProperty(data, "rates") &&
    typeof (data as { rates: unknown }).rates === "object" &&
    hasProperty(data, "base") &&
    typeof (data as { base: unknown }).base === "string" &&
    hasProperty(data, "date") &&
    typeof (data as { date: unknown }).date === "string" &&
    hasProperty(data, "success") &&
    typeof (data as { success: unknown }).success === "boolean"
  );
}

const currencyAPI = new CurrencyAPI();

const SUPPORTED_CURRENCIES = [
  "USD",
  "IDR",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "CAD",
  "SGD",
  "CNY",
  "MYR",
  "THB",
  "KRW",
  "CHF",
  "NOK",
  "SEK",
  "DKK",
  "PLN",
  "CZK",
  "HUF",
  "TRY",
  "INR",
  "BRL",
  "ZAR",
  "RUB",
  "MXN",
];

function validateRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { isValid: false, error: "Request body must be a non-null object" };
  }

  const obj = body as Record<string, unknown>;
  const amount = obj.amount;
  const from = obj.from;
  const to = obj.to;

  if (amount === undefined || from === undefined || to === undefined) {
    return {
      isValid: false,
      error: "Missing required fields: amount, from, to",
    };
  }

  if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
    return { isValid: false, error: "Amount must be a valid positive number" };
  }

  if (amount > 1_000_000_000) {
    return { isValid: false, error: "Amount too large (max: 1,000,000,000)" };
  }

  if (
    typeof from !== "string" ||
    !SUPPORTED_CURRENCIES.includes(from.toUpperCase())
  ) {
    return { isValid: false, error: `Unsupported currency: ${from}` };
  }

  if (
    typeof to !== "string" ||
    !SUPPORTED_CURRENCIES.includes(to.toUpperCase())
  ) {
    return { isValid: false, error: `Unsupported currency: ${to}` };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const validation = validateRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { amount, from, to } = body as ConversionRequest;
    const fromCurrency = from.toUpperCase();
    const toCurrency = to.toUpperCase();

    console.log(
      `Request to convert ${amount} from ${fromCurrency} to ${toCurrency}`
    );

    const ratesData = await currencyAPI.getExchangeRates("USD");
    if (!ratesData || !ratesData.rates) {
      throw new Error("Failed to fetch exchange rates");
    }

    const conversion = currencyAPI.convertCurrency(
      amount,
      fromCurrency,
      toCurrency,
      ratesData.rates
    );

    return NextResponse.json({
      success: true,
      result: conversion.result,
      rate: conversion.rate,
      from: fromCurrency,
      to: toCurrency,
      amount,
      timestamp: new Date().toISOString(),
      source: ratesData.source ?? "Unknown",
      cache_age: ratesData.timestamp
        ? Math.round(
            (Date.now() - new Date(ratesData.timestamp).getTime()) / 1000
          )
        : null,
    });
  } catch (error) {
    console.error("Currency conversion error:", error);

    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      if (error.message.includes("fetch") || error.message.includes("API")) {
        statusCode = 503;
        errorCode = "SERVICE_UNAVAILABLE";
        errorMessage = "Currency service temporarily unavailable";
      } else if (error.message.includes("rate not available")) {
        statusCode = 400;
        errorCode = "CURRENCY_NOT_SUPPORTED";
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: errorCode,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "currencies":
        return NextResponse.json({
          success: true,
          currencies: SUPPORTED_CURRENCIES.map((code) => ({
            code,
            name: getCurrencyName(code),
          })),
          total: SUPPORTED_CURRENCIES.length,
        });

      case "rates":
        const base = url.searchParams.get("base")?.toUpperCase() || "USD";
        if (!SUPPORTED_CURRENCIES.includes(base)) {
          return NextResponse.json(
            { success: false, error: `Unsupported base currency: ${base}` },
            { status: 400 }
          );
        }

        const ratesData = await currencyAPI.getExchangeRates(base);

        return NextResponse.json({
          success: true,
          base,
          rates: ratesData.rates,
          timestamp: ratesData.timestamp,
          source: ratesData.source,
        });

      case "health":
        return NextResponse.json({
          success: true,
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
        });

      default:
        return NextResponse.json({
          success: true,
          message: "Currency Converter API",
          version: "1.0.0",
          endpoints: {
            "POST /api/currency-converter": "Convert currency",
            "GET /api/currency-converter?action=currencies":
              "Get supported currencies",
            "GET /api/currency-converter?action=rates&base=USD":
              "Get exchange rates",
            "GET /api/currency-converter?action=health": "Health check",
          },
          supported_currencies: SUPPORTED_CURRENCIES.length,
          timestamp: new Date().toISOString(),
        });
    }
  } catch (error) {
    console.error("GET request error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function getCurrencyName(code: string): string {
  const currencyNames: Record<string, string> = {
    USD: "US Dollar",
    IDR: "Indonesian Rupiah",
    EUR: "Euro",
    JPY: "Japanese Yen",
    GBP: "British Pound Sterling",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    SGD: "Singapore Dollar",
    CNY: "Chinese Yuan",
    MYR: "Malaysian Ringgit",
    THB: "Thai Baht",
    KRW: "South Korean Won",
    CHF: "Swiss Franc",
    NOK: "Norwegian Krone",
    SEK: "Swedish Krona",
    DKK: "Danish Krone",
    PLN: "Polish Zloty",
    CZK: "Czech Koruna",
    HUF: "Hungarian Forint",
    TRY: "Turkish Lira",
    INR: "Indian Rupee",
    BRL: "Brazilian Real",
    ZAR: "South African Rand",
    RUB: "Russian Ruble",
    MXN: "Mexican Peso",
  };
  return currencyNames[code] ?? code;
}

// OPTIONS handler for CORS preflight - parameter tidak digunakan tapi diperlukan untuk signature
export async function OPTIONS(_request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
