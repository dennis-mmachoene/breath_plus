import { db } from "@/lib/server/db";

function utcToday(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function counts() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000);
  const [totalUsers, verifiedUsers, recentSignups] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { emailVerified: { not: null } } }),
    db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);
  return { totalUsers, verifiedUsers, recentSignups };
}

export async function breaths() {
  const [all, today] = await Promise.all([
    db.dailyStat.aggregate({ _sum: { breaths: true } }),
    db.dailyStat.aggregate({ where: { date: utcToday() }, _sum: { breaths: true } }),
  ]);
  return { total: all._sum.breaths ?? 0, today: today._sum.breaths ?? 0 };
}

export function planGroups() {
  return db.subscription.groupBy({
    by: ["planId"],
    where: { status: "ACTIVE" },
    _count: { _all: true },
  });
}

export function activePaidSubs() {
  return db.subscription.findMany({
    where: { status: "ACTIVE", planId: { not: "FREE" } },
    include: { plan: { select: { priceCents: true } } },
  });
}

export function recentUsers(take = 25) {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { subscription: { include: { plan: { select: { name: true } } } } },
  });
}
