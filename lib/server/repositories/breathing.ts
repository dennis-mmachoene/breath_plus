import { db } from "@/lib/server/db";

/** Calendar day in UTC (midnight). DailyStat.date is a @db.Date. */
export function utcDay(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function getUserWithPlan(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: { subscription: { include: { plan: true } } },
  });
}

export function getDailyStat(userId: string, date: Date) {
  return db.dailyStat.findUnique({ where: { userId_date: { userId, date } } });
}

/** One completed breath: a session row + today's rollup, in a transaction. */
export function recordBreathTx(userId: string, date: Date, durationSec: number) {
  return db.$transaction(async (tx) => {
    await tx.breathingSession.create({
      data: { userId, pattern: "FOUR_SEVEN_EIGHT", cycles: 1, durationSec, completed: true, endedAt: new Date() },
    });
    return tx.dailyStat.upsert({
      where: { userId_date: { userId, date } },
      create: { userId, date, breaths: 1, cycles: 1, durationSec },
      update: { breaths: { increment: 1 }, cycles: { increment: 1 }, durationSec: { increment: durationSec } },
    });
  });
}

export async function lifetimeBreaths(userId: string): Promise<number> {
  const agg = await db.dailyStat.aggregate({ where: { userId }, _sum: { breaths: true } });
  return agg._sum.breaths ?? 0;
}

/** Distinct UTC days (desc) the user breathed, within the window — for streaks. */
export async function activeDays(userId: string, windowDays = 120): Promise<Date[]> {
  const since = utcDay();
  since.setUTCDate(since.getUTCDate() - windowDays);
  const rows = await db.dailyStat.findMany({
    where: { userId, breaths: { gt: 0 }, date: { gte: since } },
    select: { date: true },
    orderBy: { date: "desc" },
  });
  return rows.map((r) => r.date);
}

export function allAchievements() {
  return db.achievement.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function unlockedAchievementIds(userId: string): Promise<Set<string>> {
  const rows = await db.userAchievement.findMany({ where: { userId }, select: { achievementId: true } });
  return new Set(rows.map((r) => r.achievementId));
}

export async function unlockAchievement(userId: string, achievementId: string) {
  // Ignore duplicates (unique constraint) — unlocking is idempotent.
  return db.userAchievement.create({ data: { userId, achievementId } }).catch(() => null);
}
