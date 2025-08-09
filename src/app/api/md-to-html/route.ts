// src/app/api/md-to-html/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { markdownToHtml } from "@/utils/markdownToHtml";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let markdown = "";

    // Accept JSON { markdown: string }
    if (contentType.includes("application/json")) {
      const body = await req.json();
      markdown = typeof body.markdown === "string" ? body.markdown : "";
    } else if (contentType.includes("text/plain")) {
      // Accept raw text body
      markdown = await req.text();
    } else {
      // fallback: try to parse json-like body
      try {
        const maybe = await req.json();
        markdown = typeof maybe.markdown === "string" ? maybe.markdown : "";
      } catch {
        markdown = "";
      }
    }

    if (!markdown) {
      return NextResponse.json(
        { error: "Missing markdown content" },
        { status: 400 }
      );
    }

    const html = await markdownToHtml(markdown);

    // always return JSON so client can safely call res.json()
    return NextResponse.json({ html });
  } catch (err) {
    console.error("md-to-html api error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
