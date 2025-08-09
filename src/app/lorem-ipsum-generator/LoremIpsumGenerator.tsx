"use client";

import { useState } from "react";
import { Copy, CheckCircle, Download } from "lucide-react";

export default function LoremIpsumGenerator() {
  const [words, setWords] = useState(50);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const res = await fetch("/api/lorem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words }),
    });
    const data = await res.json();
    setOutput(data.text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lorem-ipsum.txt";
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        {/* Glow */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Lorem Ipsum Generator
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Generate placeholder text easily.
          </p>
        </div>

        {/* Input */}
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            value={words}
            onChange={(e) => setWords(Number(e.target.value))}
            className="flex-1 p-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-400 focus:outline-none"
            placeholder="Number of words"
          />
          <button
            onClick={handleGenerate}
            className="py-3 cursor-pointer px-6 rounded-xl font-semibold text-white bg-red-500 hover:bg-black border border-zinc-700"
          >
            Generate
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="mt-6">
            <label className="text-sm text-zinc-400 block mb-1">
              Generated Text
            </label>
            <pre className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 font-mono text-sm overflow-auto max-h-60">
              {output}
            </pre>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 py-2 px-4 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 py-2 px-4 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
