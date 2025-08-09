import { NextResponse } from "next/server";
import { generateFakeData } from "@/utils/fakeDataGenerators";

export async function POST(req: Request) {
  try {
    const { type, count } = await req.json();

    if (!type || !count) {
      return NextResponse.json(
        { error: "Missing 'type' or 'count' field" },
        { status: 400 }
      );
    }

    const data = generateFakeData(type, count);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
