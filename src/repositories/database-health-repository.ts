export type DatabaseQueryClient = {
  $queryRaw<Result>(
    query: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<Result>;
};

export type DatabaseConnectionStatus =
  | { isConnected: true; databaseName: string; serverVersion: string }
  | { isConnected: false; errorMessage: string };

type DatabaseInformationRow = {
  database_name: string;
  server_version: string;
};

export async function checkDatabaseConnection(
  databaseQueryClient: DatabaseQueryClient,
): Promise<DatabaseConnectionStatus> {
  try {
    const rows = await databaseQueryClient.$queryRaw<DatabaseInformationRow[]>`
      SELECT current_database() AS database_name,
             current_setting('server_version') AS server_version
    `;
    const firstRow = rows[0];

    if (!firstRow) {
      return {
        isConnected: false,
        errorMessage: "La base de datos no devolvió información.",
      };
    }

    return {
      isConnected: true,
      databaseName: firstRow.database_name,
      serverVersion: firstRow.server_version,
    };
  } catch (error) {
    return {
      isConnected: false,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}
