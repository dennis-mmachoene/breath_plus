import { Gauge, Infinity as InfinityIcon, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Gauge,
    title: "12ms inhale latency",
    body: "Our global atmosphere mesh routes oxygen to your nearest lung in milliseconds. You won't feel a thing — that's the point.",
  },
  {
    icon: InfinityIcon,
    title: "Unlimited breathing",
    body: "Breathe as much as you like on paid tiers. No throttling, no fair-use clause, no awkward conversation about how much air you've used.",
  },
  {
    icon: Sparkles,
    title: "AI-guided inhaling",
    body: "BreathGPT™ analyses 14 million breaths per second to tell you, with total confidence, that you are breathing slightly wrong.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sage-600 dark:text-sage-400">
            The platform
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            An infrastructure layer for staying alive
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We rebuilt respiration from the protocol up — so the most fundamental thing you do all day finally feels
            like enterprise software.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-surface p-6 shadow-float transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-sage-600 dark:text-sage-300">
                <f.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
