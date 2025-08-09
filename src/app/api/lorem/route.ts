import { NextResponse } from "next/server";
import { generateLoremIpsum } from "@/utils/loremTools";

export async function POST(req: Request) {
  const { words } = await req.json();
  const count = Number(words) || 50;
  const text = generateLoremIpsum(count);

  return NextResponse.json({ text });
}
