"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ColorTools() {
  const [color, setColor] = useState("#ff0000");
  const [copiedFormat, setCopiedFormat] = useState<
    "hex" | "rgb" | "hsl" | null
  >(null);

  const hex = color;
  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const handleCopy = (text: string, format: "hex" | "rgb" | "hsl") => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl p-6 mt-6 mb-10 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
        {/* Glow Layer */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Color Picker */}
        <label htmlFor="color" className="block mb-6">
          <span className="block mb-2 text-white">Pilih Warna:</span>
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-16 rounded border border-zinc-700"
          />
        </label>

        {/* Format Kode */}
        <div className="space-y-3">
          <ColorItem
            label="HEX"
            value={hex}
            copied={copiedFormat === "hex"}
            onCopy={() => handleCopy(hex, "hex")}
          />
          {rgb && (
            <ColorItem
              label="RGB"
              value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              copied={copiedFormat === "rgb"}
              onCopy={() =>
                handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")
              }
            />
          )}
          {hsl && (
            <ColorItem
              label="HSL"
              value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
              copied={copiedFormat === "hsl"}
              onCopy={() =>
                handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "hsl")
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ColorItem({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-md border border-red-500 relative">
      <div>
        <span className="text-red-400 font-semibold">{label}:</span>{" "}
        <code className="text-white">{value}</code>
      </div>
      <button
        onClick={onCopy}
        className="p-1 rounded hover:bg-red-500/20 transition"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <Copy className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}

function hexToRgb(hex: string) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return match
    ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
      }
    : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
