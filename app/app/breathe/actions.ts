"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { recordBreath, type RecordResult } from "@/lib/server/services/breathing-service";

export async function recordBreathAction(): Promise<RecordResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not signed in.");

  const result = await recordBreath(session.user.id);
  revalidatePath("/app");
  revalidatePath("/app/breathe");
  return result;
}
