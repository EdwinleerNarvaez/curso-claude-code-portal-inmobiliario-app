import { z } from "zod";

import { operationTypes } from "../types/property";

export const defaultPageSize = 12;
export const maximumPageSize = 50;

const pageMessage = "El parámetro page debe ser un número entero mayor o igual a 1.";
const pageSizeMessage = `El parámetro pageSize debe ser un número entero entre 1 y ${maximumPageSize}.`;
const operationMessage = `El parámetro operation debe ser uno de: ${operationTypes.join(", ")}.`;
const featuredMessage = 'El parámetro featured debe ser "true" o "false".';

/**
 * Parámetros de consulta de GET /api/properties.
 * Se transforman a la forma que espera el servicio: paginación + filtros.
 */
export const publicPropertyListQuerySchema = z
  .object({
    page: z.coerce
      .number({ error: pageMessage })
      .int({ error: pageMessage })
      .min(1, { error: pageMessage })
      .default(1),
    pageSize: z.coerce
      .number({ error: pageSizeMessage })
      .int({ error: pageSizeMessage })
      .min(1, { error: pageSizeMessage })
      .max(maximumPageSize, { error: pageSizeMessage })
      .default(defaultPageSize),
    operation: z.enum(operationTypes, { error: operationMessage }).optional(),
    featured: z
      .enum(["true", "false"], { error: featuredMessage })
      .transform((featuredText) => featuredText === "true")
      .optional(),
  })
  .transform(({ page, pageSize, operation, featured }) => ({
    page,
    pageSize,
    filters: { operationType: operation, isFeatured: featured },
  }));

export type PublicPropertyListQuery = z.output<
  typeof publicPropertyListQuerySchema
>;

/** Identificador de propiedad recibido en la URL. */
export const propertyIdSchema = z.uuid({
  error: "El identificador de la propiedad no es válido.",
});
