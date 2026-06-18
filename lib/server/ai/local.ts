import type { ChatMessage } from "@/lib/domain/chat";
import { localResponse, lastUserText } from "@/lib/server/ai/persona";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Streams an on-brand local reply token-by-token so it feels alive. */
export async function* streamLocal(messages: ChatMessage[]): AsyncGenerator<string> {
  const text = localResponse(lastUserText(messages));
  // Stream in small chunks (word + whitespace) with a gentle, breath-like pace.
  const tokens = text.match(/\s+|\S+/g) ?? [text];
  for (const tok of tokens) {
    yield tok;
    await sleep(tok.trim().length > 0 ? 18 : 6);
  }
}

export const LOCAL_MODEL_LABEL = "local:breathgpt";
