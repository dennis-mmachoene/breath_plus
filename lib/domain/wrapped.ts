export interface WrappedStats {
  totalBreaths: number;
  totalMinutes: number;
  totalCycles: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  memberSince: string | null; // ISO
  peakHourLabel: string | null;
  peakDayLabel: string | null;
  achievementsUnlocked: number;
  achievements: { name: string; icon: string }[];
  /** Satirical: what this air "would" have cost at premium rates. */
  premiumAirValue: number;
}
