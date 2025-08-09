"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const currencies = [
  "USD",
  "IDR",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "CAD",
  "SGD",
  "CNY",
];

// Tipe data response API yang kita harapkan
interface ConversionResponse {
  success: boolean;
  result?: number;
  rate?: number;
  error?: string;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("IDR");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Ref untuk membatalkan request sebelumnya agar gak race condition
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fungsi konversi currency - wrap dengan useCallback
  const handleConvert = useCallback(async () => {
    if (amount <= 0) {
      console.warn("Amount must be greater than 0");
      setResult(null);
      setRate(null);
      return;
    }
    if (from === to) {
      setResult(amount);
      setRate(1);
      setLastUpdated(new Date());
      console.log(
        `Same currency conversion: ${amount} ${from} = ${amount} ${to}`
      );
      return;
    }

    // Batalkan request sebelumnya kalau masih jalan
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setResult(null);
    setRate(null);

    try {
      console.log(`Converting ${amount} from ${from} to ${to}`);
      const res = await fetch("/api/currency-converter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, from, to }),
        signal: controller.signal,
      });
      const data: ConversionResponse = await res.json();

      if (
        data.success &&
        typeof data.result === "number" &&
        typeof data.rate === "number"
      ) {
        setResult(data.result);
        setRate(data.rate);
        setLastUpdated(new Date());
        console.log(
          `Conversion success: ${amount} ${from} = ${data.result} ${to} (rate: ${data.rate})`
        );
      } else {
        const errMsg = data.error ?? "Unknown error during conversion";
        alert("Conversion failed: " + errMsg);
        console.error("Conversion API error:", errMsg);
        setResult(null);
        setRate(null);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Previous conversion request aborted");
      } else {
        alert("Error connecting to server");
        console.error("Conversion fetch error:", error);
      }
      setResult(null);
      setRate(null);
    } finally {
      setLoading(false);
    }
  }, [amount, from, to]); // Dependencies untuk useCallback

  // Debounce conversion saat amount, from, atau to berubah
  useEffect(() => {
    if (amount > 0 && from && to) {
      const timeoutId = setTimeout(() => {
        handleConvert();
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    } else {
      // Reset kalau input invalid
      setResult(null);
      setRate(null);
    }
  }, [amount, from, to, handleConvert]); // Tambah handleConvert sebagai dependency

  // Auto-refresh rates tiap 30 menit
  useEffect(() => {
    if (amount > 0) {
      handleConvert();
    }

    const intervalId = setInterval(() => {
      if (amount > 0) {
        handleConvert();
      }
    }, 1800000);

    return () => clearInterval(intervalId);
  }, [amount, handleConvert]); // Tambah dependencies

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <h2 className="text-lg font-bold text-white mb-4">
          Currency Converter
          {lastUpdated && (
            <span className="text-xs font-normal text-zinc-400 ml-2">
              (Updated: {lastUpdated.toLocaleTimeString()})
            </span>
          )}
        </h2>

        {/* Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!Number.isNaN(val)) setAmount(val);
          }}
          className="w-full p-3 mb-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-500 focus:outline-none transition-colors"
          placeholder="Amount"
          min="0"
          step="any"
        />

        {/* From Currency */}
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-500 focus:outline-none transition-colors"
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        {/* To Currency */}
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-500 focus:outline-none transition-colors"
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading || amount <= 0}
          className="w-full cursor-pointer py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-black disabled:bg-gray-600 transition-colors duration-300 relative overflow-hidden"
        >
          <span className={loading ? "opacity-0" : "opacity-100"}>Convert</span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Converting...</span>
            </div>
          )}
        </button>

        {/* Result - Fixed height container */}
        <div className="mt-6 h-24 text-white">
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 h-full flex flex-col justify-center">
            {result !== null ? (
              <>
                <p className="text-lg font-semibold mb-2">
                  {amount.toLocaleString()} {from} ={" "}
                  {result.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}{" "}
                  {to}
                </p>
                <p className="text-sm text-zinc-400">
                  Rate:{" "}
                  {rate?.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}{" "}
                  ({from} → {to})
                </p>
              </>
            ) : (
              <p className="text-zinc-500 text-center">
                {loading ? "Converting..." : "Enter amount to convert"}
              </p>
            )}
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-center mt-4 text-zinc-500 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
          Real-time rates • Auto-refresh every 30min
        </div>
      </div>
    </div>
  );
}
