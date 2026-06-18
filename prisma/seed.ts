import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const PLANS = [
  {
    id: "FREE" as const,
    name: "Free",
    tagline: "The starter atmosphere.",
    priceCents: 0,
    breathsPerDay: 1,
    flag: null,
    sortOrder: 0,
    features: [
      "One breath per day",
      "Community oxygen",
      "Ads between breaths",
      "Standard-latency air",
    ],
  },
  {
    id: "PREMIUM" as const,
    name: "Premium",
    tagline: "For people who breathe daily.",
    priceCents: 900,
    breathsPerDay: null,
    flag: "Most popular",
    sortOrder: 1,
    features: [
      "Unlimited breathing",
      "Priority oxygen",
      "Ad-free inhaling",
      "Dark-mode air",
      "99.9% uptime air",
    ],
  },
  {
    id: "PREMIUM_PLUS" as const,
    name: "Premium+",
    tagline: "Breath, intelligently routed.",
    priceCents: 1900,
    breathsPerDay: null,
    flag: null,
    sortOrder: 2,
    features: [
      "Everything in Premium",
      "AI-guided breathing",
      "Lossless respiration",
      "Weekend breathing bonus",
    ],
  },
  {
    id: "CEO_ELITE" as const,
    name: "CEO Elite Platinum",
    tagline: "Air, but make it executive.",
    priceCents: 49900,
    breathsPerDay: null,
    flag: "Invite only",
    sortOrder: 3,
    features: [
      "Founder badge",
      "Quantum breathing",
      "Executive air molecules",
      "Concierge respiration",
      "Handcrafted oxygen",
    ],
  },
];

const ACHIEVEMENTS = [
  {
    id: "first-breath",
    name: "First Breath",
    description: "You inhaled. Historic.",
    icon: "Wind",
    threshold: 1,
    metric: "lifetime_breaths",
    sortOrder: 0,
  },
  {
    id: "ten-breaths",
    name: "Getting the Hang of It",
    description: "Ten whole breaths.",
    icon: "Sparkles",
    threshold: 10,
    metric: "lifetime_breaths",
    sortOrder: 1,
  },
  {
    id: "hundred-breaths",
    name: "Respiration Enthusiast",
    description: "One hundred breaths logged.",
    icon: "Award",
    threshold: 100,
    metric: "lifetime_breaths",
    sortOrder: 2,
  },
  {
    id: "streak-7",
    name: "Seven-Day Lung",
    description: "A full week of breathing. Consistent.",
    icon: "Flame",
    threshold: 7,
    metric: "streak_days",
    sortOrder: 3,
  },
  {
    id: "streak-30",
    name: "Monthly Inhaler",
    description: "Thirty days straight. Impressive lungs.",
    icon: "Crown",
    threshold: 30,
    metric: "streak_days",
    sortOrder: 4,
  },
];

async function main() {
  console.log("🌱 Seeding plans…");
  for (const p of PLANS) {
    await db.plan.upsert({ where: { id: p.id }, create: p, update: p });
  }

  console.log("🏅 Seeding achievements…");
  for (const a of ACHIEVEMENTS) {
    await db.achievement.upsert({ where: { id: a.id }, create: a, update: a });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
