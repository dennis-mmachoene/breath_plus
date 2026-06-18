import { auth } from "@/lib/auth";
import { streamCompletion } from "@/lib/server/ai";
import type { ChatMessage } from "@/lib/domain/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stateless: takes the in-session message history from the client and streams a
 * reply. Nothing is persisted — Zephyr is session-only by design.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  // Keep only valid turns and cap context to the last 20.
  const messages: ChatMessage[] = raw
    .filter((m) => (m?.role === "USER" || m?.role === "ASSISTANT") && typeof m.content === "string")
    .slice(-20);

  if (messages.length === 0) return new Response("Empty", { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const token of streamCompletion(messages)) {
          controller.enqueue(encoder.encode(token));
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n_(Our oxygen servers hiccuped. Please try again.)_"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
  });
}
