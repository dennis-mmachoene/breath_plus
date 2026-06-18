import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { consumeEmailVerificationToken } from "@/lib/server/verification";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Verify email" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await consumeEmailVerificationToken(token) : ({ ok: false, reason: "invalid" } as const);

  const ok = result.ok;
  const reason = ok ? undefined : result.reason;

  return (
    <div className="rounded-3xl border border-border bg-surface/80 p-7 text-center shadow-float backdrop-blur sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
        {ok ? (
          <CheckCircle2 className="h-7 w-7 text-sage-600 dark:text-sage-300" />
        ) : (
          <XCircle className="h-7 w-7 text-clay-500" />
        )}
      </div>

      <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight">
        {ok ? "Email verified" : reason === "expired" ? "Link expired" : "Invalid link"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {ok
          ? "Your lungs are cleared for takeoff. You can sign in now."
          : reason === "expired"
            ? "That verification link has expired. Sign in to request a fresh one."
            : "We couldn't verify that link. Try signing in to resend a new one."}
      </p>

      <Link href="/login" className="mt-6 block">
        <Button className="w-full">{ok ? "Sign in" : "Back to sign in"}</Button>
      </Link>
    </div>
  );
}
