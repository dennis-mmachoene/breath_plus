import { Check, Crown, Gem, Sparkles, Wind } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "Free",
    tagline: "The starter atmosphere.",
    icon: Wind,
    features: ["One breath per day", "Community oxygen", "Ads between breaths"],
    cta: "Start breathing",
    featured: false,
    flag: undefined as string | undefined,
  },
  {
    name: "Premium",
    price: "$9",
    tagline: "For people who breathe daily.",
    icon: Sparkles,
    features: [
      "Unlimited breathing",
      "Priority oxygen",
      "Ad-free inhaling",
      "Dark-mode air",
    ],
    cta: "Go Premium",
    featured: true,
    flag: "Most popular",
  },
  {
    name: "Premium+",
    price: "$19",
    tagline: "Breath, intelligently routed.",
    icon: Crown,
    features: [
      "Everything in Premium",
      "AI-guided breathing",
      "Weekend breathing bonus",
    ],
    cta: "Upgrade",
    featured: false,
    flag: undefined,
  },
  {
    name: "CEO Elite",
    price: "$499",
    tagline: "Air, but make it executive.",
    icon: Gem,
    features: [
      "Founder badge",
      "Quantum breathing",
      "Handcrafted oxygen",
      "Concierge respiration",
    ],
    cta: "Request access",
    featured: false,
    flag: "Invite only",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sage-600 dark:text-sage-400">
            Pricing
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Plans for every set of lungs
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Start free with a single daily breath. Upgrade when you decide that
            staying alive is worth a monthly commitment.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex h-full flex-col rounded-3xl border p-6 shadow-float",
                plan.featured
                  ? "border-transparent bg-surface ring-2 ring-sage-400/60"
                  : "border-border bg-surface",
              )}
            >
              {plan.flag && (
                <div className="absolute -top-3 left-6">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                      plan.featured
                        ? "bg-brand-soft text-sage-700 dark:text-sage-300"
                        : "bg-surface-2 text-muted",
                    )}
                  >
                    {plan.flag}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-sage-600 dark:text-sage-300">
                  <plan.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="font-display text-lg font-semibold tracking-tight">
                  {plan.name}
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">{plan.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                {plan.price !== "Free" && (
                  <span className="pb-1 text-sm text-muted">/mo</span>
                )}
              </div>
              <Link href="/register" className="mt-6 block">
                <Button
                  variant={plan.featured ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-sage-500"
                      strokeWidth={2.5}
                    />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Prices in USD. Oxygen sold separately is still, for legal reasons,
          free. Cancel anytime; gravity is non-refundable.
        </p>
      </div>
    </section>
  );
}
