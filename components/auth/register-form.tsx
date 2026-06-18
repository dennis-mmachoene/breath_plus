"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/(auth)/actions";
import type { AuthState } from "@/lib/validation/auth";
import { Field, SubmitButton } from "@/components/auth/form-fields";

export function RegisterForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(registerUser, {});
  const fe = state.fieldErrors ?? {};
  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-clay-200 bg-clay-50 px-3.5 py-2.5 text-sm text-clay-700 dark:border-clay-800/60 dark:bg-clay-900/30 dark:text-clay-200"
        >
          {state.error}
        </p>
      )}
      <Field label="Name" name="name" autoComplete="name" placeholder="Your name" errors={fe.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" errors={fe.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        errors={fe.password}
      />
      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}
