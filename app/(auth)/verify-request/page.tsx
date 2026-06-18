import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { ResendVerification } from "@/components/auth/resend-verification";

export const metadata: Metadata = { title: "Check your email" };

export default async function VerifyRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="rounded-3xl border border-border bg-surface/80 p-7 text-center shadow-float backdrop-blur sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
        <MailCheck className="h-7 w-7 text-sage-600 dark:text-sage-300" />
      </div>

      <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight">Check your inbox</h1>
      <p className="mt-2 text-sm text-muted">
        {email ? (
          <>
            We sent a verification link to <span className="font-medium text-foreground">{email}</span>. Click it to
            unlock your account.
          </>
        ) : (
          "We sent you a verification link. Click it to unlock your account."
        )}
      </p>

      {email && <ResendVerification email={email} />}

      <p className="mt-6 text-center text-sm text-muted">
        Already verified?{" "}
        <Link href="/login" className="font-medium text-sage-700 hover:underline dark:text-sage-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
