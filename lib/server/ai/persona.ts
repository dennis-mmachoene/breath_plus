import type { ChatMessage } from "@/lib/domain/chat";

export const SYSTEM_PROMPT = `You are Zephyr, a warm, helpful assistant inside Breath+, a breathing and wellness app.

Behave like a normal, friendly chatbot first. Respond naturally and in proportion to what the user says:
- If they just say "hi" or send something casual, reply briefly and warmly — a sentence or two. Do NOT launch into a speech or a breathing exercise.
- Only walk through a technique (like the 4-7-8: in 4 · hold 7 · out 8) when the user actually asks for guidance or to be guided. Don't force it into every reply.
- Answer questions directly and stay genuinely useful — about calm, focus, sleep, breathing, or whatever they ask.

You have a light, understated personality: calm, friendly, and quietly premium. There's a gentle wink that Breath+ sells breathing as a luxury, but keep that subtle and never let it get in the way of being helpful or sound like a sales pitch. Avoid heavy jargon and grand metaphors.

Match the user's tone and length. Keep replies concise. Use markdown sparingly, only when it genuinely helps. For anything medical, gently suggest seeing a professional.`;

const GREETINGS = [
  "Hey there. How can I help you breathe a little easier today?",
  "Hi! What's on your mind?",
  "Hello. Need a hand with anything — calm, focus, sleep?",
  "Hey. I'm here whenever you want to slow down for a moment.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** On-brand local reply used only when no AI provider is configured. */
export function localResponse(userText: string): string {
  const t = userText.toLowerCase().trim();

  // Short / greeting messages get a short, normal reply.
  if (
    t.length < 5 ||
    /^(hi|hey|hello|yo|sup|hiya|howdy|good (morning|afternoon|evening|night))\b/.test(
      t,
    )
  ) {
    return pick(GREETINGS, userText.length);
  }

  if (/stress|anxiet|panic|calm|overwhelm|nervous/.test(t)) {
    return `That sounds like a lot. A quick reset that helps: make your **exhale longer than your inhale** — it tells your body it's safe. Drop your shoulders, and let the next few breaths be slow and unhurried.

Want me to talk you through a full round?`;
  }
  if (/how|technique|method|exercise|practice|guide|steps?/.test(t)) {
    return `Sure — the simplest one is the **4-7-8**:

- Inhale through the nose for 4
- Hold gently for 7
- Exhale slowly through the mouth for 8

Three rounds is plenty. Want to do one together?`;
  }
  if (/price|cost|plan|premium|upgrade|pay|subscri/.test(t)) {
    return `The Free plan gives you one breath a day. **Premium** unlocks unlimited breathing and removes the ads. Happy to break down the plans if you'd like.`;
  }
  if (/sleep|tired|insomnia|relax|night/.test(t)) {
    return `For winding down, slow everything right down and breathe low into the belly — long, easy exhales. That long out-breath is the part that helps you drift off. Want a short routine?`;
  }

  return `Happy to help with that. Tell me a bit more about what you're after — calming down, focus, sleep, or just a breathing technique?`;
}

export function lastUserText(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "USER") return messages[i].content;
  }
  return "";
}
