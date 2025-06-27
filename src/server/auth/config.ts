import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { signInSchema } from "~/schemas/auth";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { env } from "~/env";

export const runtime = "nodejs";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
  }
}

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsingh@xmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          // Safe parse
          const parsed = signInSchema.safeParse(credentials);
          if (!parsed.success) {
            console.warn("Validation failed:", parsed.error.flatten());
            return null;
          }

          const { email, password } = parsed.data;

          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.warn("User not found");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.warn("Invalid password");
            return null;
          }

          return user;
        } catch (err) {
          console.error("Authorization error:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: env.AUTH_SECRET,

  callbacks: {
    jwt({ token, user }) {
      if (user && "id" in user && typeof user.id === "string") {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
