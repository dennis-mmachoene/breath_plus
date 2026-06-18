"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-2",
        className,
      )}
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ y: 8, opacity: 0, rotate: -30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -8, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.18 }}
          >
            {isDark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
