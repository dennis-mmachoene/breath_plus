import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Crown } from "lucide-react";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/server/services/settings-service";
import { SettingsForm } from "@/components/settings/settings-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getSettings(session.user.id);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-2 text-muted">Manage your profile, preferences, and plan.</p>

      <div className="mt-8">
        <SettingsForm initial={data} />
      </div>

      <section className="mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-sage-700 dark:text-sage-300">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">Plan</div>
            <div className="font-display text-lg font-semibold">{data.planName}</div>
          </div>
        </div>
        <Link href="/app/billing">
          <Button variant="secondary">Manage plan</Button>
        </Link>
      </section>
    </div>
  );
}
