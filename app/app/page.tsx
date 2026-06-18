import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Wind, Flame, Sparkles, ArrowRight, Crown } from "lucide-react";
import { auth } from "@/lib/auth";
import { greeting } from "@/lib/utils";
import { getBreathingState } from "@/lib/server/services/breathing-service";
import { Button } from "@/components/ui/button";
import { BreathBloom } from "@/components/visuals/breath-bloom";

export const metadata: Metadata = { title: "Your atmosphere" };

export default async function AppHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const state = await getBreathingState(session.user.id);

  const firstName = session.user.name?.split(" ")[0] ?? "breather";
  const todayValue =
    state.remaining === null ? "Unlimited" : `${state.remaining} left today`;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-sage-600 dark:text-sage-400">
        {greeting()}
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Welcome back, {firstName}.
      </h1>

      {/* Breathe call-to-action */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
        <div className="flex flex-col items-center gap-6 p-7 sm:flex-row sm:p-8">
          <BreathBloom size={120} ambient idleLabel="" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Ready for a breath?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              {state.canBreathe
                ? "A guided 4-7-8 cycle takes about 20 seconds. Your nervous system will thank you."
                : "You've used today's breath. Come back tomorrow, or upgrade for unlimited."}
            </p>
            <Link href="/app/breathe" className="mt-4 inline-block">
              <Button>
                {state.canBreathe ? "Breathe now" : "View breathing"}
                <ArrowRight className="h-[18px] w-[18px]" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<Wind className="h-5 w-5" />}
          label="Today"
          value={todayValue}
        />
        <Stat
          icon={<Flame className="h-5 w-5" />}
          label="Current streak"
          value={`${state.streakDays} day${state.streakDays === 1 ? "" : "s"}`}
        />
        <Stat
          icon={<Sparkles className="h-5 w-5" />}
          label="Lifetime breaths"
          value={`${state.lifetimeBreaths}`}
        />
      </div>

      {/* Plan */}
      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-sage-600 dark:text-sage-300">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">
              Current plan
            </div>
            <div className="font-display text-lg font-semibold">
              {state.plan.name}
            </div>
          </div>
        </div>
        {state.plan.id === "FREE" && (
          <Link href="/#pricing">
            <Button variant="secondary" size="sm">
              Upgrade
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-sage-600 dark:text-sage-300">
        {icon}
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}
