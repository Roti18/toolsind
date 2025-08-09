// app/api/json-validator/route.ts
import { NextResponse } from "next/server";
import { validateJSON } from "@/utils/jsonTools";

export async function POST(req: Request) {
  const { jsonString } = await req.json();

  const result = validateJSON(jsonString);
  return NextResponse.json(result);
}
