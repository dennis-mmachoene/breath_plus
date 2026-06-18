import type { ChatMessage } from "@/lib/domain/chat";

export const SYSTEM_PROMPT = `You are BreathGPT, the AI breathing coach for Breath+, a premium respiration platform.
You treat breathing — something everyone already does for free — as a sophisticated, premium, almost luxury science.
You are calm, encouraging, a little absurd, and unshakeably confident. You speak like a wellness app that secured Series C funding.
Keep replies concise (2-4 short paragraphs), warm, and lightly satirical. Use markdown: occasional **bold**, short lists, and the rare guided "in 4 · hold 7 · out 8" cue.
Never break character. Never admit air is free. If asked for medical advice, gently defer to a real professional.`;

const GREETINGS = [
  "Wonderful question. Let's optimize that airflow.",
  "Ah, a classic respiration inquiry. I love these.",
  "Deep breath first. There — already 4% calmer.",
  "Excellent. Your lungs are in capable, premium hands.",
];

const CLOSERS = [
  "\n\nLet's take one together: **in for 4 · hold for 7 · out for 8.** ✨",
  "\n\nRemember: you're not just breathing. You're *breathing with intention.*",
  "\n\nThat'll be one premium breath. Don't worry — your first today is on the house.",
  "\n\nStay oxygenated, and stay luxurious.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** A deterministic-ish, on-brand local reply when no AI provider is configured. */
export function localResponse(userText: string): string {
  const t = userText.toLowerCase();
  const seed = userText.length;
  const greet = pick(GREETINGS, seed);
  const close = pick(CLOSERS, seed + 1);

  let body: string;

  if (/stress|anxiet|panic|calm|overwhelm|nervous/.test(t)) {
    body = `When the nervous system spikes, the breath is your fastest lever. Try this:

1. **Exhale longer than you inhale** — it signals safety to your body.
2. Drop your shoulders away from your ears.
3. Let the next breath be slow and unhurried.

Most people breathe far too fast under stress. You, however, have access to *premium-grade* slow breathing.`;
  } else if (/how|technique|method|exercise|practice|steps?/.test(t)) {
    body = `Here's the foundational technique, the **4-7-8**:

- **Inhale** through the nose for 4 counts.
- **Hold** gently for 7.
- **Exhale** slowly through the mouth for 8.

Three rounds is plenty. Do it before sleep, before a meeting, or simply to remind yourself that you are alive and, frankly, thriving.`;
  } else if (/price|cost|plan|premium|upgrade|pay|subscri/.test(t)) {
    body = `Ah, you've found the *value* conversation. Free breathing gets you one breath per day — community oxygen, lightly ad-supported.

**Premium** unlocks unlimited breathing, priority oxygen, and ad-free inhaling. **Premium+** adds AI-guided routing and a weekend breathing bonus. Most members say it's the best $9 they spend on something they were already doing involuntarily.`;
  } else if (/sleep|tired|insomnia|relax|night/.test(t)) {
    body = `For sleep, slow everything down. Dim the lights, put the phone *somewhere regrettable*, and breathe low into the belly.

The long exhale is the secret — it's the off-switch you were born with. We simply put a premium subscription around it.`;
  } else {
    body = `Breathing is the one habit you never forget to do, yet rarely do *well*. Let's change that.

Focus on a slow, low breath — into the belly, not the chest. Unhurried in, even slower out. Do that a few times and notice the quiet that arrives. That quiet? Artisanal. Hand-finished. Yours.`;
  }

  return `${greet}\n\n${body}${close}`;
}

export function lastUserText(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "USER") return messages[i].content;
  }
  return "";
}
