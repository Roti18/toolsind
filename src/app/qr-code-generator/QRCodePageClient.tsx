"use client";

import { useState, useRef } from "react";
import jsQR from "jsqr";
import Image from "next/image";

export default function QRCodePage() {
  const [text, setText] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    const res = await fetch("/api/qr/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const data = await res.json();
      setQrImage(data.qr);
    } else {
      alert("Gagal generate QR dari server");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        setScanResult(code ? code.data : "Tidak ada QR terdeteksi.");
      };
      if (ev.target?.result) {
        img.src = ev.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <Image
            src={qrImage}
            alt="QR Zoomed"
            width={500}
            height={500}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-lg transition duration-300"
          />
        </div>
      )}

      <div className="min-h-screen bg-zinc-950 text-white px-6 py-12 mt-30">
        <div className="max-w-7xl mx-auto">
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-10">
            {/* Generate QR */}
            <div className="relative overflow-hidden group rounded-2xl p-6 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-lg">
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
                <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold mb-4 text-white">
                Generate QR Code
              </h2>

              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write Something..."
                className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-950 text-white placeholder-zinc-400 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />

              <button
                onClick={generateQR}
                className="w-full  py-3 rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200"
              >
                Create QR Code
              </button>

              <div className="mt-6 h-[220px] flex justify-center items-center">
                {qrImage && (
                  <Image
                    src={qrImage}
                    alt="Generated QR"
                    width={220}
                    height={220}
                    onClick={() => setIsZoomed(true)}
                    className="rounded-md border border-zinc-700 cursor-zoom-in transition duration-200 hover:scale-105"
                  />
                )}
              </div>
            </div>

            {/* Scan QR */}
            <div className="relative overflow-hidden group rounded-2xl p-6 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-lg">
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
                <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
              </div>

              <h2 className="text-xl font-semibold mb-4 text-white">
                Scan QR from Image
              </h2>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm cursor-pointer text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-950 file:text-white hover:file:bg-zinc-700 mb-4 file:transition-colors file:duration-300"
              />

              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

              <div className="mt-4 p-4 bg-zinc-950/60 border border-zinc-800 rounded-md">
                <p className="text-sm text-zinc-400 mb-1">Result Scanning:</p>
                <p className="text-lg text-white break-words font-mono">
                  {scanResult || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
