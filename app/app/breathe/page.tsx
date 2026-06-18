import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBreathingState } from "@/lib/server/services/breathing-service";
import { BreatheRoom } from "@/components/breathe/breathe-room";

export const metadata: Metadata = { title: "Breathe" };

export default async function BreathePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const state = await getBreathingState(session.user.id);
  return <BreatheRoom initial={state} />;
}
