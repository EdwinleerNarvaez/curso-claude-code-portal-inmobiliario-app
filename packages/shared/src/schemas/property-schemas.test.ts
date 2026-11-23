import { describe, expect, it } from "vitest";

import {
  defaultPageSize,
  maximumPageSize,
  propertyIdSchema,
  publicPropertyListQuerySchema,
} from "./property-schemas";

describe("publicPropertyListQuerySchema", () => {
  it("aplica página 1 y tamaño por defecto cuando no se envían", () => {
    expect(publicPropertyListQuerySchema.parse({})).toEqual({
      page: 1,
      pageSize: defaultPageSize,
      filters: {},
    });
  });

  it("convierte los valores de texto de la URL a números", () => {
    expect(
      publicPropertyListQuerySchema.parse({ page: "3", pageSize: "20" }),
    ).toEqual({ page: 3, pageSize: 20, filters: {} });
  });

  it("ignora parámetros desconocidos", () => {
    expect(
      publicPropertyListQuerySchema.parse({ page: "2", search: "providencia" }),
    ).toEqual({ page: 2, pageSize: defaultPageSize, filters: {} });
  });

  it("transforma operation y featured en filtros del servicio", () => {
    expect(
      publicPropertyListQuerySchema.parse({ operation: "RENT", featured: "true" })
        .filters,
    ).toEqual({ operationType: "RENT", isFeatured: true });
    expect(
      publicPropertyListQuerySchema.parse({ featured: "false" }).filters,
    ).toEqual({ isFeatured: false });
  });

  it("rechaza una operación desconocida", () => {
    const parseResult = publicPropertyListQuerySchema.safeParse({
      operation: "LEASE",
    });

    expect(parseResult.error?.issues[0]?.message).toBe(
      "El parámetro operation debe ser uno de: SALE, RENT.",
    );
  });

  it("rechaza un valor de featured distinto de true o false", () => {
    const parseResult = publicPropertyListQuerySchema.safeParse({
      featured: "si",
    });

    expect(parseResult.error?.issues[0]?.message).toBe(
      'El parámetro featured debe ser "true" o "false".',
    );
  });

  it.each(["0", "-1", "1.5", "abc"])("rechaza page=%s", (page) => {
    const parseResult = publicPropertyListQuerySchema.safeParse({ page });

    expect(parseResult.success).toBe(false);
    expect(parseResult.error?.issues[0]?.message).toBe(
      "El parámetro page debe ser un número entero mayor o igual a 1.",
    );
  });

  it.each(["0", String(maximumPageSize + 1), "abc"])(
    "rechaza pageSize=%s",
    (pageSize) => {
      const parseResult = publicPropertyListQuerySchema.safeParse({ pageSize });

      expect(parseResult.success).toBe(false);
      expect(parseResult.error?.issues[0]?.message).toBe(
        `El parámetro pageSize debe ser un número entero entre 1 y ${maximumPageSize}.`,
      );
    },
  );

  it("acepta el tamaño de página máximo", () => {
    expect(
      publicPropertyListQuerySchema.parse({ pageSize: String(maximumPageSize) })
        .pageSize,
    ).toBe(maximumPageSize);
  });
});

describe("propertyIdSchema", () => {
  it("acepta un UUID válido", () => {
    expect(
      propertyIdSchema.parse("5eed0000-0000-7000-8000-000000000001"),
    ).toBe("5eed0000-0000-7000-8000-000000000001");
  });

  it.each(["123", "no-es-un-uuid", ""])("rechaza %j", (propertyId) => {
    const parseResult = propertyIdSchema.safeParse(propertyId);

    expect(parseResult.success).toBe(false);
    expect(parseResult.error?.issues[0]?.message).toBe(
      "El identificador de la propiedad no es válido.",
    );
  });
});
