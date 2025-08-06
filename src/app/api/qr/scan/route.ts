import { NextResponse } from "next/server";
import jsQR from "jsqr";

export async function POST(req: Request) {
  const { imageData, width, height } = await req.json();

  if (!imageData || !width || !height) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const data = new Uint8ClampedArray(imageData); // asumsikan array byte dikirim dari client
  const code = jsQR(data, width, height);

  if (code) {
    return NextResponse.json({ result: code.data });
  } else {
    return NextResponse.json({ result: "QR tidak terdeteksi" });
  }
}
