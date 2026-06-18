import Link from "next/link";
import { cn } from "@/lib/utils";

export function BloomMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block h-7 w-7 shrink-0", className)}
      style={{
        borderRadius: "46% 54% 58% 42% / 54% 46% 54% 46%",
        background:
          "radial-gradient(120% 120% at 34% 28%, #ffffff, #c7e4dd 30%, #79a971 70%, #284e3c 108%)",
        boxShadow: "inset 0 0 8px rgba(255,255,255,0.5), 0 4px 14px -4px rgba(40,78,60,0.55)",
      }}
    />
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Breath+ home">
      <BloomMark />
      <span className="font-display text-lg font-semibold tracking-tight">
        Breath<span className="text-gradient">+</span>
      </span>
    </Link>
  );
}
