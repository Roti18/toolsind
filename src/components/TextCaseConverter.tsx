"use client";

import { useState } from "react";
import { toUpperCase, toLowerCase, toCapitalized } from "@/utils/textCase";
import { Copy, Check } from "lucide-react";

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"upper" | "lower" | "capitalize">("upper");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    const res = await fetch("/api/text-case", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    const originalText = data.original || "";

    let converted = "";
    switch (mode) {
      case "upper":
        converted = toUpperCase(originalText);
        break;
      case "lower":
        converted = toLowerCase(originalText);
        break;
      case "capitalize":
        converted = toCapitalized(originalText);
        break;
      default:
        converted = originalText;
    }

    setResult(converted);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Input */}
      <textarea
        className="w-full p-2 border border-zinc-700 rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:border-red"
        rows={15}
        placeholder="Masukkan teks di sini..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Dropdown Mode */}
      <div className="mb-4 mt-4">
        <label className="text-sm text-zinc-400 block mb-1">
          Conversion Mode
        </label>
        <select
          value={mode}
          onChange={(e) => {
            const value = e.target.value;
            if (
              value === "upper" ||
              value === "lower" ||
              value === "capitalize"
            ) {
              setMode(value);
            }
          }}
          className="w-full px-4 py-3 rounded-lg bg-black text-white border border-zinc-700 focus:outline-none focus:border-red-500"
        >
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      {/* Tombol Convert */}
      <div className="flex justify-end">
        <button
          className="px-4 font-bold py-2 bg-red-500 cursor-pointer text-white rounded-lg border border-red-500 hover:bg-black transition duration-300"
          onClick={handleConvert}
        >
          Convert
        </button>
      </div>

      {/* Hasil + Tombol Copy */}
      {result && (
        <div className="mt-4 p-3 border border-red-500 rounded-md bg-black text-white whitespace-pre-wrap relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-red-500/20 transition"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-white cursor-pointer" />
              )}
            </button>
          </div>
          {result}
        </div>
      )}
    </div>
  );
}
