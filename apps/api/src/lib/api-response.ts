import "server-only";

import { unstable_rethrow } from "next/navigation";
import { NextResponse } from "next/server";
import type { z } from "zod";

import { InvalidInputError, NotFoundError } from "./application-errors";

export type ApiErrorBody = {
  message: string;
  status: number;
};

const internalServerErrorMessage = "Error interno del servidor";

export function createErrorResponse(
  status: number,
  message: string,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ message, status }, { status });
}

/** Traduce cualquier error a una respuesta REST sin exponer detalles internos. */
export function handleRouteError(error: unknown): NextResponse<ApiErrorBody> {
  // Next.js lanza errores internos (por ejemplo, para marcar una ruta como
  // dinámica durante el build). Deben propagarse, no tratarse como fallos.
  unstable_rethrow(error);

  if (error instanceof InvalidInputError) {
    return createErrorResponse(400, error.message);
  }

  if (error instanceof NotFoundError) {
    return createErrorResponse(404, error.message);
  }

  console.error("Error no controlado en la API:", error);
  return createErrorResponse(500, internalServerErrorMessage);
}

/** Valida datos de entrada con Zod y lanza InvalidInputError con el primer problema. */
export function parseInput<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): z.output<Schema> {
  const parseResult = schema.safeParse(input);

  if (!parseResult.success) {
    const firstIssue = parseResult.error.issues[0];
    throw new InvalidInputError(
      firstIssue?.message ?? "Los datos enviados no son válidos.",
    );
  }

  return parseResult.data;
}

export function searchParamsToObject(
  searchParams: URLSearchParams,
): Record<string, string> {
  return Object.fromEntries(searchParams.entries());
}
