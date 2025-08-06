"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import NextImage from "next/image";

export default function QRCodePage() {
  const [text, setText] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [scanResult, setScanResult] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR
  const generateQR = () => {
    QRCode.toDataURL(text).then(setQrImage);
  };

  // Scan QR dari image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image(); // Gunakan window.Image biar aman
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

        if (code) {
          setScanResult(code.data);
        } else {
          setScanResult("Tidak ada QR terdeteksi.");
        }
      };
      if (ev.target?.result) {
        img.src = ev.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">QR Code Generator & Scanner</h1>

      {/* Generator */}
      <div className="mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Masukkan text"
          className="border p-2"
        />
        <button
          onClick={generateQR}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Generate QR
        </button>

        {qrImage && (
          <div className="mt-4">
            <NextImage
              src={qrImage}
              alt="Generated QR"
              width={200}
              height={200}
            />
          </div>
        )}
      </div>

      {/* Scanner */}
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        <p className="mt-4">Hasil Scan: {scanResult}</p>
      </div>
    </div>
  );
}
