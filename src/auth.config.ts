import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const password = credentials?.password;
        if (!password || typeof password !== "string") return null;

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (hash) {
          const ok = await bcrypt.compare(password, hash);
          if (!ok) return null;
          return { id: "1", name: "Admin" };
        }

        const plain = process.env.ADMIN_PASSWORD;
        if (plain) {
          if (process.env.NODE_ENV !== "development") {
            return null;
          }
          if (password !== plain) return null;
          return { id: "1", name: "Admin" };
        }

        return null;
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
