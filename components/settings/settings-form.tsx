"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction, updatePreferencesAction } from "@/app/app/settings/actions";
import { PATTERN_LABELS, type SettingsData, type SettingsState, type BreathPattern } from "@/lib/domain/settings";
import { Button } from "@/components/ui/button";

export function SettingsForm({ initial }: { initial: SettingsData }) {
  return (
    <div className="space-y-6">
      <ProfileSection name={initial.name} email={initial.email} />
      <PreferencesSection prefs={initial.preferences} />
    </div>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SaveButton({ savedAt }: { savedAt: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
      {savedAt && !pending && <span className="text-sm text-sage-600 dark:text-sage-400">Saved ✓</span>}
    </div>
  );
}

function ProfileSection({ name, email }: { name: string; email: string }) {
  const [state, action] = useActionState<SettingsState, FormData>(updateProfileAction, {});
  return (
    <Card title="Profile" description="How you appear across Breath+.">
      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium">Display name</label>
          <input
            id="name"
            name="name"
            defaultValue={name}
            className="h-11 w-full max-w-sm rounded-xl border border-border bg-surface px-3.5 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            disabled
            className="h-11 w-full max-w-sm cursor-not-allowed rounded-xl border border-border bg-surface-2 px-3.5 text-[15px] text-muted"
          />
        </div>
        {state.error && <p className="text-sm text-clay-600">{state.error}</p>}
        <SaveButton savedAt={!!state.ok} />
      </form>
    </Card>
  );
}

const TOGGLES: { name: string; label: string; hint: string }[] = [
  { name: "notifyLungReminders", label: "Lung reminders", hint: "Nudges to take your daily breath." },
  { name: "notifyBreathStreaks", label: "Streak alerts", hint: "When your streak is about to lapse." },
  { name: "notifyFlashSales", label: "Flash sales", hint: "Limited-time premium-air offers." },
  { name: "notifyAtmosphereExpiry", label: "Atmosphere expiry", hint: "When your plan is about to renew." },
  { name: "reducedMotion", label: "Reduced motion", hint: "Calm the ambient animations." },
];

function PreferencesSection({ prefs }: { prefs: SettingsData["preferences"] }) {
  const [state, action] = useActionState<SettingsState, FormData>(updatePreferencesAction, {});
  return (
    <Card title="Preferences" description="Tune your breathing and your notifications.">
      <form action={action} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="defaultPattern" className="block text-sm font-medium">Default pattern</label>
            <select
              id="defaultPattern"
              name="defaultPattern"
              defaultValue={prefs.defaultPattern}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(Object.keys(PATTERN_LABELS) as BreathPattern[]).map((p) => (
                <option key={p} value={p}>{PATTERN_LABELS[p]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="dailyGoal" className="block text-sm font-medium">Daily goal (breaths)</label>
            <input
              id="dailyGoal"
              name="dailyGoal"
              type="number"
              min={1}
              max={50}
              defaultValue={prefs.dailyGoal}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="divide-y divide-border rounded-2xl border border-border">
          {TOGGLES.map((t) => (
            <label key={t.name} htmlFor={t.name} className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
              <span>
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="block text-xs text-muted">{t.hint}</span>
              </span>
              <input
                id={t.name}
                name={t.name}
                type="checkbox"
                defaultChecked={prefs[t.name as keyof typeof prefs] as boolean}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-surface-2 transition-colors peer-checked:bg-sage-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          ))}
        </div>

        {state.error && <p className="text-sm text-clay-600">{state.error}</p>}
        <SaveButton savedAt={!!state.ok} />
      </form>
    </Card>
  );
}
