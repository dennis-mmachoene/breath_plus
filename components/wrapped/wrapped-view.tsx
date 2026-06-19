"use client";

import { motion } from "framer-motion";
import { Wind, Clock, Flame, CalendarDays, Trophy, Sparkles, Sunrise } from "lucide-react";
import { BreathBloom } from "@/components/visuals/breath-bloom";
import type { WrappedStats } from "@/lib/domain/wrapped";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: [0.21, 0.5, 0.3, 1], duration: 0.5 } },
};

export function WrappedView({ stats }: { stats: WrappedStats }) {
  const since = stats.memberSince
    ? new Date(stats.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div variants={item} className="flex flex-col items-center text-center">
          <BreathBloom size={120} ambient idleLabel="" />
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-sage-600 dark:text-sage-400">
            Your Breathing, Wrapped
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {stats.totalBreaths.toLocaleString()} breaths
          </h1>
          <p className="mt-3 max-w-md text-muted">
            {since ? `Since ${since}, ` : ""}you&apos;ve turned the involuntary into a practice. Here&apos;s your year in air.
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-10 grid gap-4 sm:grid-cols-2">
          <Big icon={<Clock className="h-5 w-5" />} value={`${stats.totalMinutes} min`} label="Time spent breathing on purpose" />
          <Big icon={<Flame className="h-5 w-5" />} value={`${stats.longestStreak} days`} label="Longest streak" />
          <Big icon={<CalendarDays className="h-5 w-5" />} value={`${stats.activeDays}`} label="Active days" />
          <Big icon={<Wind className="h-5 w-5" />} value={`${stats.currentStreak} days`} label="Current streak" />
        </motion.div>

        {(stats.peakHourLabel || stats.peakDayLabel) && (
          <motion.div variants={item} className="mt-4 grid gap-4 sm:grid-cols-2">
            {stats.peakDayLabel && <Small icon={<CalendarDays className="h-4 w-4" />} label="Favorite day" value={stats.peakDayLabel} />}
            {stats.peakHourLabel && <Small icon={<Sunrise className="h-4 w-4" />} label="Peak breathing hour" value={stats.peakHourLabel} />}
          </motion.div>
        )}

        <motion.div variants={item} className="mt-4 overflow-hidden rounded-3xl border border-border bg-brand-soft p-7 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-sage-700 dark:text-sage-300" />
          <p className="mt-3 font-display text-3xl font-semibold">
            ${stats.premiumAirValue.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-muted">
            The premium value of the air you inhaled. (It remains, of course, free.)
          </p>
        </motion.div>

        {stats.achievements.length > 0 && (
          <motion.div variants={item} className="mt-4 rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-apricot-500" />
              <h2 className="font-display text-lg font-semibold">{stats.achievementsUnlocked} achievements unlocked</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {stats.achievements.map((a) => (
                <span key={a.name} className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm">
                  {a.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function Big({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-sage-700 dark:text-sage-300">
        {icon}
      </div>
      <div className="mt-4 font-display text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

function Small({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-soft">
      <span className="text-sage-600 dark:text-sage-400">{icon}</span>
      <span className="text-sm">
        <span className="text-muted">{label}: </span>
        <span className="font-medium text-foreground">{value}</span>
      </span>
    </div>
  );
}
