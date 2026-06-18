"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/server/db";
import { registerSchema, type AuthState } from "@/lib/validation/auth";
import { ensureUserDefaults } from "@/lib/server/user-service";
import { createEmailVerificationToken } from "@/lib/server/verification";
import { sendVerificationEmail } from "@/lib/server/mailer";

const APP_HOME = "/app";

function verifyRequestUrl(email: string) {
  return `/verify-request?email=${encodeURIComponent(email)}`;
}

export async function registerUser(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error: "An account with that email already exists. Try signing in.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({ data: { name, email, passwordHash } });
  await ensureUserDefaults(user.id);

  // Send verification — do NOT sign them in until verified.
  const token = await createEmailVerificationToken(email);
  await sendVerificationEmail(email, token);

  redirect(verifyRequestUrl(email)); // throws NEXT_REDIRECT
}

export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Unverified accounts are locked → send them to the verify/resend screen.
  const user = await db.user.findUnique({ where: { email } });
  if (user?.passwordHash && !user.emailVerified) {
    redirect(verifyRequestUrl(email)); // throws NEXT_REDIRECT
  }

  try {
    await signIn("credentials", { email, password, redirectTo: APP_HOME });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "That email and password don't match."
            : "Something went wrong signing you in.",
      };
    }
    throw error; // re-throw the redirect
  }
  return {};
}

export async function resendVerification(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return { error: "Missing email address." };

  const user = await db.user.findUnique({ where: { email } });
  // Only send if there's an unverified account, but always report success so we
  // don't reveal whether an email is registered.
  if (user && !user.emailVerified) {
    const token = await createEmailVerificationToken(email);
    await sendVerificationEmail(email, token);
  }
  return { sent: true };
}

export async function signInWithGoogle(): Promise<void> {
  await signIn("google", { redirectTo: APP_HOME });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
