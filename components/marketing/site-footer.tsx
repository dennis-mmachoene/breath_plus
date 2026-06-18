import { Logo } from "@/components/marketing/logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 sm:px-8">
        <Logo />
        <p className="max-w-xs text-sm leading-relaxed text-muted">
          The premium respiration platform. Because breathing shouldn&apos;t be free.
        </p>
        <div className="flex w-full flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <span>© {year} Breath+ Atmospheric Holdings, Inc. Air not included.</span>
          <span>A satire of subscription culture. The oxygen is, and always was, free.</span>
        </div>
      </div>
    </footer>
  );
}
