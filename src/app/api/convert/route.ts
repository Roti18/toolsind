import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios, { AxiosError, AxiosResponse } from "axios";
import FormData from "form-data";

// Type definitions
interface ConvertApiFileInfo {
  FileName: string;
  FileSize: number;
  FileData?: string;
  Url?: string;
}

interface ConvertApiResponse {
  Files?: ConvertApiFileInfo[];
  ConversionTime?: string;
  [key: string]: unknown;
}

interface ConversionError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: unknown;
  };
  code?: string;
}

// interface ErrorResponse {
//   error: string;
//   timestamp?: string;
//   helpUrl?: string;
//   setup?: {
//     step1: string;
//     step2: string;
//     step3: string;
//     step4: string;
//     freeQuota: string;
//   };
//   supportedFormats?: string;
//   sourceFormat?: string;
//   targetFormat?: string;
//   supportedTargetFormats?: string[];
//   fileSize?: string;
//   details?: unknown;
// }

// File size limit (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Supported conversions mapping (simplified)
const SUPPORTED_CONVERSIONS: Record<string, string[]> = {
  pdf: ["docx", "txt", "html", "jpg", "png", "xlsx", "pptx"],
  docx: ["pdf", "txt", "html", "docx", "rtf"],
  txt: ["pdf", "docx", "html", "rtf"],
  html: ["pdf", "docx", "txt"],
  xlsx: ["pdf", "csv", "xlsx", "html"],
  pptx: ["pdf", "pptx", "jpg", "png"],
  jpg: ["pdf", "png", "jpg", "gif", "webp"],
  png: ["pdf", "jpg", "png", "gif", "webp"],
  csv: ["xlsx", "pdf", "html"],
};

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  txt: "text/plain",
  html: "text/html",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ppt: "application/vnd.ms-powerpoint",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  csv: "text/csv",
  rtf: "application/rtf",
};

// Get file extension from filename
function getFileExtension(file: File): string {
  if (file.name.includes(".")) {
    return file.name.split(".").pop()?.toLowerCase() || "";
  }
  return "";
}

// Check if conversion is supported
function isConversionSupported(fromFormat: string, toFormat: string): boolean {
  const supportedFormats =
    SUPPORTED_CONVERSIONS[fromFormat] ||
    SUPPORTED_CONVERSIONS[fromFormat.toLowerCase()];
  return supportedFormats
    ? supportedFormats.includes(toFormat.toLowerCase())
    : false;
}

// Type guard for AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

// Type guard for ConversionError
function isConversionError(error: unknown): error is ConversionError {
  return error instanceof Error && ("response" in error || "code" in error);
}

export async function POST(req: Request): Promise<Response> {
  let filePath: string | null = null;

  try {
    const apiKey = process.env.CONVERTAPI_SECRET;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "ConvertAPI key diperlukan",
          setup: {
            step1: "Daftar gratis di https://www.convertapi.com/",
            step2: "Dapatkan Secret Key dari dashboard",
            step3: "Tambahkan ke .env.local: CONVERTAPI_SECRET=your_secret_key",
            step4: "Restart server",
            freeQuota: "250 conversions per month",
          },
        },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const targetFormat = form.get("format") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan dalam form data" },
        { status: 400 }
      );
    }
    if (!targetFormat) {
      return NextResponse.json(
        { error: "Target format tidak ditentukan. Gunakan parameter 'format'" },
        { status: 400 }
      );
    }

    const sourceFormat = getFileExtension(file);
    const targetFormatLower = targetFormat.toLowerCase();

    if (!sourceFormat) {
      return NextResponse.json(
        {
          error: "Format file tidak dapat dideteksi",
          supportedFormats: Object.keys(SUPPORTED_CONVERSIONS).join(", "),
        },
        { status: 400 }
      );
    }

    if (!isConversionSupported(sourceFormat, targetFormatLower)) {
      return NextResponse.json(
        {
          error: `Konversi dari ${sourceFormat.toUpperCase()} ke ${targetFormatLower.toUpperCase()} tidak didukung`,
          sourceFormat: sourceFormat.toUpperCase(),
          targetFormat: targetFormatLower.toUpperCase(),
          supportedTargetFormats: SUPPORTED_CONVERSIONS[sourceFormat],
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File terlalu besar. Maksimal ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json(
        { error: "File kosong atau corrupt" },
        { status: 400 }
      );
    }

    // Gunakan /tmp untuk Vercel
    const tempDir = "/tmp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    filePath = path.join(tempDir, `input_${timestamp}_${sanitizedFileName}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Panggil ConvertAPI
    const convertForm = new FormData();
    convertForm.append("File", fs.createReadStream(filePath));

    const apiUrl = `https://v2.convertapi.com/convert/${sourceFormat}/to/${targetFormatLower}?Secret=${apiKey}`;

    let convertResponse: AxiosResponse<ConvertApiResponse>;
    try {
      convertResponse = await axios.post(apiUrl, convertForm, {
        headers: {
          ...convertForm.getHeaders(),
          "User-Agent": "Universal File Converter",
        },
        timeout: 180000,
        maxRedirects: 5,
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          return NextResponse.json(
            { error: "ConvertAPI key tidak valid" },
            { status: 401 }
          );
        } else if (error.response?.status === 402) {
          return NextResponse.json(
            {
              error:
                "Quota ConvertAPI habis. Upgrade plan atau tunggu bulan depan.",
            },
            { status: 402 }
          );
        } else if (error.response?.status === 422) {
          return NextResponse.json(
            {
              error: `File ${sourceFormat.toUpperCase()} tidak valid atau corrupt`,
            },
            { status: 422 }
          );
        } else if (error.response?.status === 400) {
          return NextResponse.json(
            {
              error: `Konversi ${sourceFormat.toUpperCase()} ke ${targetFormatLower.toUpperCase()} tidak didukung oleh ConvertAPI`,
            },
            { status: 400 }
          );
        }
      }
      throw error;
    }

    const fileInfo = convertResponse.data?.Files?.[0];
    if (!fileInfo) {
      return NextResponse.json(
        { error: "ConvertAPI tidak mengembalikan file hasil konversi" },
        { status: 500 }
      );
    }

    let convertedBuffer: Buffer;

    if (fileInfo.FileData) {
      convertedBuffer = Buffer.from(fileInfo.FileData, "base64");
    } else if (fileInfo.Url) {
      const downloadResponse = await axios.get<ArrayBuffer>(fileInfo.Url, {
        responseType: "arraybuffer",
        timeout: 60000,
        headers: { "User-Agent": "Universal File Converter" },
      });
      if (downloadResponse.status !== 200) {
        return NextResponse.json(
          { error: `Download gagal dengan status: ${downloadResponse.status}` },
          { status: 500 }
        );
      }
      convertedBuffer = Buffer.from(downloadResponse.data);
    } else {
      return NextResponse.json(
        { error: "ConvertAPI response tidak mengandung FileData atau Url" },
        { status: 500 }
      );
    }

    if (convertedBuffer.length === 0) {
      return NextResponse.json(
        { error: "File hasil konversi kosong" },
        { status: 500 }
      );
    }

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const outputFileName = `${baseName}.${targetFormatLower}`;
    const contentType =
      MIME_TYPES[targetFormatLower] || "application/octet-stream";
    const uint8Array = new Uint8Array(convertedBuffer);

    return new Response(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${outputFileName}"`,
        "Content-Length": convertedBuffer.length.toString(),
        "X-Conversion-Time": convertResponse.data?.ConversionTime || "unknown",
        "X-Original-Format": sourceFormat.toUpperCase(),
        "X-Target-Format": targetFormatLower.toUpperCase(),
        "X-Original-Size": file.size.toString(),
        "X-Converted-Size": convertedBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    let errorMessage = "Unknown conversion error";
    let statusCode = 500;

    if (isConversionError(error)) {
      errorMessage = "Conversion failed: " + error.message;
      if (error.response?.status === 401) {
        errorMessage = "ConvertAPI key tidak valid";
        statusCode = 401;
      } else if (error.response?.status === 402) {
        errorMessage = "ConvertAPI quota exceeded";
        statusCode = 402;
      } else if (error.code === "ECONNABORTED") {
        errorMessage =
          "Conversion timeout. File mungkin terlalu besar atau kompleks.";
        statusCode = 408;
      }
    } else if (error instanceof Error) {
      errorMessage = "Conversion failed: " + error.message;
    }

    return NextResponse.json(
      { error: errorMessage, timestamp: new Date().toISOString() },
      { status: statusCode }
    );
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // ignore
      }
    }
  }
}

export async function GET(): Promise<Response> {
  return NextResponse.json({
    message: "Universal File Converter API",
    usage: {
      endpoint: "POST /api/convert",
      parameters: {
        file: "File to convert (multipart/form-data)",
        format: "Target format (e.g., 'docx', 'pdf', 'txt')",
      },
      example:
        "curl -X POST -F 'file=@document.pdf' -F 'format=docx' /api/convert",
    },
    supportedConversions: Object.fromEntries(
      Object.entries(SUPPORTED_CONVERSIONS).map(([key, value]) => [
        key.toUpperCase(),
        value.map((v) => v.toUpperCase()),
      ])
    ),
    limits: {
      maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
      timeout: "3 minutes",
      monthlyQuota: "250 conversions (free tier)",
    },
  });
}
