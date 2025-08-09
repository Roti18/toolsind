"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

export default function TextTruncator() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState<number | string>(10);
  const [mode, setMode] = useState<"chars" | "words" | "keyword">("chars");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTruncate = async () => {
    const res = await fetch("/api/text-truncator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, limit, mode }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `truncated-text-${mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        {/* Glow layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-white">
            Text Truncator / Limiter
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Limit text by characters, words, or keyword easily.
          </p>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full h-40 p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-400 focus:outline-none font-mono text-sm resize-none"
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Controls */}
        <div className="flex gap-4 mt-6">
          <input
            type={mode === "keyword" ? "text" : "number"}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-400 focus:outline-none text-sm"
            placeholder={mode === "keyword" ? "Enter keyword" : "Enter limit"}
            value={limit}
            onChange={(e) =>
              setLimit(
                mode === "keyword" ? e.target.value : Number(e.target.value)
              )
            }
          />

          <select
            value={mode}
            onChange={(e) => {
              const newMode = e.target.value as "chars" | "words" | "keyword";
              setMode(newMode);
              setLimit(newMode === "keyword" ? "" : 10);
            }}
            className="cursor-pointer px-4 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-400 focus:outline-none text-sm"
          >
            <option value="chars">Characters</option>
            <option value="words">Words</option>
            <option value="keyword">Keyword</option>
          </select>

          <button
            onClick={handleTruncate}
            className="px-6 py-3 rounded-xl font-semibold text-white transition duration-400 cursor-pointer border border-zinc-700 bg-red-500 hover:bg-black disabled:bg-zinc-700 disabled:cursor-not-allowed"
            disabled={!text || (mode !== "keyword" && !limit)}
          >
            Truncate
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-zinc-400">Truncated Result</label>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-red-500 text-white transition duration-300 flex items-center justify-center"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="cursor-pointer w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-red-500 text-white transition duration-300 flex items-center justify-center"
                  title="Download as text file"
                >
                  <Download className="cursor-pointer w-4 h-4" />
                </button>
              </div>
            </div>

            <pre className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 font-mono text-sm overflow-auto max-h-60">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
