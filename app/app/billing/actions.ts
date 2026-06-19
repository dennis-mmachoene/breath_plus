"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { PlanId } from "@prisma/client";
import { createCheckout, createPortal } from "@/lib/server/services/billing-service";

export async function checkoutAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const planId = String(formData.get("planId") ?? "") as PlanId;
  const url = await createCheckout(session.user.id, planId);
  redirect(url); // → Stripe Checkout (external)
}

export async function portalAction(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const url = await createPortal(session.user.id);
  redirect(url); // → Stripe Billing Portal (external)
}
