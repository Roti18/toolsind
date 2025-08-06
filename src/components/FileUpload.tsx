// app/convert/page.tsx
"use client";

import { useState } from "react";

export default function ConverterPage() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/convert/pdf-to-docx", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } else {
      alert("Gagal mengonversi file");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF to DOCX Converter</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          name="file"
          accept=".pdf"
          required
          className="block w-full text-sm text-white file:bg-red-600 file:text-white file:px-4 file:py-2 file:rounded-md file:border-0 file:cursor-pointer"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md"
        >
          {loading ? "Mengonversi..." : "Convert to DOCX"}
        </button>
      </form>
    </div>
  );
}
