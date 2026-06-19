import * as repo from "@/lib/server/repositories/profile";
import type { SettingsData, PreferencesData } from "@/lib/domain/settings";

export async function getSettings(userId: string): Promise<SettingsData> {
  const user = await repo.getUserWithPrefs(userId);
  const p = user?.preferences;
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    planName: user?.subscription?.plan?.name ?? "Free",
    preferences: {
      reducedMotion: p?.reducedMotion ?? false,
      notifyLungReminders: p?.notifyLungReminders ?? true,
      notifyFlashSales: p?.notifyFlashSales ?? true,
      notifyAtmosphereExpiry: p?.notifyAtmosphereExpiry ?? true,
      notifyBreathStreaks: p?.notifyBreathStreaks ?? false,
      defaultPattern: (p?.defaultPattern ?? "FOUR_SEVEN_EIGHT") as PreferencesData["defaultPattern"],
      dailyGoal: p?.dailyGoal ?? 3,
    },
  };
}

export async function saveProfile(userId: string, name: string): Promise<void> {
  await repo.updateName(userId, name.trim().slice(0, 80));
}

export async function savePreferences(userId: string, prefs: PreferencesData): Promise<void> {
  await repo.upsertPreferences(userId, {
    ...prefs,
    dailyGoal: Math.min(50, Math.max(1, Math.round(prefs.dailyGoal || 1))),
  });
}
