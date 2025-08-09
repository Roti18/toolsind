export async function POST(req: Request) {
  const { prompt } = await req.json();
  const { default: Replicate } = await import("replicate");

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let finalOutput = "";
      let continuePrompt = prompt;
      let loopCount = 0;

      try {
        while (loopCount < 5) {
          const replicateStream = await replicate.stream(
            "ibm-granite/granite-3.3-8b-instruct",
            {
              input: { prompt: continuePrompt },
            }
          );

          let partialOutput = "";
          for await (const chunk of replicateStream) {
            if (chunk?.data) {
              partialOutput += chunk.data;
              controller.enqueue(encoder.encode(chunk.data));
            }
          }

          finalOutput += partialOutput;
          console.log(finalOutput);

          if (
            partialOutput.trim().endsWith(".") ||
            partialOutput.trim().endsWith("```")
          ) {
            break;
          }

          continuePrompt = `Continue from where you left off:\n${partialOutput}`;
          loopCount++;
        }

        controller.close();
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
