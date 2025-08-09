"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function FakeDataPage() {
  const [type, setType] = useState("account");
  const [count, setCount] = useState(5);
  const [result, setResult] = useState<Record<string, unknown>[]>([]);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setResult([]);
    setCopied(false);
    const res = await fetch("/api/fake-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, count }),
    });
    const data = await res.json();
    setResult(data.data || []);
  };

  const copyJSON = () => {
    if (result.length === 0) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-fake-data.json`;
    a.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="relative group w-full max-w-2xl p-6 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Glow Layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-4">
          <select
            className="p-3 rounded-lg bg-black text-white border border-red-500 flex-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="account">Account</option>
            <option value="product">Product</option>
            <option value="userProfile">User Profile</option>
            <option value="transaction">Transaction</option>
            <option value="article">Article</option>
            <option value="game">Game</option>
            <option value="voucher">Voucher</option>
            <option value="testimonial">Testimonial</option>
          </select>

          <input
            type="number"
            min={1}
            className="p-3 rounded-lg bg-black text-white border border-red-500 w-24 no-spinner"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={fetchData}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg border border-red-500 hover:bg-black hover:text-red-500 transition duration-300"
          >
            Generate
          </button>

          <button
            onClick={downloadJSON}
            disabled={result.length === 0}
            className="px-4 cursor-pointer py-2 bg-black border text-white rounded-lg border-zinc-700  hover:bg-red-500 hover:text-white transition duration-300"
          >
            Download JSON
          </button>
        </div>

        {/* Result with Copy Icon */}
        <div className="relative">
          {/* Copy Icon in Top Right */}
          {result.length > 0 && (
            <button
              onClick={copyJSON}
              className="absolute  top-4 right-4 text-red-400 hover:text-red-200 transition cursor-pointer"
            >
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          )}

          <pre className="bg-black border border-red-500 p-4 rounded-lg overflow-x-auto text-sm max-h-96 text-white">
            {result.length > 0
              ? JSON.stringify(result, null, 2)
              : "No data generated yet."}
          </pre>
        </div>
      </div>
    </div>
  );
}
