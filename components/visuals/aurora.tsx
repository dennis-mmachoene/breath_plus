import { cn } from "@/lib/utils";

/** Soft drifting warm blooms behind the hero. Purely decorative. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div
        className="animate-drift absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-apricot-300), transparent 65%)" }}
      />
      <div
        className="animate-drift absolute -right-40 top-10 h-[40rem] w-[40rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-sage-300), transparent 65%)", animationDelay: "-8s" }}
      />
      <div
        className="animate-drift absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-haze-300), transparent 65%)", animationDelay: "-15s" }}
      />
    </div>
  );
}
