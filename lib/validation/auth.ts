import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Keep it under 72 characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "What should we call you?").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Shared return shape for the auth server actions (used by the forms). */
export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  sent?: boolean;
};
