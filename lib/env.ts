/**
 * Server environment, validated once. Import this only from server code.
 * auth.config.ts (edge proxy) reads process.env directly and does NOT import
 * this module, to stay edge-safe.
 */
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid Postgres connection string"),
  AUTH_SECRET: z
    .string()
    .min(1, "AUTH_SECRET is required (generate with: npx auth secret)"),
  AUTH_URL: z.string().url().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Email (Nodemailer SMTP) — optional.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Stripe billing — optional. If unset, the billing page shows a notice.
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  ADMIN_EMAILS: z.string().default(""),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid server environment:\n",
    z.flattenError(parsed.error).fieldErrors,
  );
  throw new Error("Invalid server environment — see logs above.");
}

export const env = parsed.data;

export const adminEmails = new Set(
  env.ADMIN_EMAILS.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export const isGoogleEnabled = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET,
);
export const isEmailEnabled = Boolean(env.SMTP_HOST);
export const isBillingEnabled = Boolean(env.STRIPE_SECRET_KEY);
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? env.AUTH_URL ?? "http://localhost:3000";
