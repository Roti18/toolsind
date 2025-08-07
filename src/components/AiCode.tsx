"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function AiCodeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const res = await fetch("/api/ai-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setResult((prev) => prev + chunk);
      }
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Prompt Input */}
          <div className="relative group rounded-2xl p-6 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-lg overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
              <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Buatkan fungsi sorting di JavaScript"
                rows={8}
                className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200"
              >
                {loading ? "Memproses..." : "Kirim ke AI"}
              </button>
            </form>
          </div>

          {/* Result Output */}
          <div className="relative group rounded-2xl p-6 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-lg overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
              <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
            </div>

            <div className="relative">
              <button
                onClick={handleCopy}
                disabled={!result}
                className="absolute cursor-pointer top-2 right-2 p-2 rounded hover:bg-zinc-800 transition disabled:opacity-50"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-white" />
                )}
              </button>

              <div className="h-[300px] overflow-auto p-4 rounded-md bg-zinc-950/60 border border-zinc-800 shadow-inner">
                <pre className="whitespace-pre-wrap text-zinc-300 font-mono text-sm">
                  {result || ""}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
