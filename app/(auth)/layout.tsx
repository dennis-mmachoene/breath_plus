import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { Aurora } from "@/components/visuals/aurora";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Aurora />
      <header className="px-5 py-5 sm:px-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-[26rem]">{children}</div>
      </main>
      <footer className="px-5 py-6 text-center text-xs text-muted sm:px-8">
        <Link href="/" className="hover:text-foreground">
          ← Back to breathing
        </Link>
      </footer>
    </div>
  );
}
