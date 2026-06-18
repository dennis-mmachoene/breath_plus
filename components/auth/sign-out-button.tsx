import { signOutAction } from "@/app/(auth)/actions";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </form>
  );
}
