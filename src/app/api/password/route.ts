import { NextResponse } from "next/server";
import { generatePassword } from "@/utils/passwordGenerator";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const length = Number(searchParams.get("length") || 12);
  const upper = searchParams.get("upper") !== "false";
  const numbers = searchParams.get("numbers") !== "false";
  const symbols = searchParams.get("symbols") !== "false";

  const password = generatePassword(length, upper, numbers, symbols);

  return NextResponse.json({ password });
}
