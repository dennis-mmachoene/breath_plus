import * as repo from "@/lib/server/repositories/breathing";
import type { BreathingState, RecordResult, UnlockedAchievement } from "@/lib/domain/breathing";

// Re-export so server callers can keep importing these from the service.
export type { BreathingState, RecordResult, UnlockedAchievement } from "@/lib/domain/breathing";

/** 4-7-8 = 19 seconds per cycle. */
const CYCLE_SEC = 19;

/** Consecutive days ending today (or yesterday) the user has breathed. */
function computeStreak(days: Date[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days.map((d) => d.getTime()));
  const cursor = repo.utcDay();

  // Allow the streak to "hold" if they haven't breathed yet today.
  if (!set.has(cursor.getTime())) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!set.has(cursor.getTime())) return 0;
  }

  let streak = 0;
  while (set.has(cursor.getTime())) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export async function getBreathingState(userId: string): Promise<BreathingState> {
  const user = await repo.getUserWithPlan(userId);
  const plan = user?.subscription?.plan;
  const breathsPerDay = plan?.breathsPerDay ?? null;

  const today = await repo.getDailyStat(userId, repo.utcDay());
  const todayBreaths = today?.breaths ?? 0;
  const remaining = breathsPerDay === null ? null : Math.max(0, breathsPerDay - todayBreaths);

  const [lifetimeBreaths, days] = await Promise.all([
    repo.lifetimeBreaths(userId),
    repo.activeDays(userId),
  ]);

  return {
    plan: { id: plan?.id ?? "FREE", name: plan?.name ?? "Free", breathsPerDay },
    todayBreaths,
    remaining,
    streakDays: computeStreak(days),
    lifetimeBreaths,
    canBreathe: remaining === null || remaining > 0,
  };
}

export async function recordBreath(userId: string): Promise<RecordResult> {
  const pre = await getBreathingState(userId);
  if (!pre.canBreathe) {
    return { ok: false, reason: "limit_reached", state: pre, unlocked: [] };
  }

  await repo.recordBreathTx(userId, repo.utcDay(), CYCLE_SEC);

  const state = await getBreathingState(userId);
  const unlocked = await checkAchievements(userId, state);
  return { ok: true, state, unlocked };
}

async function checkAchievements(userId: string, state: BreathingState): Promise<UnlockedAchievement[]> {
  const [all, have] = await Promise.all([repo.allAchievements(), repo.unlockedAchievementIds(userId)]);
  const newly: UnlockedAchievement[] = [];

  for (const a of all) {
    if (have.has(a.id)) continue;
    const value = a.metric === "streak_days" ? state.streakDays : state.lifetimeBreaths;
    if (value >= a.threshold) {
      await repo.unlockAchievement(userId, a.id);
      newly.push({ id: a.id, name: a.name, description: a.description, icon: a.icon });
    }
  }
  return newly;
}
