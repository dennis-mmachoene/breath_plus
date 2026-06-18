"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BreathPhase = "idle" | "inhale" | "hold" | "exhale";

const PHASES: {
  phase: Exclude<BreathPhase, "idle">;
  seconds: number;
  scale: number;
  label: string;
}[] = [
  { phase: "inhale", seconds: 4, scale: 1.16, label: "Breathe in" },
  { phase: "hold", seconds: 7, scale: 1.16, label: "Hold" },
  { phase: "exhale", seconds: 8, scale: 0.85, label: "Breathe out" },
];

// Organic shapes the bloom morphs through, so it never reads as a hard circle.
const MORPH = [
  "42% 58% 60% 40% / 55% 45% 55% 45%",
  "60% 40% 50% 50% / 45% 55% 40% 60%",
  "45% 55% 42% 58% / 58% 42% 60% 40%",
  "42% 58% 60% 40% / 55% 45% 55% 45%",
];

interface BreathBloomProps {
  size?: number;
  /** Run one guided 4-7-8 cycle, then call onComplete. */
  running?: boolean;
  /** Gentle continuous bloom when idle (hero / decorative). */
  ambient?: boolean;
  onPhaseChange?: (phase: BreathPhase) => void;
  onComplete?: () => void;
  idleLabel?: string;
  className?: string;
}

export function BreathBloom({
  size = 300,
  running = false,
  ambient = false,
  onPhaseChange,
  onComplete,
  idleLabel = "Tap to breathe",
  className,
}: BreathBloomProps) {
  const reduce = useReducedMotion();
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [count, setCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    if (!running) {
      setPhaseIndex(-1);
      onPhaseChange?.("idle");
      return;
    }
    const run = (idx: number) => {
      if (idx >= PHASES.length) {
        setPhaseIndex(-1);
        onPhaseChange?.("idle");
        onComplete?.();
        return;
      }
      const p = PHASES[idx];
      setPhaseIndex(idx);
      setCount(p.seconds);
      onPhaseChange?.(p.phase);
      let remaining = p.seconds;
      const tick = () => {
        remaining -= 1;
        if (remaining > 0) {
          setCount(remaining);
          timers.current.push(setTimeout(tick, 1000));
        }
      };
      timers.current.push(setTimeout(tick, 1000));
      timers.current.push(setTimeout(() => run(idx + 1), p.seconds * 1000));
    };
    run(0);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const active = phaseIndex >= 0 ? PHASES[phaseIndex] : null;

  const scale = active ? active.scale : ambient && !reduce ? [1, 1.06, 1] : 1;
  const transition = active
    ? { duration: active.seconds, ease: "easeInOut" as const }
    : ambient && !reduce
      ? { duration: 8, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 0.4 };

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      {/* warm halo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 blur-3xl"
        style={{
          background: "var(--color-apricot-300)",
          borderRadius: "50%",
          opacity: 0.4,
        }}
        animate={
          reduce
            ? { opacity: 0.4 }
            : { scale, opacity: active?.phase === "exhale" ? 0.3 : 0.5 }
        }
        transition={transition}
      />
      {/* the bloom */}
      <motion.div
        className={cn(
          "relative grid h-full w-full place-items-center",
          ambient && !active ? "animate-bloom-morph" : "",
        )}
        animate={reduce ? { scale: 1 } : { scale }}
        transition={transition}
        style={{
          borderRadius: MORPH[0],
          background:
            "radial-gradient(120% 120% at 34% 28%, rgba(255,255,255,0.95), #c7e4dd 26%, #79a971 62%, #284e3c 108%)",
          boxShadow:
            "inset 0 0 60px rgba(255,255,255,0.32), 0 30px 80px -30px rgba(40,78,60,0.5)",
        }}
      >
        {/* soft inner light */}
        <div
          aria-hidden
          className="absolute inset-[16%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,253,248,0.5), transparent 60%)",
          }}
        />
        {/* center label */}
        <div className="relative z-10 text-center text-sand-900/90">
          {active ? (
            <>
              <div className="font-display text-lg font-semibold drop-shadow-sm sm:text-xl">
                {active.label}
              </div>
              <div className="font-mono mt-1 text-4xl font-semibold tabular-nums drop-shadow-sm sm:text-5xl">
                {count}
              </div>
            </>
          ) : idleLabel ? (
            <div className="font-display text-sm font-medium text-sand-900/80 drop-shadow-sm">
              {idleLabel}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
