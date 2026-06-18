"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, X, Eraser, Wind } from "lucide-react";
import { Markdown } from "@/components/assistant/markdown";
import { BloomMark } from "@/components/marketing/logo";
import type { ChatMessage } from "@/lib/domain/chat";

const SUGGESTIONS = ["Calm me before a meeting", "Teach me 4-7-8", "Help me wind down"];

let tmpId = 0;
const nextTmp = () => `z-${tmpId++}`;

export function FloatingAssistant() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;

    const assistantId = nextTmp();
    const history: ChatMessage[] = [...messages, { id: nextTmp(), role: "USER", content }];
    setMessages([...history, { id: assistantId, role: "ASSISTANT", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
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
    } catch {
      setMessages((m) =>
        m.map((msg) => (msg.id === assistantId ? { ...msg, content: "_(Connection lost. Please try again.)_" } : msg)),
      );
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open Zephyr assistant"}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full shadow-glow"
        style={{ background: "linear-gradient(135deg, #79a971, #284e3c 65%, #236862)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="w" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Wind className="h-6 w-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.21, 0.5, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 flex max-h-[min(70vh,560px)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-float"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <BloomMark className="h-7 w-7" />
                <div>
                  <div className="font-display text-sm font-semibold leading-tight">Zephyr</div>
                  <div className="text-xs text-muted">breathing assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    aria-label="Clear conversation"
                    className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
                  >
                    <Eraser className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center pt-6 text-center">
                  <BloomMark className="h-10 w-10" />
                  <p className="mt-4 text-sm font-medium text-foreground">How can I help you breathe?</p>
                  <p className="mt-1 text-xs text-muted">Calm, technique, sleep, or the philosophy of premium air.</p>
                  <div className="mt-5 flex flex-col gap-2 self-stretch">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-left text-sm shadow-soft transition-colors hover:bg-surface-2"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <Bubble key={m.id} message={m} streaming={streaming} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* composer */}
            <div className="border-t border-border p-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-end gap-2 rounded-2xl border border-border bg-surface p-1.5 focus-within:ring-2 focus-within:ring-ring"
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
                  placeholder="Ask Zephyr…"
                  className="max-h-28 flex-1 resize-none bg-transparent px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  aria-label="Send"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage-800 text-white transition-colors hover:bg-sage-900 disabled:opacity-40"
                >
                  <ArrowUp className="h-[18px] w-[18px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  if (message.role === "USER") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand-soft px-3.5 py-2 text-sm text-foreground">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <BloomMark className="mt-0.5 h-6 w-6 shrink-0" />
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
