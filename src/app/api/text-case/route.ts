import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  return NextResponse.json({ original: text });
}
