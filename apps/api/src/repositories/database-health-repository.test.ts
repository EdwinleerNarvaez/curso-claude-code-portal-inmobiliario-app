import { describe, expect, it } from "vitest";

import {
  checkDatabaseConnection,
  type DatabaseQueryClient,
} from "./database-health-repository";

function createDatabaseQueryClient(
  queryResult: () => Promise<unknown>,
): DatabaseQueryClient {
  return {
    $queryRaw<Result>() {
      return queryResult() as Promise<Result>;
    },
  };
}

describe("checkDatabaseConnection", () => {
  it("informa la base de datos y la versión cuando la consulta funciona", async () => {
    const databaseQueryClient = createDatabaseQueryClient(async () => [
      { database_name: "portal_inmobiliario", server_version: "16.16" },
    ]);

    await expect(checkDatabaseConnection(databaseQueryClient)).resolves.toEqual(
      {
        isConnected: true,
        databaseName: "portal_inmobiliario",
        serverVersion: "16.16",
      },
    );
  });

  it("informa un error cuando la consulta falla", async () => {
    const databaseQueryClient = createDatabaseQueryClient(async () => {
      throw new Error("connection refused");
    });

    await expect(checkDatabaseConnection(databaseQueryClient)).resolves.toEqual(
      { isConnected: false, errorMessage: "connection refused" },
    );
  });

  it("informa un error cuando la consulta no devuelve filas", async () => {
    const databaseQueryClient = createDatabaseQueryClient(async () => []);

    await expect(checkDatabaseConnection(databaseQueryClient)).resolves.toEqual(
      {
        isConnected: false,
        errorMessage: "La base de datos no devolvió información.",
      },
    );
  });
});
