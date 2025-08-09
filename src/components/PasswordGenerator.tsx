"use client";

import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const handleGenerate = async () => {
    const params = new URLSearchParams({
      length: length.toString(),
      upper: upper.toString(),
      numbers: numbers.toString(),
      symbols: symbols.toString(),
    });
    const res = await fetch(`/api/password?${params}`);
    const data = await res.json();
    setPassword(data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl p-6 mt-6 mb-10 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
        {/* Glow Layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Length */}
        <label className="block mb-4">
          <span className="block mb-1 text-white">Length: {length}</span>
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </label>

        {/* Checkboxes */}
        <div className="mb-4 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={upper}
              onChange={(e) => setUpper(e.target.checked)}
              className="accent-red-500 cursor-pointer"
            />
            Include Uppercase
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={numbers}
              onChange={(e) => setNumbers(e.target.checked)}
              className="accent-red-500 cursor-pointer"
            />
            Include Numbers
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={symbols}
              onChange={(e) => setSymbols(e.target.checked)}
              className="accent-red-500 cursor-pointer"
            />
            Include Symbols
          </label>
        </div>

        {/* Tombol Generate */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg border border-red-500 hover:bg-black transition duration-300"
          >
            Generate
          </button>
        </div>

        {/* Output */}
        {password && (
          <div className="mt-6 p-3 border border-red-500 rounded-md bg-black text-white whitespace-pre-wrap">
            <code className="break-all">{password}</code>
          </div>
        )}
      </div>
    </div>
  );
}
