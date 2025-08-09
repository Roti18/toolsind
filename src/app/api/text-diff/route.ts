import { NextResponse } from "next/server";
import { getTextDiff } from "@/utils/textDiff";

export async function POST(req: Request) {
  try {
    const { oldText, newText } = await req.json();

    if (!oldText || !newText) {
      return NextResponse.json(
        { error: "Both texts are required" },
        { status: 400 }
      );
    }

    const diffResult = getTextDiff(oldText, newText);
    return NextResponse.json({ diff: diffResult });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}
