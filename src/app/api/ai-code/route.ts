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
          if (chunk?.data) {
            controller.enqueue(encoder.encode(chunk.data));
          }
        }

        if (controller.desiredSize !== null) {
          controller.close();
        }
      } catch (err) {
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
