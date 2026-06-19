import { db } from "@/lib/server/db";

export async function totals(userId: string) {
  const agg = await db.dailyStat.aggregate({
    where: { userId },
    _sum: { breaths: true, cycles: true, durationSec: true },
    _count: { _all: true },
  });
  return {
    breaths: agg._sum.breaths ?? 0,
    cycles: agg._sum.cycles ?? 0,
    durationSec: agg._sum.durationSec ?? 0,
    activeDays: agg._count._all ?? 0,
  };
}

export async function activeDayDates(userId: string): Promise<Date[]> {
  const rows = await db.dailyStat.findMany({
    where: { userId, breaths: { gt: 0 } },
    select: { date: true },
    orderBy: { date: "asc" },
  });
  return rows.map((r) => r.date);
}

export async function sessionStartTimes(userId: string): Promise<Date[]> {
  const rows = await db.breathingSession.findMany({
    where: { userId },
    select: { startedAt: true },
    take: 2000,
  });
  return rows.map((r) => r.startedAt);
}

export async function unlockedAchievements(userId: string) {
  const rows = await db.userAchievement.findMany({
    where: { userId },
    include: { achievement: { select: { name: true, icon: true } } },
    orderBy: { unlockedAt: "asc" },
  });
  return rows.map((r) => ({ name: r.achievement.name, icon: r.achievement.icon }));
}

export async function memberSince(userId: string): Promise<Date | null> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { createdAt: true } });
  return user?.createdAt ?? null;
}
