import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { greeting } from "@/lib/utils";
import { Logo } from "@/components/marketing/logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BreathBloom } from "@/components/visuals/breath-bloom";

export const metadata: Metadata = { title: "Your atmosphere" };

export default async function AppHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: { include: { plan: true } } },
  });
  if (!user) redirect("/login");

  const planName = user.subscription?.plan?.name ?? "Free";
  const firstName = user.name?.split(" ")[0] ?? "breather";

  return (
    <div className="relative min-h-dvh">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo href="/app" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <BreathBloom size={180} ambient idleLabel="" />
          <p className="mt-8 text-sm font-medium uppercase tracking-[0.18em] text-sage-600 dark:text-sage-400">
            {greeting()}
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            You&apos;re breathing, {firstName}.
          </h1>
          <p className="mt-3 max-w-md text-muted">
            Your session is live and your account is saved to the database. The
            breathing experience itself arrives in the next milestone.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
          <Stat label="Signed in as" value={user.email ?? user.name ?? "—"} />
          <Stat label="Current plan" value={planName} accent />
          <Stat
            label="Role"
            value={user.role === "ADMIN" ? "Admin" : "Member"}
          />
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-float">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            What&apos;s wired up
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              • Email / password sign-in and registration, hashed with bcrypt
            </li>
            <li>• Google sign-in (active once OAuth credentials are set)</li>
            <li>
              • JWT sessions verified in middleware — this route is protected
            </li>
            <li>
              • Your user, FREE subscription, and preferences persisted in
              Postgres
            </li>
          </ul>
          <Link
            href="/"
            className="mt-5 inline-block text-sm font-medium text-sage-700 hover:underline dark:text-sage-300"
          >
            ← Back to the landing page
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </div>
      <div
        className={`mt-1 truncate font-display text-lg font-semibold ${accent ? "text-teal-600 dark:text-teal-300" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
