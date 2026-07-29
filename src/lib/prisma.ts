import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  prismaDatabaseUrl: string | undefined;
};
const databaseUrl = process.env.DATABASE_URL;
const canReuseClient =
  globalForPrisma.prisma && globalForPrisma.prismaDatabaseUrl === databaseUrl;

export const prisma =
  (canReuseClient ? globalForPrisma.prisma : undefined) ||
  new PrismaClient({
    datasourceUrl: databaseUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaDatabaseUrl = databaseUrl;
}
