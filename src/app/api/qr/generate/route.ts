import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text) {
    return NextResponse.json(
      { error: "Teks tidak boleh kosong" },
      { status: 400 }
    );
  }

  try {
    const qr = await QRCode.toDataURL(text);
    return NextResponse.json({ qr });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat QR Code" },
      { status: 500 }
    );
  }
}
