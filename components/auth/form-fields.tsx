"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  errors?: string[];
}) {
  const id = `field-${name}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={errors && errors.length > 0}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3.5 text-[15px] text-foreground placeholder:text-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          errors?.length ? "border-clay-400" : "border-border",
        )}
      />
      {errors?.map((e) => (
        <p key={e} className="text-xs text-clay-600 dark:text-clay-300">
          {e}
        </p>
      ))}
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "One breath…" : children}
    </Button>
  );
}
