/** Pure chat types — safe on client or server. */

export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: string; // ISO
}
