// /app/api/ai-code/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { default: Replicate } = await import("replicate");
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const replicateStream = await replicate.stream(
    "ibm-granite/granite-3.3-8b-instruct",
    {
      input: { prompt },
    }
  );

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of replicateStream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        console.error("Stream error:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
