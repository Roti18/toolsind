// src/app/api/convert/pdf-to-docx/route.ts
import { NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

// ENV Key
const publicKey: string = process.env.ILOVEPDF_PUBLIC_KEY ?? "";

interface StartResponse {
  server: string;
  task: string;
}

export async function POST(): Promise<NextResponse> {
  try {
    if (!publicKey) {
      return NextResponse.json(
        { error: "ILOVEPDF_PUBLIC_KEY tidak ditemukan" },
        { status: 500 }
      );
    }

    // Path file input dan output
    const inputPath: string = path.join(process.cwd(), "uploads", "sample.pdf");
    const outputDir: string = path.join(process.cwd(), "converted");
    const outputPath: string = path.join(outputDir, "hasil.docx");

    // Pastikan folder output ada
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Start Task - pakai tool pdf2word
    const startRes: AxiosResponse<StartResponse> = await axios.post(
      "https://api.ilovepdf.com/v1/start",
      {
        public_key: publicKey,
        tool: "pdf2word",
      }
    );

    const { server, task } = startRes.data;

    // 2. Upload file
    const form = new FormData();
    form.append("task", task);
    form.append("file", fs.createReadStream(inputPath));

    await axios.post(`https://${server}/v1/upload`, form, {
      headers: form.getHeaders(),
    });

    // 3. Process
    await axios.post(`https://${server}/v1/process`, { task });

    // 4. Download sebagai buffer (arraybuffer) agar kompatibel di Next.js App Router
    const downloadRes = await axios.post(
      `https://${server}/v1/download`,
      { task },
      { responseType: "arraybuffer" }
    );

    // Simpan file hasil
    fs.writeFileSync(outputPath, downloadRes.data);

    return NextResponse.json({
      message: "Sukses convert",
      path: "/converted/hasil.docx",
    });
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
