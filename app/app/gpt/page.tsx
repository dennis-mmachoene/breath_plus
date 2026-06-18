import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import * as chat from "@/lib/server/services/chat-service";
import { GptChat } from "@/components/gpt/gpt-chat";

export const metadata: Metadata = { title: "BreathGPT" };

export default async function GptPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const { c } = await searchParams;
  const conversations = await chat.listConversations(userId);

  let activeId: string | null = c ?? null;
  let messages: Awaited<ReturnType<typeof chat.getMessages>> = [];
  if (activeId) {
    const owned = await chat.getOwnedConversation(activeId, userId);
    if (owned) messages = await chat.getMessages(activeId);
    else activeId = null;
  }

  return <GptChat conversations={conversations} activeId={activeId} initialMessages={messages} />;
}
