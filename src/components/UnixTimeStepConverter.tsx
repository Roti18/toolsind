"use client";

import { useState } from "react";
import { Calendar, Clock, XCircleIcon } from "lucide-react";

export default function UnixTimestampConverter() {
  const [unix, setUnix] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/unix-converter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unix: Number(unix) }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setResult(data.localTime);
      } else {
        setError(data.error || "Conversion failed");
      }
    } catch {
      setLoading(false);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        {/* Glow Layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-zinc-400 mt-2 text-sm">
            Convert Unix timestamp to local date & time instantly.
          </p>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border border-zinc-700 rounded-xl bg-zinc-800 p-3">
          <Clock className="w-5 h-5 text-red-400" />
          <input
            type="number"
            placeholder="Enter Unix timestamp..."
            value={unix}
            onChange={(e) => setUnix(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder-zinc-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleConvert}
          disabled={!unix || loading}
          className="w-full mt-6 py-3 cursor-pointer rounded-xl font-semibold border border-zinc-700 text-white transition duration-400 bg-red-500 hover:bg-black disabled:bg-zinc-700 disabled:cursor-not-allowed"
        >
          {loading ? "Converting..." : "Convert to Local Time"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <XCircleIcon className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <span>{result}</span>
          </div>
        )}
      </div>
    </div>
  );
}
