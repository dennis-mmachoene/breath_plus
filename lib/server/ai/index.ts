import type { ChatMessage } from "@/lib/domain/chat";
import { streamLocal, LOCAL_MODEL_LABEL } from "@/lib/server/ai/local";
import { streamGemini, geminiModelLabel } from "@/lib/server/ai/gemini";

/**
 * Streams a completion from the configured provider. If a remote provider is
 * selected but fails to start, we fall back to the local engine so the chat
 * never dead-ends. (A mid-stream failure is handled by the route.)
 */
export async function* streamCompletion(messages: ChatMessage[]): AsyncGenerator<string> {
  const provider = process.env.AI_PROVIDER || "local";

  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    try {
      const gen = streamGemini(messages);
      // Probe the first chunk; if it throws, fall back cleanly to local.
      const first = await gen.next();
      if (!first.done) {
        if (first.value) yield first.value;
        for await (const tok of gen) yield tok;
        return;
      }
    } catch {
      // fall through to local
    }
  }

  yield* streamLocal(messages);
}

export function currentModelLabel(): string {
  const provider = process.env.AI_PROVIDER || "local";
  if (provider === "gemini" && process.env.GEMINI_API_KEY) return geminiModelLabel();
  return LOCAL_MODEL_LABEL;
}
