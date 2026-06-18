import * as repo from "@/lib/server/repositories/chat";
import type { ChatMessage, ConversationSummary } from "@/lib/domain/chat";

function titleFrom(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return "New breath session";
  const short = clean.length > 48 ? clean.slice(0, 46) + "…" : clean;
  return short;
}

export async function listConversations(userId: string): Promise<ConversationSummary[]> {
  const rows = await repo.listConversations(userId);
  return rows.map((r) => ({ id: r.id, title: r.title, updatedAt: r.updatedAt.toISOString() }));
}

export function getOwnedConversation(id: string, userId: string) {
  return repo.getConversation(id, userId);
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const rows = await repo.getMessages(conversationId);
  return rows.map((r) => ({ id: r.id, role: r.role, content: r.content }));
}

export function createConversation(userId: string, firstMessage?: string) {
  return repo.createConversation(userId, firstMessage ? titleFrom(firstMessage) : "New breath session");
}

export function deleteConversation(id: string, userId: string) {
  return repo.deleteConversation(id, userId);
}

export function renameConversation(id: string, userId: string, title: string) {
  return repo.renameConversation(id, userId, title.trim().slice(0, 80) || "Untitled");
}

export async function addUserMessage(conversationId: string, content: string) {
  await repo.addMessage(conversationId, "USER", content);
  await repo.touchConversation(conversationId);
}

export async function addAssistantMessage(conversationId: string, content: string, model: string) {
  await repo.addMessage(conversationId, "ASSISTANT", content, model);
  await repo.touchConversation(conversationId);
}

export function history(conversationId: string): Promise<ChatMessage[]> {
  return getMessages(conversationId);
}
