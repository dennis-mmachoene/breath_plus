import { renderEmailHtml, renderEmailText, type EmailContent } from "@/lib/server/email/render";

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

function build(subject: string, content: EmailContent): BuiltEmail {
  return { subject, html: renderEmailHtml(content), text: renderEmailText(content) };
}

export function verificationEmail(url: string, name?: string): BuiltEmail {
  return build("Confirm your Breath+ email", {
    preheader: "One click to activate your account and start breathing.",
    heading: name ? `Welcome, ${name}.` : "Welcome to Breath+.",
    intro: "You're one breath away. Confirm your email address to activate your account.",
    button: { label: "Verify email", url },
    fallbackUrl: url,
    footnote: "This link expires in 24 hours. If you didn't create a Breath+ account, you can safely ignore this email.",
  });
}

// Ready for when those flows land — same layout, one call each.

export function passwordResetEmail(url: string): BuiltEmail {
  return build("Reset your Breath+ password", {
    preheader: "Reset the password for your Breath+ account.",
    heading: "Reset your password",
    intro: "We received a request to reset your password. Click below to choose a new one.",
    button: { label: "Reset password", url },
    fallbackUrl: url,
    footnote: "This link expires in 1 hour. If you didn't request this, ignore this email and your password stays the same.",
  });
}

export function welcomeEmail(appUrl: string, name?: string): BuiltEmail {
  return build("Welcome to Breath+", {
    preheader: "Your atmosphere is ready.",
    heading: name ? `You're in, ${name}.` : "You're in.",
    intro: "Your account is verified and your atmosphere is ready. Take your first guided breath whenever you like.",
    paragraphs: ["Your free plan includes one breath per day. Upgrade any time for unlimited respiration."],
    button: { label: "Open Breath+", url: appUrl },
  });
}
