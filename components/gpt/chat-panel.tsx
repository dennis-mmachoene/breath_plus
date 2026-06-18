"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Wind } from "lucide-react";
import { Markdown } from "@/components/gpt/markdown";
import { BloomMark } from "@/components/marketing/logo";
import type { ChatMessage } from "@/lib/domain/chat";

const SUGGESTIONS = [
  "How do I calm down before a meeting?",
  "Teach me the 4-7-8 technique",
  "Is premium oxygen worth it?",
  "Help me wind down for sleep",
];

let tmpId = 0;
const nextTmp = () => `tmp-${tmpId++}`;

export function ChatPanel({
  conversationId,
  initialMessages,
  onCreated,
}: {
  conversationId: string | null;
  initialMessages: ChatMessage[];
  onCreated: (id: string) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;

    const assistantId = nextTmp();
    setMessages((m) => [
      ...m,
      { id: nextTmp(), role: "USER", content },
      { id: assistantId, role: "ASSISTANT", content: "" },
    ]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/breathgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content }),
      });
      const newId = res.headers.get("X-Conversation-Id");

      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc } : msg)));
      }

      if (!conversationId && newId) onCreated(newId);
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId ? { ...msg, content: "_(Connection lost. Please try again.)_" } : msg,
        ),
      );
    } finally {
      setStreaming(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100dvh-4.5rem)] flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
          {empty ? (
            <div className="flex flex-col items-center pt-10 text-center">
              <BloomMark className="h-12 w-12" />
              <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight">BreathGPT</h1>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Your AI breathing coach. Ask about technique, calm, sleep, or the philosophy of premium air.
              </p>
              <div className="mt-7 grid w-full gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-2xl border border-border bg-surface px-4 py-3 text-left text-sm text-foreground shadow-soft transition-colors hover:bg-surface-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((m) => (
                <Bubble key={m.id} message={m} streaming={streaming} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border bg-surface/70 backdrop-blur">
        <div className="mx-auto w-full max-w-2xl px-4 py-3 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 rounded-3xl border border-border bg-surface p-2 shadow-soft focus-within:ring-2 focus-within:ring-ring"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask BreathGPT…"
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-[15px] text-foreground placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              aria-label="Send"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-800 text-white transition-colors hover:bg-sage-900 disabled:opacity-40"
            >
              <ArrowUp className="h-[18px] w-[18px]" />
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-muted">
            BreathGPT gives respiration guidance, not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function Bubble({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const isUser = message.role === "USER";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-brand-soft px-4 py-2.5 text-[15px] text-foreground">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">
        <BloomMark className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        {message.content ? (
          <Markdown content={message.content} />
        ) : streaming ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <Wind className="h-4 w-4 animate-pulse" /> breathing in…
          </span>
        ) : null}
      </div>
    </div>
  );
}
