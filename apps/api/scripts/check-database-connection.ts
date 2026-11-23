import { loadEnvConfig } from "@next/env";

import { checkDatabaseConnection } from "@/repositories/database-health-repository";
import { getPrismaClient } from "@/repositories/prisma-client";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const prismaClient = getPrismaClient();

  try {
    const connectionStatus = await checkDatabaseConnection(prismaClient);

    if (!connectionStatus.isConnected) {
      console.error(
        `No se pudo conectar a PostgreSQL: ${connectionStatus.errorMessage}`,
      );
      process.exitCode = 1;
      return;
    }

    console.log(
      `Conexión a PostgreSQL correcta: base "${connectionStatus.databaseName}", versión ${connectionStatus.serverVersion}.`,
    );
  } finally {
    await prismaClient.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
