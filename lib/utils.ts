import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (conditionals + conflict resolution). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Time-of-day greeting for the app shell (used later). */
export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 5) return "Still breathing";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}
