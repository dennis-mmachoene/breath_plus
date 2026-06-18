import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isGoogleEnabled } from "@/lib/env";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleButton } from "@/components/auth/google-button";

export const metadata: Metadata = { title: "Create your account" };

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/app");

  return (
    <div className="rounded-3xl border border-border bg-surface/80 p-7 shadow-float backdrop-blur sm:p-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Start breathing</h1>
      <p className="mt-1.5 text-sm text-muted">
        Create your account. Your first daily breath is on the house.
      </p>

      {isGoogleEnabled && (
        <div className="mt-6">
          <GoogleButton label="Sign up with Google" />
          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-border" />
            or with email
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      <div className={isGoogleEnabled ? "" : "mt-6"}>
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        By creating an account you agree that oxygen remains, regrettably, free elsewhere.
      </p>

      <p className="mt-4 text-center text-sm text-muted">
        Already breathing with us?{" "}
        <Link href="/login" className="font-medium text-sage-700 hover:underline dark:text-sage-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
