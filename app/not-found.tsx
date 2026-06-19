import Link from "next/link";
import { BreathBloom } from "@/components/visuals/breath-bloom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <BreathBloom size={140} ambient idleLabel="" />
      <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-sage-600 dark:text-sage-400">404</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">This air is thin up here</h1>
      <p className="mt-2 max-w-sm text-muted">The page you&apos;re looking for drifted off. Let&apos;s get you back to solid ground.</p>
      <Link href="/" className="mt-6">
        <Button>Back to breathing</Button>
      </Link>
    </div>
  );
}
