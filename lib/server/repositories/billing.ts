import { db } from "@/lib/server/db";
import type { PlanId, SubscriptionStatus, Prisma } from "@prisma/client";

export function getUser(userId: string) {
  return db.user.findUnique({ where: { id: userId } });
}

export function getSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId }, include: { plan: true } });
}

export function getSubscriptionByCustomer(stripeCustomerId: string) {
  return db.subscription.findUnique({ where: { stripeCustomerId } });
}

export function listPaidPlans() {
  return db.plan.findMany({
    where: { id: { not: "FREE" }, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getPlan(id: PlanId) {
  return db.plan.findUnique({ where: { id } });
}

export function findPlanByPriceId(priceId: string) {
  return db.plan.findFirst({ where: { stripePriceIdMonthly: priceId } });
}

export function setStripeCustomer(userId: string, stripeCustomerId: string) {
  return db.subscription.update({ where: { userId }, data: { stripeCustomerId } });
}

export function updateSubscriptionByCustomer(
  stripeCustomerId: string,
  data: {
    planId?: PlanId;
    status?: SubscriptionStatus;
    stripeSubscriptionId?: string | null;
    currentPeriodEnd?: Date | null;
    cancelAtPeriodEnd?: boolean;
  },
) {
  return db.subscription.update({ where: { stripeCustomerId }, data });
}

export function upsertInvoice(userId: string, data: Prisma.InvoiceUncheckedCreateInput) {
  if (!data.stripeInvoiceId) return db.invoice.create({ data });
  return db.invoice.upsert({
    where: { stripeInvoiceId: data.stripeInvoiceId },
    create: data,
    update: {
      status: data.status,
      amountPaidCents: data.amountPaidCents,
      hostedInvoiceUrl: data.hostedInvoiceUrl,
      pdfUrl: data.pdfUrl,
    },
  });
}
