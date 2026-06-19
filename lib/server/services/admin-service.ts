import * as repo from "@/lib/server/repositories/admin";
import type { AdminOverview, AdminUserRow } from "@/lib/domain/admin";

const PLAN_NAMES: Record<string, string> = {
  FREE: "Free",
  PREMIUM: "Premium",
  PREMIUM_PLUS: "Premium+",
  CEO_ELITE: "CEO Elite",
};

export async function getOverview(): Promise<AdminOverview> {
  const [c, b, groups, paid] = await Promise.all([
    repo.counts(),
    repo.breaths(),
    repo.planGroups(),
    repo.activePaidSubs(),
  ]);

  const mrrCents = paid.reduce((sum, s) => sum + (s.plan?.priceCents ?? 0), 0);

  const planCounts = groups
    .map((g) => ({ planId: g.planId as string, name: PLAN_NAMES[g.planId] ?? g.planId, count: g._count._all }))
    .sort((a, b) => b.count - a.count);

  return {
    totalUsers: c.totalUsers,
    verifiedUsers: c.verifiedUsers,
    recentSignups: c.recentSignups,
    totalBreaths: b.total,
    breathsToday: b.today,
    activePaidSubs: paid.length,
    mrrCents,
    planCounts,
  };
}

export async function listRecentUsers(): Promise<AdminUserRow[]> {
  const rows = await repo.recentUsers();
  return rows.map((u) => ({
    id: u.id,
    name: u.name ?? "—",
    email: u.email ?? "—",
    role: u.role,
    verified: !!u.emailVerified,
    planName: u.subscription?.plan?.name ?? "Free",
    status: u.subscription?.status ?? "—",
    createdAt: u.createdAt.toISOString(),
  }));
}
