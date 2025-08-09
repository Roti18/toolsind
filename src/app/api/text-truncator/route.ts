import { NextResponse } from "next/server";
import { truncateText } from "@/utils/textTools";

export async function POST(req: Request) {
  const { text, limit, mode } = await req.json();

  const result = truncateText(text, limit, mode);

  return NextResponse.json({ result });
}
