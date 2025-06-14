import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { signInSchema } from "~/schemas/auth";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { env } from "~/env";

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
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const user = await db.user.findUnique({
            where: { email: email },
          });

          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            console.warn("Validation failed:", error.flatten());
            return null;
          }

          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    // Add other providers here if needed
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
      if (user) {
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
