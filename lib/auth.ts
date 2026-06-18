import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/server/db";
import { loginSchema } from "@/lib/validation/auth";
import { ensureUserDefaults } from "@/lib/server/user-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Locked until the email is verified (defense in depth — the sign-in
        // action also pre-checks and redirects unverified users).
        if (!user.emailVerified) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  events: {
    // Adapter-created users are OAuth sign-ups (e.g. Google). Their email is
    // already verified by the provider, so mark it and give them defaults.
    async createUser({ user }) {
      if (!user.id) return;
      await ensureUserDefaults(user.id);
      if (!user.emailVerified) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
});
