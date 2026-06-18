import { db } from "@/lib/server/db";
import { adminEmails } from "@/lib/env";

/**
 * Give a freshly-created user their starting state: a FREE subscription, a
 * preferences row, and ADMIN role if their email is allow-listed. Idempotent —
 * safe to call more than once.
 */
export async function ensureUserDefaults(userId: string): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const isAdmin = !!user.email && adminEmails.has(user.email.toLowerCase());

  await db.$transaction([
    db.subscription.upsert({
      where: { userId },
      create: { userId, planId: "FREE", status: "ACTIVE" },
      update: {},
    }),
    db.userPreferences.upsert({
      where: { userId },
      create: { userId },
      update: {},
    }),
    ...(isAdmin && user.role !== "ADMIN"
      ? [db.user.update({ where: { id: userId }, data: { role: "ADMIN" } })]
      : []),
  ]);
}
