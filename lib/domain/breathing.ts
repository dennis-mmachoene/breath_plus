/** Pure, isomorphic breathing types — safe to import on client or server. */

export interface BreathingState {
  plan: { id: string; name: string; breathsPerDay: number | null };
  todayBreaths: number;
  /** null = unlimited */
  remaining: number | null;
  streakDays: number;
  lifetimeBreaths: number;
  canBreathe: boolean;
}

export interface UnlockedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface RecordResult {
  ok: boolean;
  reason?: "limit_reached";
  state: BreathingState;
  unlocked: UnlockedAchievement[];
}
