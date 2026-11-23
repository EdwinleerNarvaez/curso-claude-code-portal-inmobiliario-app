import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prismaClient?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("La variable de entorno DATABASE_URL no está definida.");
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

/**
 * Devuelve una única instancia de PrismaClient por proceso.
 * En desarrollo se reutiliza entre recargas en caliente para no agotar conexiones.
 */
export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prismaClient) {
    globalForPrisma.prismaClient = createPrismaClient();
  }

  return globalForPrisma.prismaClient;
}
