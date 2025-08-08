// src/components/ColorToolsClient.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamic import component ColorTools dengan SSR dimatikan
const ColorTools = dynamic(() => import("./ColorTools"), {
  ssr: false,
});

export default function ColorToolsClient() {
  return <ColorTools />;
}
