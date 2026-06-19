import type Stripe from "stripe";
import { requireStripe } from "@/lib/server/stripe";
import { env } from "@/lib/env";
import * as billing from "@/lib/server/services/billing-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = requireStripe().webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️  Stripe signature verification failed:", (err as Error).message);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await requireStripe().subscriptions.retrieve(session.subscription as string);
          await billing.syncFromStripeSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await billing.syncFromStripeSubscription(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await billing.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await billing.recordInvoice(event.data.object as Stripe.Invoice);
        break;
      default:
        // ignore other events
        break;
    }
  } catch (err) {
    console.error(`⚠️  Error handling ${event.type}:`, (err as Error).message);
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
