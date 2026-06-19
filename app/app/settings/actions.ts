"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import * as settings from "@/lib/server/services/settings-service";
import type { BreathPattern, SettingsState } from "@/lib/domain/settings";

export async function updateProfileAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name can't be empty." };

  await settings.saveProfile(session.user.id, name);
  revalidatePath("/app/settings");
  return { ok: true };
}

export async function updatePreferencesAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in." };

  const on = (k: string) => formData.get(k) === "on";
  await settings.savePreferences(session.user.id, {
    reducedMotion: on("reducedMotion"),
    notifyLungReminders: on("notifyLungReminders"),
    notifyFlashSales: on("notifyFlashSales"),
    notifyAtmosphereExpiry: on("notifyAtmosphereExpiry"),
    notifyBreathStreaks: on("notifyBreathStreaks"),
    defaultPattern: (String(formData.get("defaultPattern") ?? "FOUR_SEVEN_EIGHT") as BreathPattern),
    dailyGoal: Number(formData.get("dailyGoal") ?? 3),
  });
  revalidatePath("/app/settings");
  return { ok: true };
}
