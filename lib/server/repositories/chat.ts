import { db } from "@/lib/server/db";
import type { MessageRole } from "@prisma/client";

export function listConversations(userId: string) {
  return db.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });
}

export function getConversation(id: string, userId: string) {
  return db.conversation.findFirst({ where: { id, userId } });
}

export function getMessages(conversationId: string) {
  return db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true },
  });
}

export function createConversation(userId: string, title: string) {
  return db.conversation.create({ data: { userId, title } });
}

export function deleteConversation(id: string, userId: string) {
  return db.conversation.deleteMany({ where: { id, userId } });
}

export function renameConversation(id: string, userId: string, title: string) {
  return db.conversation.updateMany({ where: { id, userId }, data: { title } });
}

export function addMessage(conversationId: string, role: MessageRole, content: string, model?: string) {
  return db.message.create({ data: { conversationId, role, content, model } });
}

export function touchConversation(id: string) {
  return db.conversation.update({ where: { id }, data: { updatedAt: new Date() } });
}
