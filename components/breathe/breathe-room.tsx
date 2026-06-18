"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Flame, Sparkles, Infinity as InfinityIcon, Lock, ArrowRight } from "lucide-react";
import { BreathBloom } from "@/components/visuals/breath-bloom";
import { Button } from "@/components/ui/button";
import type { BreathingState, UnlockedAchievement } from "@/lib/domain/breathing";
import { recordBreathAction } from "@/app/app/breathe/actions";

export function BreatheRoom({ initial }: { initial: BreathingState }) {
  const [state, setState] = useState(initial);
  const [running, setRunning] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);
  const [wall, setWall] = useState(!initial.canBreathe);
  const [pending, startTransition] = useTransition();

  function begin() {
    if (running || pending || !state.canBreathe) return;
    setRunning(true);
  }

  function onComplete() {
    setRunning(false);
    startTransition(async () => {
      const result = await recordBreathAction();
      setState(result.state);
      if (result.ok) {
        setUnlocked(result.unlocked);
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), result.unlocked.length ? 4200 : 2200);
      }
      if (!result.state.canBreathe) setTimeout(() => setWall(true), 1900);
    });
  }

  if (wall) return <Wall state={state} />;

  return (
    <div className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-5 py-10">
      <StatBar state={state} />

      <div className="relative mt-10">
        <BreathBloom size={300} running={running} ambient={!running} idleLabel="" onComplete={onComplete} />
        {!running && !pending && (
          <button
            onClick={begin}
            aria-label="Start a guided breath"
            className="absolute inset-0 grid place-items-center rounded-full focus-visible:outline-none"
          >
            <span className="rounded-full bg-surface/85 px-5 py-2.5 text-sm font-medium text-foreground shadow-float backdrop-blur">
              Tap to breathe
            </span>
          </button>
        )}
      </div>

      <p className="mt-12 max-w-xs text-center text-sm leading-relaxed text-muted">
        {running
          ? "Follow the bloom — in for 4, hold for 7, out for 8."
          : pending
            ? "Recording your breath…"
            : "One guided 4-7-8 cycle. Find a comfortable seat and begin when you're ready."}
      </p>

      <AnimatePresence>{celebrate && <Celebration unlocked={unlocked} />}</AnimatePresence>
    </div>
  );
}

function StatBar({ state }: { state: BreathingState }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Pill
        icon={state.remaining === null ? <InfinityIcon className="h-4 w-4" /> : <Wind className="h-4 w-4" />}
        label="Today"
        value={state.remaining === null ? "Unlimited" : `${state.remaining} left`}
      />
      <Pill icon={<Flame className="h-4 w-4" />} label="Streak" value={`${state.streakDays} day${state.streakDays === 1 ? "" : "s"}`} />
      <Pill icon={<Sparkles className="h-4 w-4" />} label="Lifetime" value={`${state.lifetimeBreaths}`} />
    </div>
  );
}

function Pill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 shadow-soft">
      <span className="text-sage-600 dark:text-sage-300">{icon}</span>
      <span className="text-sm">
        <span className="text-muted">{label} · </span>
        <span className="font-medium text-foreground">{value}</span>
      </span>
    </div>
  );
}

function Celebration({ unlocked }: { unlocked: UnlockedAchievement[] }) {
  const dots = Array.from({ length: 14 });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
    >
      <div className="relative">
        {dots.map((_, i) => {
          const angle = (i / dots.length) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(angle) * 160, y: Math.sin(angle) * 160, opacity: 0, scale: 0.4 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute h-2.5 w-2.5 rounded-full"
              style={{ background: i % 2 ? "var(--color-sage-500)" : "var(--color-apricot-400)" }}
            />
          );
        })}
      </div>

      <motion.div
        initial={{ y: 12, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="absolute top-2 rounded-full bg-surface/90 px-5 py-2 text-sm font-medium text-sage-700 shadow-float backdrop-blur dark:text-sage-300"
      >
        Breath recorded
      </motion.div>

      {unlocked.length > 0 && (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-0 flex flex-col items-center gap-2"
        >
          {unlocked.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-float"
            >
              <Sparkles className="h-4 w-4 text-apricot-500" />
              <span className="text-sm">
                <span className="font-medium text-foreground">Unlocked: {a.name}</span>
                <span className="block text-xs text-muted">{a.description}</span>
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function Wall({ state }: { state: BreathingState }) {
  return (
    <div className="flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-float">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
          <Lock className="h-7 w-7 text-sage-700 dark:text-sage-300" />
        </div>
        <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight">That&apos;s today&apos;s breath</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your <span className="font-medium text-foreground">{state.plan.name}</span> plan includes one breath per day.
          You&apos;re on a <span className="font-medium text-foreground">{state.streakDays}-day streak</span> — come back
          tomorrow to keep it alive, or breathe without limits now.
        </p>

        <Link href="/#pricing" className="mt-6 block">
          <Button size="lg" className="w-full">
            Upgrade for unlimited breathing
            <ArrowRight className="h-[18px] w-[18px]" />
          </Button>
        </Link>
        <Link href="/app" className="mt-3 inline-block text-sm font-medium text-sage-700 hover:underline dark:text-sage-300">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
