import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const quality = parseInt(formData.get("quality") as string);
  const maxWidth = parseInt(formData.get("maxWidth") as string);

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const compressedBuffer = await sharp(buffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality })
      .toBuffer();

    return new NextResponse(compressedBuffer as BodyInit, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": "inline; filename=compressed.jpg",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Compression failed", detail: err },
      { status: 500 }
    );
  }
}
