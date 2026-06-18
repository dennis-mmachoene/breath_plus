"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import * as chat from "@/lib/server/services/chat-service";

export async function deleteConversationAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not signed in.");
  await chat.deleteConversation(id, session.user.id);
  revalidatePath("/app/gpt");
}

export async function renameConversationAction(id: string, title: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not signed in.");
  await chat.renameConversation(id, session.user.id, title);
  revalidatePath("/app/gpt");
}
