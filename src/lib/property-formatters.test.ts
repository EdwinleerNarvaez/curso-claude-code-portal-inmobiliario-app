import { describe, expect, it } from "vitest";

import { operationTypes, propertyTypes } from "@/types/property";

import {
  formatArea,
  formatPropertyLocation,
  formatPropertyPrice,
  operationTypeLabels,
  propertyTypeLabels,
} from "./property-formatters";

describe("formatPropertyPrice", () => {
  it("formatea el precio de venta en USD con separador de miles chileno", () => {
    expect(formatPropertyPrice(320000, "USD", "SALE")).toBe("US$320.000");
  });

  it("agrega / mes al precio de arriendo", () => {
    expect(formatPropertyPrice(950, "USD", "RENT")).toBe("US$950 / mes");
  });

  it("redondea los decimales del precio", () => {
    expect(formatPropertyPrice(1250000.6, "USD", "SALE")).toBe("US$1.250.001");
  });
});

describe("formatPropertyLocation", () => {
  it("muestra comuna y ciudad cuando son distintas", () => {
    expect(
      formatPropertyLocation({ commune: "Las Condes", city: "Santiago" }),
    ).toBe("Las Condes, Santiago");
  });

  it("no repite el nombre cuando comuna y ciudad coinciden", () => {
    expect(formatPropertyLocation({ commune: "Temuco", city: "Temuco" })).toBe(
      "Temuco",
    );
  });
});

describe("formatArea", () => {
  it("usa coma decimal y la unidad m²", () => {
    expect(formatArea(98.5)).toBe("98,5 m²");
    expect(formatArea(5000)).toBe("5.000 m²");
  });
});

describe("etiquetas", () => {
  it("tiene una etiqueta en español para cada operación y tipo", () => {
    expect(Object.keys(operationTypeLabels)).toEqual([...operationTypes]);
    expect(Object.keys(propertyTypeLabels)).toEqual([...propertyTypes]);
    expect(operationTypeLabels.SALE).toBe("Venta");
    expect(operationTypeLabels.RENT).toBe("Arriendo");
  });
});
