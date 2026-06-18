"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare, Trash2, PanelLeft } from "lucide-react";
import { ChatPanel } from "@/components/gpt/chat-panel";
import { deleteConversationAction } from "@/app/app/gpt/actions";
import type { ChatMessage, ConversationSummary } from "@/lib/domain/chat";
import { cn } from "@/lib/utils";

export function GptChat({
  conversations,
  activeId,
  initialMessages,
}: {
  conversations: ConversationSummary[];
  activeId: string | null;
  initialMessages: ChatMessage[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function select(id: string) {
    setSidebarOpen(false);
    router.push(`/app/gpt?c=${id}`);
  }
  function newChat() {
    setSidebarOpen(false);
    router.push(`/app/gpt`);
  }
  function created(id: string) {
    router.push(`/app/gpt?c=${id}`);
  }
  function remove(id: string) {
    startTransition(async () => {
      await deleteConversationAction(id);
      if (id === activeId) router.push("/app/gpt");
      else router.refresh();
    });
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-surface transition-transform sm:static sm:z-auto sm:h-[calc(100dvh-4.5rem)] sm:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col p-3">
          <button
            onClick={newChat}
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium shadow-soft transition-colors hover:bg-surface-2"
          >
            <Plus className="h-4 w-4" /> New chat
          </button>

          <div className="mt-3 flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-muted">No conversations yet.</p>
            ) : (
              <ul className="space-y-1">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <div
                      className={cn(
                        "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                        c.id === activeId ? "bg-brand-soft text-sage-800 dark:text-sage-200" : "hover:bg-surface-2",
                      )}
                    >
                      <button onClick={() => select(c.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                        <MessageSquare className="h-4 w-4 shrink-0 text-muted" />
                        <span className="truncate">{c.title}</span>
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        aria-label="Delete conversation"
                        className="opacity-0 transition-opacity hover:text-clay-500 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* backdrop on mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/30 sm:hidden" />}

      {/* Panel */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 sm:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open conversations" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-2">
            <PanelLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">BreathGPT</span>
        </div>
        <ChatPanel key={activeId ?? "new"} conversationId={activeId} initialMessages={initialMessages} onCreated={created} />
      </div>
    </div>
  );
}
