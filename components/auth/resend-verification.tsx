"use client";

import { useActionState } from "react";
import { resendVerification } from "@/app/(auth)/actions";
import type { AuthState } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";

export function ResendVerification({ email }: { email: string }) {
  const [state, action] = useActionState<AuthState, FormData>(resendVerification, {});
  return (
    <form action={action} className="mt-2">
      <input type="hidden" name="email" value={email} />
      <Button type="submit" variant="secondary" className="w-full" disabled={state.sent}>
        {state.sent ? "Email sent — check your inbox" : "Resend verification email"}
      </Button>
      {state.error && <p className="mt-2 text-xs text-clay-600">{state.error}</p>}
    </form>
  );
}
