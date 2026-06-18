import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { AppNav } from "@/components/app/app-nav";
import { FloatingAssistant } from "@/components/assistant/floating-assistant";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sub = await db.subscription.findUnique({
    where: { userId: session.user.id },
    include: { plan: true },
  });

  return (
    <div className="min-h-dvh">
      <AppNav planName={sub?.plan?.name ?? "Free"} />
      <main>{children}</main>
      <FloatingAssistant />
    </div>
  );
}
