"use client";

import { useState } from "react";
import { formatJSON } from "@/utils/jsonTools";
import { XCircleIcon, Copy, Check, Download } from "lucide-react";

export default function JsonFormatterValidator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const formatted = formatJSON(input);
    if (formatted) {
      setOutput(formatted);
      setError("");
    } else {
      setError("Invalid JSON, cannot format.");
      setOutput("");
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    const res = await fetch("/api/json-validator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonString: input }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.valid) {
      setError("");
      alert("✅ JSON is valid!");
    } else {
      setError(`❌ Invalid JSON: ${data.error}`);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
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
          <p className="text-zinc-400 mt-2 text-sm">
            Paste your JSON below to format or validate it.
          </p>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full h-40 p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-red-400 focus:outline-none font-mono text-sm resize-none"
          placeholder="Paste your JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleFormat}
            className="flex-1 py-3 cursor-pointer rounded-xl font-semibold border border-zinc-700 text-white transition duration-400 bg-red-500 hover:bg-black disabled:bg-zinc-700 disabled:cursor-not-allowed"
            disabled={!input}
          >
            Format JSON
          </button>
          <button
            onClick={handleValidate}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition duration-400 cursor-pointer border border-zinc-700 bg-black hover:bg-red-500 disabled:bg-zinc-700 disabled:cursor-not-allowed"
            disabled={!input || loading}
          >
            {loading ? "Validating..." : "Validate JSON"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <XCircleIcon className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-400 block">
                Formatted JSON
              </label>
              <div className="flex items-center gap-2">
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-zinc-700 transition"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="p-1 rounded hover:bg-zinc-700 transition"
                  title="Download JSON"
                >
                  <Download className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>
            <pre className="w-full p-4 rounded-xl bg-zinc-800 text-white border border-zinc-700 font-mono text-sm overflow-auto max-h-60">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
