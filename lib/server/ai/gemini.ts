import type { ChatMessage } from "@/lib/domain/chat";
import { SYSTEM_PROMPT } from "@/lib/server/ai/persona";

/**
 * Streams from Google Gemini via the streamGenerateContent SSE endpoint.
 * Throws on a non-OK response so the caller can fall back to the local engine.
 */
export async function* streamGemini(messages: ChatMessage[]): AsyncGenerator<string> {
  const key = process.env.GEMINI_API_KEY!;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`;

  const contents = messages
    .filter((m) => m.role === "USER" || m.role === "ASSISTANT")
    .map((m) => ({ role: m.role === "USER" ? "user" : "model", parts: [{ text: m.content }] }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.9, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Gemini error ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE lines: "data: { ... }"
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const json = trimmed.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const parsed = JSON.parse(json);
        const text = parsed?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
        if (text) yield text;
      } catch {
        // ignore partial/invalid JSON chunks
      }
    }
  }
}

export const geminiModelLabel = () => `gemini:${process.env.GEMINI_MODEL || "gemini-2.0-flash"}`;
