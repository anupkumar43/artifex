import { PrismaClient as BaseClient } from "~/generated/prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "~/env";

// Create a single instance of extended Prisma client
const createClient = () => new BaseClient().$extends(withAccelerate());

// Assign type after client creation to avoid circular reference
const client = createClient();

// Set up a global singleton for development (avoids hot reload issues)
const globalForPrisma = globalThis as unknown as {
  prisma?: typeof client;
};

export const db = globalForPrisma.prisma ?? client;

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
