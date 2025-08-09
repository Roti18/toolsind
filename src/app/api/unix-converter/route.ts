// app/api/unix-converter/route.ts
import { NextResponse } from "next/server";
import { convertUnixToLocal } from "@/utils/unixTools";

export async function POST(req: Request) {
  const { unix } = await req.json();

  if (typeof unix !== "number" || isNaN(unix)) {
    return NextResponse.json({ error: "Invalid timestamp" }, { status: 400 });
  }

  const localTime = convertUnixToLocal(unix);
  return NextResponse.json({ localTime });
}
