"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function ImageCompressor() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);

  const handleServerCompress = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("quality", String(Math.round(quality * 100)));
    formData.append("maxWidth", String(maxWidth));

    const res = await fetch("/api/image-compressor", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      setOutputUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024,
      sizes = ["Bytes", "KB", "MB", "GB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-40">
      <div className="relative group w-full max-w-xl p-6 mt-6 mb-10 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Blink Glow Layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Upload Input */}
        <label className="block mb-4 text-white">
          <span className="block mb-1">Upload Image</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) setFile(selectedFile);
            }}
            className="w-full cursor-pointer file:bg-red-500 file:text-white file:rounded file:px-4 file:py-2 file:border-none bg-black text-white border border-red-500 rounded"
          />
        </label>

        {/* Quality Slider */}
        <label className="block mb-4 text-white">
          <span className="block mb-1">
            Quality: {Math.round(quality * 100)}%
          </span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full accent-red-500"
          />
        </label>

        {/* Max Width Slider */}
        <label className="block mb-4 text-white">
          <span className="block mb-1">Max Width: {maxWidth}px</span>
          <input
            type="range"
            min="300"
            max="3000"
            step="100"
            value={maxWidth}
            onChange={(e) => setMaxWidth(parseInt(e.target.value))}
            className="w-full accent-red-500"
          />
        </label>

        {/* Compress Button */}
        <div className="flex justify-end">
          <button
            onClick={handleServerCompress}
            className="px-4 cursor-pointer font-bold py-2 bg-red-500 text-white rounded-lg border border-red-500 hover:bg-black transition duration-300"
          >
            Compress
          </button>
        </div>

        {/* Result Preview */}
        {outputUrl && (
          <div className="mt-4 p-3 border border-red-500 rounded-md bg-black text-white space-y-2">
            <p>Ukuran hasil: {formatBytes(compressedSize)}</p>
            <Image
              src={outputUrl}
              alt="Hasil kompresi"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              className="max-w-full rounded"
              unoptimized // Important for blob URLs
            />
            <div className="mt-4">
              <a
                href={outputUrl}
                download="compressed.jpg"
                className="inline-block px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow-lg hover:bg-black hover:text-red-500 border border-red-500 transition duration-300 ease-in-out"
              >
                Download Hasil
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
