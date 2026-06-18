"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4",
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2 transition-all duration-300 sm:px-5",
            scrolled ? "glass shadow-float" : "bg-transparent",
          )}
        >
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:grid" />
            <Link href="/login" className="hidden sm:block">
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
