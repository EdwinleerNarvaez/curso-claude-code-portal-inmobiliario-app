// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  createErrorResponse,
  handleRouteError,
  parseInput,
  searchParamsToObject,
} from "./api-response";
import { InvalidInputError, NotFoundError } from "./application-errors";

const { unstableRethrow } = vi.hoisted(() => ({ unstableRethrow: vi.fn() }));

vi.mock("next/navigation", () => ({ unstable_rethrow: unstableRethrow }));

afterEach(() => {
  vi.restoreAllMocks();
  unstableRethrow.mockReset();
});

describe("handleRouteError con errores internos de Next.js", () => {
  it("delega primero en unstable_rethrow para no capturarlos", () => {
    const nextInternalError = new Error("NEXT_PRERENDER_INTERRUPTED");
    unstableRethrow.mockImplementation((error: unknown) => {
      throw error;
    });

    expect(() => handleRouteError(nextInternalError)).toThrow(
      nextInternalError,
    );
    expect(unstableRethrow).toHaveBeenCalledWith(nextInternalError);
  });
});

describe("createErrorResponse", () => {
  it("devuelve el formato { message, status } con el código HTTP", async () => {
    const response = createErrorResponse(409, "Conflicto");

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: "Conflicto",
      status: 409,
    });
  });
});

describe("handleRouteError", () => {
  it("traduce InvalidInputError a 400", async () => {
    const response = handleRouteError(new InvalidInputError("Dato inválido"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Dato inválido",
      status: 400,
    });
  });

  it("traduce NotFoundError a 404", async () => {
    const response = handleRouteError(
      new NotFoundError("Propiedad no encontrada"),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: "Propiedad no encontrada",
      status: 404,
    });
  });

  it("responde 500 sin exponer el mensaje interno", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = handleRouteError(
      new Error("connection refused at 10.0.0.5:5432"),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ message: "Error interno del servidor", status: 500 });
    expect(JSON.stringify(body)).not.toContain("10.0.0.5");
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });
});

describe("parseInput", () => {
  const schema = z.object({
    page: z.coerce.number().min(1, { error: "page inválido" }),
  });

  it("devuelve los datos transformados cuando son válidos", () => {
    expect(parseInput(schema, { page: "3" })).toEqual({ page: 3 });
  });

  it("lanza InvalidInputError con el primer mensaje de error", () => {
    expect(() => parseInput(schema, { page: "0" })).toThrow(
      new InvalidInputError("page inválido"),
    );
  });
});

describe("searchParamsToObject", () => {
  it("convierte los parámetros de consulta en un objeto", () => {
    expect(
      searchParamsToObject(new URLSearchParams("page=2&pageSize=10")),
    ).toEqual({ page: "2", pageSize: "10" });
  });
});
