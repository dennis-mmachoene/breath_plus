import type Stripe from "stripe";
import type { PlanId, SubscriptionStatus } from "@prisma/client";
import { requireStripe } from "@/lib/server/stripe";
import { siteUrl } from "@/lib/env";
import * as repo from "@/lib/server/repositories/billing";

function mapStatus(s: Stripe.Subscription.Status): SubscriptionStatus {
  switch (s) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "unpaid":
      return "UNPAID";
    default:
      return "INCOMPLETE";
  }
}

/** Ensure the user has a Stripe customer; persist its id on the subscription. */
async function getOrCreateCustomer(userId: string): Promise<string> {
  const sub = await repo.getSubscription(userId);
  if (sub?.stripeCustomerId) return sub.stripeCustomerId;

  const user = await repo.getUser(userId);
  const customer = await requireStripe().customers.create({
    email: user?.email ?? undefined,
    name: user?.name ?? undefined,
    metadata: { userId },
  });
  await repo.setStripeCustomer(userId, customer.id);
  return customer.id;
}

/** Create a Checkout Session for a paid plan; returns the redirect URL. */
export async function createCheckout(userId: string, planId: PlanId): Promise<string> {
  const plan = await repo.getPlan(planId);
  if (!plan) throw new Error("Unknown plan.");
  if (!plan.stripePriceIdMonthly) {
    throw new Error("This plan has no Stripe price yet. Run: npm run stripe:setup");
  }

  const customer = await getOrCreateCustomer(userId);
  const session = await requireStripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price: plan.stripePriceIdMonthly, quantity: 1 }],
    success_url: `${siteUrl}/app/billing?success=1`,
    cancel_url: `${siteUrl}/app/billing?canceled=1`,
    allow_promotion_codes: true,
    metadata: { userId, planId },
    subscription_data: { metadata: { userId, planId } },
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return session.url;
}

/** Create a Billing Portal session so the user can manage/cancel. */
export async function createPortal(userId: string): Promise<string> {
  const sub = await repo.getSubscription(userId);
  if (!sub?.stripeCustomerId) throw new Error("No billing account yet.");
  const session = await requireStripe().billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${siteUrl}/app/billing`,
  });
  return session.url;
}

/** Mirror a Stripe subscription into our DB (called from the webhook). */
export async function syncFromStripeSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price.id;
  const plan = priceId ? await repo.findPlanByPriceId(priceId) : null;

  await repo.updateSubscriptionByCustomer(customerId, {
    planId: (plan?.id as PlanId) ?? undefined,
    status: mapStatus(sub.status),
    stripeSubscriptionId: sub.id,
    currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  });
}

/** Subscription fully ended → drop back to FREE. */
export async function handleSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  await repo.updateSubscriptionByCustomer(customerId, {
    planId: "FREE",
    status: "CANCELED",
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });
}

/** Record a paid invoice (best-effort). */
export async function recordInvoice(invoice: Stripe.Invoice): Promise<void> {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;
  const sub = await repo.getSubscriptionByCustomer(customerId);
  if (!sub) return;

  await repo.upsertInvoice(sub.userId, {
    userId: sub.userId,
    stripeInvoiceId: invoice.id,
    number: invoice.number ?? undefined,
    status: invoice.status === "paid" ? "PAID" : "OPEN",
    amountDueCents: invoice.amount_due,
    amountPaidCents: invoice.amount_paid,
    currency: invoice.currency,
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,
    pdfUrl: invoice.invoice_pdf ?? undefined,
  });
}
