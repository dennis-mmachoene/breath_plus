import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { getWrapped } from "@/lib/server/services/wrapped-service";
import { WrappedView } from "@/components/wrapped/wrapped-view";
import { BreathBloom } from "@/components/visuals/breath-bloom";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Wrapped" };

export default async function WrappedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const stats = await getWrapped(session.user.id);

  if (stats.totalBreaths === 0) {
    return (
      <div className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-md flex-col items-center justify-center px-5 text-center">
        <BreathBloom size={140} ambient idleLabel="" />
        <h1 className="font-display mt-8 text-2xl font-semibold tracking-tight">Nothing to wrap yet</h1>
        <p className="mt-2 text-muted">Take your first breath and your year-in-air recap will start filling in.</p>
        <Link href="/app/breathe" className="mt-6">
          <Button>
            Take a breath
            <ArrowRight className="h-[18px] w-[18px]" />
          </Button>
        </Link>
      </div>
    );
  }

  return <WrappedView stats={stats} />;
}
