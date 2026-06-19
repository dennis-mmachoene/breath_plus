export type BreathPattern = "FOUR_SEVEN_EIGHT" | "BOX" | "COHERENT" | "ENERGIZING";

export interface PreferencesData {
  reducedMotion: boolean;
  notifyLungReminders: boolean;
  notifyFlashSales: boolean;
  notifyAtmosphereExpiry: boolean;
  notifyBreathStreaks: boolean;
  defaultPattern: BreathPattern;
  dailyGoal: number;
}

export interface SettingsData {
  name: string;
  email: string;
  planName: string;
  preferences: PreferencesData;
}

export const PATTERN_LABELS: Record<BreathPattern, string> = {
  FOUR_SEVEN_EIGHT: "4-7-8 (calming)",
  BOX: "Box (4-4-4-4)",
  COHERENT: "Coherent (5-5)",
  ENERGIZING: "Energizing",
};

export type SettingsState = { ok?: boolean; error?: string };
