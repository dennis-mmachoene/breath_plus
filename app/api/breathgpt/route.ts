import { auth } from "@/lib/auth";
import * as chat from "@/lib/server/services/chat-service";
import { streamCompletion, currentModelLabel } from "@/lib/server/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const userId = session.user.id;

  let body: { conversationId?: string | null; content?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const content = (body.content ?? "").trim();
  if (!content) return new Response("Empty message", { status: 400 });

  // Resolve (or create) the conversation, verifying ownership.
  let conversationId = body.conversationId ?? null;
  if (conversationId) {
    const owned = await chat.getOwnedConversation(conversationId, userId);
    if (!owned) return new Response("Not found", { status: 404 });
  } else {
    const created = await chat.createConversation(userId, content);
    conversationId = created.id;
  }

  await chat.addUserMessage(conversationId, content);
  const history = await chat.history(conversationId);
  const model = currentModelLabel();

  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const token of streamCompletion(history)) {
          full += token;
          controller.enqueue(encoder.encode(token));
        }
      } catch {
        const note = "\n\n_(Our oxygen servers hiccuped mid-thought. Please try again.)_";
        full += note;
        controller.enqueue(encoder.encode(note));
      } finally {
        try {
          await chat.addAssistantMessage(conversationId!, full, model);
        } catch {
          // best-effort persistence
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Conversation-Id": conversationId,
    },
  });
}
