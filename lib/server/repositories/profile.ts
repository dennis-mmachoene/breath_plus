import { db } from "@/lib/server/db";
import type { BreathPattern } from "@prisma/client";

export function getUserWithPrefs(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: { preferences: true, subscription: { include: { plan: true } } },
  });
}

export function updateName(userId: string, name: string) {
  return db.user.update({ where: { id: userId }, data: { name } });
}

export function upsertPreferences(
  userId: string,
  data: {
    reducedMotion: boolean;
    notifyLungReminders: boolean;
    notifyFlashSales: boolean;
    notifyAtmosphereExpiry: boolean;
    notifyBreathStreaks: boolean;
    defaultPattern: BreathPattern;
    dailyGoal: number;
  },
) {
  return db.userPreferences.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}
