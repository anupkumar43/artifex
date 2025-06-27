import { PrismaClient as BaseClient } from "~/generated/prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "~/env";

// Create and extend Prisma client with Accelerate
const createPrismaClient = () => new BaseClient().$extends(withAccelerate());

// Declare global type-safe singleton to avoid multiple connections
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Export the extended Prisma client
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
