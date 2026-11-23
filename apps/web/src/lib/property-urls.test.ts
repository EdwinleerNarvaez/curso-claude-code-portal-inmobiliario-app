import { describe, expect, it } from "vitest";

import {
  buildCatalogUrl,
  buildPropertyDetailUrl,
  buildPublicPropertiesApiUrl,
} from "./property-urls";

describe("buildPublicPropertiesApiUrl", () => {
  it("devuelve la ruta base cuando no hay parámetros", () => {
    expect(buildPublicPropertiesApiUrl()).toBe("/api/properties");
  });

  it("incluye solo los parámetros definidos", () => {
    expect(
      buildPublicPropertiesApiUrl({ featured: true, pageSize: 6 }),
    ).toBe("/api/properties?pageSize=6&featured=true");
    expect(
      buildPublicPropertiesApiUrl({ operation: "RENT", page: 2, pageSize: 3 }),
    ).toBe("/api/properties?page=2&pageSize=3&operation=RENT");
  });

  it("conserva featured=false", () => {
    expect(buildPublicPropertiesApiUrl({ featured: false })).toBe(
      "/api/properties?featured=false",
    );
  });
});

describe("buildCatalogUrl", () => {
  it("devuelve /properties cuando no hay valores", () => {
    expect(buildCatalogUrl()).toBe("/properties");
    expect(buildCatalogUrl({ search: "  ", operation: "", type: "" })).toBe(
      "/properties",
    );
  });

  it("representa la búsqueda y los filtros en la URL", () => {
    expect(
      buildCatalogUrl({
        search: " Providencia ",
        operation: "SALE",
        type: "APARTMENT",
      }),
    ).toBe("/properties?search=Providencia&operation=SALE&type=APARTMENT");
  });

  it("codifica caracteres especiales de la búsqueda", () => {
    expect(buildCatalogUrl({ search: "Ñuñoa & Providencia" })).toBe(
      "/properties?search=%C3%91u%C3%B1oa+%26+Providencia",
    );
  });
});

describe("buildPropertyDetailUrl", () => {
  it("construye la ruta del detalle", () => {
    expect(buildPropertyDetailUrl("5eed0000-0000-7000-8000-000000000001")).toBe(
      "/properties/5eed0000-0000-7000-8000-000000000001",
    );
  });
});
