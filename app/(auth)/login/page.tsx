import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isGoogleEnabled } from "@/lib/env";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/google-button";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/app");

  return (
    <div className="rounded-3xl border border-border bg-surface/80 p-7 shadow-float backdrop-blur sm:p-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted">Sign in to resume your respiration.</p>

      {isGoogleEnabled && (
        <div className="mt-6">
          <GoogleButton />
          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-border" />
            or with email
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      <div className={isGoogleEnabled ? "" : "mt-6"}>
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="font-medium text-sage-700 hover:underline dark:text-sage-300">
          Create an account
        </Link>
      </p>
    </div>
  );
}
