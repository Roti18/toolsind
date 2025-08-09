// components/FileUpload.tsx
"use client";

import { useState, useEffect } from "react";
import { FileUpIcon, TriangleAlert } from "lucide-react";
import Modal from "./Modal";

const CONVERSION_OPTIONS: { [key: string]: string[] } = {
  pdf: ["docx", "txt", "html", "jpg", "png", "xlsx", "pptx"],
  docx: ["pdf", "txt", "html", "rtf"],
  doc: ["pdf", "docx", "txt", "html"],
  txt: ["pdf", "docx", "html", "rtf"],
  html: ["pdf", "docx", "txt"],
  xlsx: ["pdf", "csv", "html"],
  xls: ["pdf", "csv", "xlsx", "html"],
  pptx: ["pdf", "jpg", "png"],
  ppt: ["pdf", "pptx", "jpg", "png"],
  jpg: ["pdf", "png", "gif", "webp"],
  jpeg: ["pdf", "png", "gif", "webp"],
  png: ["pdf", "jpg", "gif", "webp"],
  csv: ["xlsx", "pdf", "html"],
};

const FORMAT_LABELS: { [key: string]: string } = {
  pdf: "PDF Document",
  docx: "Word Document (DOCX)",
  doc: "Word Document (DOC)",
  txt: "Text File",
  html: "HTML File",
  rtf: "Rich Text Format",
  xlsx: "Excel Spreadsheet (XLSX)",
  xls: "Excel Spreadsheet (XLS)",
  csv: "CSV File",
  pptx: "PowerPoint (PPTX)",
  ppt: "PowerPoint (PPT)",
  jpg: "JPEG Image",
  jpeg: "JPEG Image",
  png: "PNG Image",
  gif: "GIF Image",
  webp: "WebP Image",
};

export default function FileUpload() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("");
  const [availableTargets, setAvailableTargets] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(true);

  useEffect(() => {
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop()?.toLowerCase() || "";
      setSourceFormat(ext);
      const targets = CONVERSION_OPTIONS[ext] || [];
      setAvailableTargets(targets);
      if (!targets.includes(targetFormat)) {
        setTargetFormat(targets[0] || "");
      }
      setError("");
    }
  }, [selectedFile, targetFormat]);

  const handleCloseAlert = () => {
    setShowWelcomeAlert(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !targetFormat) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("format", targetFormat);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedFile.name.split(".")[0]}.${targetFormat}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        // Reset
        setSelectedFile(null);
        setSourceFormat("");
        setTargetFormat("");
        setAvailableTargets([]);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Conversion failed.");
      }
    } catch (err) {
      setError("Something went wrong during conversion.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
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
            Convert documents, spreadsheets, presentations, and images with
            ease.
          </p>
        </div>

        {/* File Input */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          className={`w-full p-6 rounded-xl border-2 border-dashed text-center transition-all ${
            dragActive
              ? "border-red-400 bg-red-900/10"
              : "border-zinc-700 hover:border-red-400"
          }`}
        >
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center justify-center gap-2">
              <FileUpIcon className="w-8 h-8 text-red-500" />
              <span className="text-zinc-300">
                {selectedFile ? (
                  <>
                    <strong>{selectedFile.name}</strong>
                    <br />
                    <span className="text-xs text-zinc-500">
                      {formatFileSize(selectedFile.size)} •{" "}
                      {sourceFormat.toUpperCase()}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-zinc-200">
                      Click or drag to upload
                    </span>
                    <br />
                    <span className="text-xs text-zinc-500">
                      PDF, DOCX, PPTX, JPG, etc.
                    </span>
                  </>
                )}
              </span>
            </div>
          </label>
        </div>

        {/* Format Select */}
        {availableTargets.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                From Format
              </label>
              <div className="bg-zinc-800 text-white rounded-md px-4 py-2 text-sm">
                {FORMAT_LABELS[sourceFormat] || sourceFormat.toUpperCase()}
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                To Format
              </label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700"
              >
                <option value="">Select format</option>
                {availableTargets.map((tgt) => (
                  <option key={tgt} value={tgt}>
                    {FORMAT_LABELS[tgt] || tgt.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className="mt-4 text-sm text-red-400">⚠️ {error}</div>}

        {/* Convert Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !targetFormat || loading}
          className="w-full mt-6 py-3 rounded-xl font-semibold text-white transition duration-300 bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 disabled:cursor-not-allowed"
        >
          {loading
            ? "Converting..."
            : `Convert to ${targetFormat.toUpperCase()}`}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-zinc-500">
          Powered by ConvertAPI — Free 250 conversions/month
        </div>
      </div>
      {showWelcomeAlert && (
        <Modal onClose={handleCloseAlert}>
          <div className="text-center">
            <div className="flex justify-center">
              <TriangleAlert className="mb-4 h-16 w-16 text-red-500" />
            </div>
            <p className="text-white">
              Mohon jangan menggunakan converter terlalu banyak untuk menghemat
              token API.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
