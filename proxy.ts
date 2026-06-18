import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16 renamed `middleware` → `proxy`. Auth.js reads the JWT here and
// applies the `authorized` callback to gate the matched routes.
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/app/:path*"],
};
