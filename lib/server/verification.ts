import { randomBytes } from "node:crypto";
import { db } from "@/lib/server/db";

const EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours

/** Create (and replace any existing) email-verification token for an email. */
export async function createEmailVerificationToken(email: string): Promise<string> {
  const identifier = email.toLowerCase();
  await db.verificationToken.deleteMany({ where: { identifier, purpose: "EMAIL_VERIFY" } });

  const token = randomBytes(32).toString("hex");
  await db.verificationToken.create({
    data: {
      identifier,
      token,
      purpose: "EMAIL_VERIFY",
      expires: new Date(Date.now() + EXPIRY_MS),
    },
  });
  return token;
}

type ConsumeResult = { ok: true; email: string } | { ok: false; reason: "invalid" | "expired" };

/** Validate a token, mark the user verified, and burn the token. */
export async function consumeEmailVerificationToken(token: string): Promise<ConsumeResult> {
  const row = await db.verificationToken.findUnique({ where: { token } });
  if (!row || row.purpose !== "EMAIL_VERIFY") return { ok: false, reason: "invalid" };

  if (row.expires < new Date()) {
    await db.verificationToken.delete({ where: { token } }).catch(() => {});
    return { ok: false, reason: "expired" };
  }

  await db.user.update({ where: { email: row.identifier }, data: { emailVerified: new Date() } });
  await db.verificationToken.delete({ where: { token } }).catch(() => {});
  return { ok: true, email: row.identifier };
}
