import Stripe from "stripe";
import { env } from "@/lib/env";

// Null when billing isn't configured (no secret key). Use requireStripe() in
// code paths that must have it.
export const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

export function requireStripe(): Stripe {
  if (!stripe) throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing).");
  return stripe;
}
