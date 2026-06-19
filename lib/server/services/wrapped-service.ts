import * as repo from "@/lib/server/repositories/wrapped";
import type { WrappedStats } from "@/lib/domain/wrapped";

const DAY_MS = 86_400_000;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function longestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = [...new Set(dates.map((d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())))].sort(
    (a, b) => a - b,
  );
  let longest = 1;
  let cur = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (days[i] - days[i - 1]) / DAY_MS;
    if (diff === 1) cur++;
    else if (diff > 1) cur = 1;
    longest = Math.max(longest, cur);
  }
  return longest;
}

function currentStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates.map((d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())));
  const today = new Date();
  let cursor = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (!set.has(cursor)) {
    cursor -= DAY_MS;
    if (!set.has(cursor)) return 0;
  }
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor -= DAY_MS;
  }
  return streak;
}

function peak<T extends string | number>(items: T[]): T | null {
  if (items.length === 0) return null;
  const counts = new Map<T, number>();
  for (const it of items) counts.set(it, (counts.get(it) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function hourLabel(h: number): string {
  const am = h < 12;
  const base = h % 12 === 0 ? 12 : h % 12;
  return `${base} ${am ? "AM" : "PM"}`;
}

export async function getWrapped(userId: string): Promise<WrappedStats> {
  const [t, dates, starts, achievements, since] = await Promise.all([
    repo.totals(userId),
    repo.activeDayDates(userId),
    repo.sessionStartTimes(userId),
    repo.unlockedAchievements(userId),
    repo.memberSince(userId),
  ]);

  const peakHour = peak(starts.map((d) => d.getHours()));
  const peakDay = peak(starts.map((d) => d.getDay()));

  return {
    totalBreaths: t.breaths,
    totalMinutes: Math.round(t.durationSec / 60),
    totalCycles: t.cycles,
    activeDays: t.activeDays,
    longestStreak: longestStreak(dates),
    currentStreak: currentStreak(dates),
    memberSince: since ? since.toISOString() : null,
    peakHourLabel: peakHour === null ? null : hourLabel(peakHour),
    peakDayLabel: peakDay === null ? null : DAYS[peakDay],
    achievementsUnlocked: achievements.length,
    achievements,
    premiumAirValue: Math.round(t.breaths * 0.3 * 100) / 100, // $0.30/breath, satirically
  };
}
