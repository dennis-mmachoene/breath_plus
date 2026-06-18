"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/visuals/aurora";
import { BreathBloom } from "@/components/visuals/breath-bloom";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.21, 0.5, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24">
      <Aurora />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <motion.div
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-medium text-sage-700 dark:text-sage-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Now in private beta · Series C
          </motion.div>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="font-display mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.1rem]"
          >
            Breathing,
            <br />
            <span className="text-gradient">finally optimized.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted lg:mx-0"
          >
            Breath+ is the premium respiration platform delivering low-latency oxygen to 4.2 billion lungs
            worldwide. Inhale on demand. Exhale without limits.
          </motion.p>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Start breathing free
                <ArrowRight className="h-[18px] w-[18px]" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                See how it works
              </Button>
            </Link>
          </motion.div>

          <motion.p
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 flex items-center justify-center gap-2 text-sm text-muted lg:justify-start"
          >
            <ShieldCheck className="h-4 w-4 text-sage-500" />
            No credit card. One free breath daily. Cancel your oxygen anytime.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.21, 0.5, 0.3, 1] }}
          className="flex justify-center"
        >
          <BreathBloom size={340} ambient idleLabel="" className="sm:scale-110" />
        </motion.div>
      </div>
    </section>
  );
}
