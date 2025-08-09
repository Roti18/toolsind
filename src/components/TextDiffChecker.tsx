"use client";

import { useState } from "react";

interface DiffPart {
  added?: boolean;
  removed?: boolean;
  value: string;
  index?: number;
}

export default function TextDiffChecker() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [result, setResult] = useState<DiffPart[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCheckDiff = async () => {
    setLoading(true);
    setResult([]);

    try {
      const res = await fetch("/api/text-diff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldText, newText }),
      });

      const data = await res.json();
      if (data.diff) {
        setResult(data.diff);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Error checking diff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-40">
      <div className="relative group w-full max-w-2xl p-6 mt-6 mb-10 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Blink Glow Layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Old Text */}
        <label className="block mb-4 text-white">
          <span className="block mb-1 font-semibold">Original Text</span>
          <textarea
            className="w-full p-3 rounded-lg bg-black text-white border border-red-500 focus:border-white focus:outline-none"
            placeholder="Type the original text..."
            rows={4}
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
          />
        </label>

        {/* New Text */}
        <label className="block mb-4 text-white">
          <span className="block mb-1 font-semibold">New Text</span>
          <textarea
            className="w-full p-3 rounded-lg bg-black text-white border border-red-500 focus:border-white focus:outline-none"
            placeholder="Type the new text..."
            rows={4}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        </label>

        {/* Check Button */}
        <div className="flex justify-end">
          <button
            onClick={handleCheckDiff}
            disabled={loading}
            className="px-4 py-2 font-bold bg-red-500 text-white rounded-lg border border-red-500 hover:bg-black hover:text-red-500 transition duration-300"
          >
            {loading ? "Checking..." : "Check Difference"}
          </button>
        </div>

        {/* Result */}
        {result.length > 0 && (
          <div className="mt-6 p-4 border border-red-500 rounded-md bg-black text-white space-y-2">
            <h3 className="text-lg font-semibold text-red-500">Result</h3>
            <p className="leading-7">
              {result.map((part) => {
                if (part.added) {
                  return (
                    <span
                      key={part.index}
                      className="bg-green-700 px-1 rounded-sm"
                    >
                      {part.value}
                    </span>
                  );
                }
                if (part.removed) {
                  return (
                    <span
                      key={part.index}
                      className="bg-red-700 px-1 rounded-sm line-through"
                    >
                      {part.value}
                    </span>
                  );
                }
                return <span key={part.index}>{part.value}</span>;
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
