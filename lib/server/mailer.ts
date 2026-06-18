import nodemailer from "nodemailer";
import { env, siteUrl, isEmailEnabled } from "@/lib/env";
import { verificationEmail } from "@/lib/server/email/templates";

function getTransport() {
  if (!isEmailEnabled) return null;
  const port = Number(env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: env.SMTP_USER
      ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
      : undefined,
  });
}

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${siteUrl}/verify?token=${token}`;
  const transport = getTransport();

  // No SMTP configured → print the link so you can still test.
  if (!transport) {
    console.log(`\n📧  [dev] Verify ${email}\n    ${url}\n`);
    return;
  }

  // Gmail rejects a "from" that isn't the authenticated account.
  const from = env.EMAIL_FROM || env.SMTP_USER;
  const mail = verificationEmail(url);

  try {
    const info = await transport.sendMail({
      from,
      to: email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    console.log(`📧  Sent verification to ${email} (id: ${info.messageId})`);
  } catch (err) {
    // Never block registration on email. Log the cause + print the link.
    console.error(
      `❌  Email send FAILED for ${email}:`,
      (err as Error).message,
    );
    console.log(`\n📧  [fallback] Verify ${email}\n    ${url}\n`);
  }
}
