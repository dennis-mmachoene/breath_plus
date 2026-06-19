import "dotenv/config";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * One-time (idempotent) provisioning: create a Stripe product + monthly price
 * for each paid plan and store the ids on the Plan rows. Re-running skips plans
 * that already have a price.
 *
 *   npm run stripe:setup
 */
async function main() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY missing in .env");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const db = new PrismaClient({ adapter });

  try {
    const plans = await db.plan.findMany({
      where: { id: { not: "FREE" }, isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    for (const plan of plans) {
      if (plan.stripePriceIdMonthly) {
        console.log(`⏭  ${plan.name} already provisioned (${plan.stripePriceIdMonthly})`);
        continue;
      }

      let productId = plan.stripeProductId;
      if (!productId) {
        const product = await stripe.products.create({
          name: `Breath+ ${plan.name}`,
          description: plan.tagline,
        });
        productId = product.id;
      }

      const price = await stripe.prices.create({
        product: productId,
        unit_amount: plan.priceCents,
        currency: "usd",
        recurring: { interval: "month" },
      });

      await db.plan.update({
        where: { id: plan.id },
        data: { stripeProductId: productId, stripePriceIdMonthly: price.id },
      });

      console.log(`✅ ${plan.name}: ${price.id}`);
    }

    console.log("\nDone. Paid plans are ready for checkout.");
    await db.$disconnect();
  } catch (e) {
    await db.$disconnect();
    throw e;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
