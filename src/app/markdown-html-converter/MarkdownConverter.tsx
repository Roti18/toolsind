"use client";

import React, { useRef, useState } from "react";

export default function MarkdownToHtmlCard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [markdown, setMarkdown] = useState<string>(
    "# Hello World\n\nTulis Markdown di sini..."
  );
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (
      !f.name.toLowerCase().endsWith(".md") &&
      !f.name.toLowerCase().endsWith(".markdown")
    ) {
      alert("Please select a .md or .markdown file");
      return;
    }
    const text = await f.text();
    setMarkdown(text);
  };

  async function convertMarkdown(md?: string) {
    const payload = { markdown: typeof md === "string" ? md : markdown };
    setLoading(true);
    try {
      const res = await fetch("/api/md-to-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // always expect JSON (API returns JSON)
      const data = await res.json();

      if (!res.ok) {
        setHtml(
          `<pre style="color:#f87171">Error: ${data?.error ?? "Unknown"}</pre>`
        );
      } else {
        setHtml(data.html || "");
      }
    } catch (err) {
      setHtml(`<pre style="color:#f87171">Network error</pre>`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function downloadHtml() {
    const fullHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Converted Markdown</title>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setMarkdown("");
    setHtml("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-40">
      <div className="relative group w-full max-w-5xl p-6 mt-6 mb-10 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Glow layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Upload */}
        <label className="block mb-4 text-white">
          <span className="block mb-1 font-bold">Upload File Markdown</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,text/markdown"
            onChange={onFileChange}
            className="w-full  cursor-pointer file:bg-red-500 file:text-white file:rounded file:px-4 file:py-2 file:border-none bg-black text-white border border-red-500 rounded-lg"
          />
        </label>

        {/* Grid: textarea + preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Tulis Markdown atau upload file .md"
            className="w-full h-96 p-3 font-mono text-sm bg-black text-white border border-red-500 rounded-lg resize-none"
          />

          <div className="border border-red-500 rounded-lg p-3 h-96 overflow-auto bg-black text-white">
            <div className="flex justify-between mb-2">
              <strong>Preview</strong>
              {loading ? (
                <span className="opacity-70">Converting…</span>
              ) : (
                <span className="opacity-70">Ready</span>
              )}
            </div>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4 font-bold">
          <button
            onClick={() => convertMarkdown()}
            disabled={loading}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg border border-red-500 hover:bg-black transition duration-300 disabled:opacity-60"
          >
            Convert now
          </button>

          <button
            onClick={downloadHtml}
            disabled={!html}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg border border-red-500 hover:bg-black transition duration-300 disabled:opacity-60"
          >
            Download HTML
          </button>

          <button
            onClick={clearAll}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg border border-red-500 hover:bg-black transition duration-300"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
