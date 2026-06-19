"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wind,
  Sparkles,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/breathe", label: "Breathe", icon: Wind },
  { href: "/app/wrapped", label: "Wrapped", icon: Sparkles },
];

export function AppNav({
  planName,
  isAdmin,
}: {
  planName: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const links = isAdmin
    ? [...LINKS, { href: "/app/admin", label: "Admin", icon: ShieldCheck }]
    : LINKS;
  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-6">
          <Logo href="/app" />
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(l.href)
                    ? "bg-brand-soft text-sage-700 dark:text-sage-200"
                    : "text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/app/billing"
            className="hidden rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-sage-700 transition-opacity hover:opacity-80 dark:text-sage-200 sm:inline"
          >
            {planName}
          </Link>
          <Link
            href="/app/settings"
            aria-label="Settings"
            aria-current={isActive("/app/settings") ? "page" : undefined}
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Settings className="h-[18px] w-[18px]" />
          </Link>
          <ThemeToggle />
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-2"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex items-center gap-1 border-t border-border px-3 py-2 sm:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-xs font-medium transition-colors",
              isActive(l.href)
                ? "bg-brand-soft text-sage-700 dark:text-sage-200"
                : "text-muted",
            )}
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </Link>
        ))}
        <Link
          href="/app/settings"
          aria-label="Settings"
          className={cn(
            "flex items-center justify-center rounded-full px-3 py-2 transition-colors",
            isActive("/app/settings")
              ? "bg-brand-soft text-sage-700 dark:text-sage-200"
              : "text-muted",
          )}
        >
          <Settings className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  );
}
