import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Users, Wind, CreditCard, TrendingUp, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOverview, listRecentUsers } from "@/lib/server/services/admin-service";

export const metadata: Metadata = { title: "Admin" };

const money = (cents: number) => (cents / 100).toLocaleString("en-US", { style: "currency", currency: "usd", minimumFractionDigits: 0 });

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/app");

  const [overview, users] = await Promise.all([getOverview(), listRecentUsers()]);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-sage-600 dark:text-sage-400" />
        <h1 className="font-display text-3xl font-semibold tracking-tight">Admin</h1>
      </div>
      <p className="mt-2 text-muted">Platform health, subscriptions, and recent members.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="Total users" value={`${overview.totalUsers}`} sub={`${overview.verifiedUsers} verified`} />
        <Stat icon={<TrendingUp className="h-5 w-5" />} label="New (7 days)" value={`${overview.recentSignups}`} />
        <Stat icon={<CreditCard className="h-5 w-5" />} label="MRR" value={money(overview.mrrCents)} sub={`${overview.activePaidSubs} paid`} />
        <Stat icon={<Wind className="h-5 w-5" />} label="Breaths" value={`${overview.totalBreaths}`} sub={`${overview.breathsToday} today`} />
      </div>

      {overview.planCounts.length > 0 && (
        <div className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Active subscriptions by plan</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {overview.planCounts.map((p) => (
              <span key={p.planId} className="rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-sm">
                {p.name}: <span className="font-medium">{p.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-semibold">Recent members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Verified</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3">
                    <div className="font-medium text-foreground">{u.name}</div>
                    <div className="text-xs text-muted">{u.email}</div>
                  </td>
                  <td className="px-6 py-3">
                    {u.planName}
                    {u.role === "ADMIN" && <span className="ml-2 rounded bg-brand-soft px-1.5 py-0.5 text-xs text-sage-700 dark:text-sage-300">admin</span>}
                  </td>
                  <td className="px-6 py-3">
                    <StatusPill status={u.status} />
                  </td>
                  <td className="px-6 py-3">{u.verified ? "✓" : "—"}</td>
                  <td className="px-6 py-3 text-muted">
                    {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-sage-700 dark:text-sage-300">{icon}</div>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const ok = status === "ACTIVE" || status === "TRIALING";
  const bad = status === "PAST_DUE" || status === "UNPAID" || status === "CANCELED";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        ok
          ? "bg-brand-soft text-sage-700 dark:text-sage-300"
          : bad
            ? "bg-clay-50 text-clay-700 dark:bg-clay-900/30 dark:text-clay-300"
            : "bg-surface-2 text-muted"
      }`}
    >
      {status.toLowerCase()}
    </span>
  );
}
