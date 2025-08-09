"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check, TriangleAlert } from "lucide-react";
import Modal from "../../components/Modal"; // Import komponen Modal yang telah diperbarui

export default function AiCodeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);

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

  // Auto scroll ke bawah pas ada output baru
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);

  // Handler untuk menutup modal
  const handleCloseAlert = () => {
    setShowWelcomeAlert(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kiri - Form Sticky */}
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <div className="relative group rounded-2xl p-6 border border-zinc-800 bg-zinc-900/40 backdrop-blur-lg shadow-lg overflow-hidden transition-shadow duration-300">
              {/* Gradient Hover Glow */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
                <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a calculator using JavaScript"
                  rows={8}
                  className="w-full px-4 py-5 rounded-lg bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200 disabled:bg-red-800 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Kanan - Output Scrollable */}
        <div className="md:col-span-2">
          <div
            className={`relative group rounded-2xl p-6 border border-zinc-800 bg-zinc-900/40 backdrop-blur-lg overflow-hidden transition-all duration-500 ${
              loading
                ? "shadow-xl shadow-red-500/20 animate-pulse"
                : "shadow-lg"
            }`}
          >
            {/* Gradient Hover Glow */}
            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
              <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
            </div>

            {/* Output Box */}
            <div
              ref={outputRef}
              className="min-h-[300px] max-h-[500px] overflow-auto p-4 rounded-md bg-zinc-950/60 border border-zinc-800 shadow-inner relative"
            >
              {/* Tombol Copy Sticky */}
              <div className="sticky top-0 right-0 flex justify-end z-10">
                <button
                  onClick={handleCopy}
                  disabled={!result}
                  className="m-1 p-1.5 rounded hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              <pre className="whitespace-pre-wrap text-zinc-300 font-mono text-sm pr-10 -mt-7">
                {result ||
                  (loading
                    ? "Generating..."
                    : "Your generated code will appear here...")}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Memanggil komponen Modal */}
      {showWelcomeAlert && (
        <Modal onClose={handleCloseAlert}>
          <div className="text-center">
            <div className="flex justify-center">
              <TriangleAlert className="mb-4 h-16 w-16 text-red-500" />
            </div>
            <p className="text-white">
              Mohon jangan membuat prompt yang terlalu panjang untuk menghemat
              token AI.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
