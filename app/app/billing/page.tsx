import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check, Crown, Sparkles, Gem, Wind } from "lucide-react";
import { auth } from "@/lib/auth";
import { isBillingEnabled } from "@/lib/env";
import * as repo from "@/lib/server/repositories/billing";
import { Button } from "@/components/ui/button";
import { checkoutAction, portalAction } from "@/app/app/billing/actions";

export const metadata: Metadata = { title: "Billing" };

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  PREMIUM: Sparkles,
  PREMIUM_PLUS: Gem,
  CEO_ELITE: Crown,
};

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ success?: string; canceled?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { success, canceled } = await searchParams;
  const [plans, sub] = await Promise.all([repo.listPaidPlans(), repo.getSubscription(session.user.id)]);
  const currentPlanId = sub?.planId ?? "FREE";
  const isPaid = currentPlanId !== "FREE";

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-2 text-muted">
        You&apos;re on the <span className="font-medium text-foreground">{sub?.plan?.name ?? "Free"}</span> plan. Air remains
        free everywhere else — here, it&apos;s premium.
      </p>

      {success && (
        <Banner tone="ok">Welcome to premium air. Your plan is being activated — it&apos;ll update here in a moment.</Banner>
      )}
      {canceled && <Banner tone="muted">Checkout canceled. Your plan is unchanged.</Banner>}

      {!isBillingEnabled && (
        <Banner tone="muted">
          Billing isn&apos;t configured yet. Add your Stripe keys to <code>.env</code> and run <code>npm run stripe:setup</code>.
        </Banner>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = ICONS[plan.id] ?? Wind;
          const isCurrent = plan.id === currentPlanId;
          const price = (plan.priceCents / 100).toLocaleString("en-US", { style: "currency", currency: "usd", minimumFractionDigits: 0 });
          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-3xl border p-6 shadow-soft ${isCurrent ? "border-sage-500 bg-brand-soft" : "border-border bg-surface"}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-sage-700 dark:text-sage-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{plan.name}</div>
                  {plan.flag && <div className="text-xs font-medium text-sage-600 dark:text-sage-400">{plan.flag}</div>}
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold">{price}</span>
                <span className="text-sm text-muted">/month</span>
              </div>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600 dark:text-sage-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <form action={checkoutAction}>
                    <input type="hidden" name="planId" value={plan.id} />
                    <Button type="submit" className="w-full" disabled={!isBillingEnabled}>
                      Upgrade to {plan.name}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isPaid && (
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-lg font-semibold">Manage your subscription</div>
            <p className="mt-1 text-sm text-muted">Update payment details, change plan, or cancel anytime.</p>
          </div>
          <form action={portalAction}>
            <Button variant="secondary" type="submit">
              Manage billing
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function Banner({ tone, children }: { tone: "ok" | "muted"; children: React.ReactNode }) {
  return (
    <div
      className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
        tone === "ok"
          ? "border-sage-300 bg-brand-soft text-sage-800 dark:text-sage-200"
          : "border-border bg-surface-2 text-muted"
      }`}
    >
      {children}
    </div>
  );
}
