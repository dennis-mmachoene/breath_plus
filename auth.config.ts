import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe configuration shared by the middleware and the full Node config.
 * MUST NOT import Prisma, bcrypt, or the env module — middleware runs on the
 * edge runtime. Reads OAuth creds straight from process.env.
 */
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: googleEnabled
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : [],
  callbacks: {
    // Route gate evaluated in middleware. Protects the authenticated app.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnApp = nextUrl.pathname.startsWith("/app");
      if (isOnApp) return isLoggedIn; // → redirected to /login when false
      return true;
    },
    // Carry id + role on the token (edge-safe: only shuffles fields).
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user.role ?? "USER") as typeof token.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
