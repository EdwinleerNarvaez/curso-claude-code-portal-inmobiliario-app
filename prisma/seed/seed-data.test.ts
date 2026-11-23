// @vitest-environment node
import { describe, expect, it } from "vitest";

import { operationTypes, propertyTypes } from "@/types/property";

import { seedFeatureNames } from "./seed-features";
import { seedProperties } from "./seed-properties";

const publishedProperties = seedProperties.filter(
  (property) => property.isPublished,
);

describe("datos del seed", () => {
  it("incluye las características de la especificación sin duplicados", () => {
    expect(new Set(seedFeatureNames).size).toBe(seedFeatureNames.length);
    expect(seedFeatureNames).toEqual(
      expect.arrayContaining([
        "Piscina",
        "Gimnasio",
        "Quincho",
        "Lavandería",
        "Jardín",
        "Terraza",
        "Bodega",
        "Ascensor",
        "Conserjería",
        "Seguridad",
        "Calefacción",
        "Aire acondicionado",
        "Pet friendly",
      ]),
    );
  });

  it("usa identificadores únicos con formato UUID", () => {
    const identifiers = seedProperties.map((property) => property.id);

    expect(new Set(identifiers).size).toBe(identifiers.length);
    for (const identifier of identifiers) {
      expect(identifier).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    }
  });

  it("publica propiedades en venta y en arriendo", () => {
    const publishedOperations = new Set(
      publishedProperties.map((property) => property.operationType),
    );

    expect([...publishedOperations].sort()).toEqual([...operationTypes].sort());
  });

  it("publica casas, departamentos, terrenos y oficinas", () => {
    const publishedTypes = new Set(
      publishedProperties.map((property) => property.propertyType),
    );

    for (const propertyType of ["HOUSE", "APARTMENT", "LAND", "OFFICE"]) {
      expect(publishedTypes).toContain(propertyType);
    }
    for (const propertyType of publishedTypes) {
      expect(propertyTypes).toContain(propertyType);
    }
  });

  it("cubre distintas comunas, ciudades y regiones", () => {
    const communes = new Set(seedProperties.map((property) => property.commune));
    const cities = new Set(seedProperties.map((property) => property.city));
    const regions = new Set(seedProperties.map((property) => property.region));

    expect(communes.size).toBeGreaterThanOrEqual(10);
    expect(cities.size).toBeGreaterThanOrEqual(5);
    expect(regions.size).toBeGreaterThanOrEqual(5);
  });

  it("tiene precios realistas en USD para venta y arriendo mensual", () => {
    for (const property of seedProperties) {
      if (property.operationType === "SALE") {
        expect(property.price).toBeGreaterThanOrEqual(50_000);
        expect(property.price).toBeLessThanOrEqual(5_000_000);
      } else {
        expect(property.price).toBeGreaterThanOrEqual(200);
        expect(property.price).toBeLessThanOrEqual(10_000);
      }
    }

    const distinctPrices = new Set(
      seedProperties.map((property) => property.price),
    );
    expect(distinctPrices.size).toBe(seedProperties.length);
  });

  it("asigna características existentes y variadas", () => {
    const usedFeatures = new Set<string>();

    for (const property of seedProperties) {
      expect(new Set(property.featureNames).size).toBe(
        property.featureNames.length,
      );
      for (const featureName of property.featureNames) {
        expect(seedFeatureNames).toContain(featureName);
        usedFeatures.add(featureName);
      }
    }

    expect(usedFeatures.size).toBe(seedFeatureNames.length);
  });

  it("deja sin dormitorios ni baños a los terrenos y les asigna superficie total", () => {
    const landProperties = seedProperties.filter(
      (property) => property.propertyType === "LAND",
    );

    expect(landProperties.length).toBeGreaterThan(0);
    for (const landProperty of landProperties) {
      expect(landProperty.bedrooms).toBeNull();
      expect(landProperty.bathrooms).toBeNull();
      expect(landProperty.totalArea).toBeGreaterThan(0);
    }
  });

  it("mantiene la superficie útil menor o igual a la total", () => {
    for (const property of seedProperties) {
      if (property.usableArea !== null && property.totalArea !== null) {
        expect(property.usableArea).toBeLessThanOrEqual(property.totalArea);
      }
    }
  });

  it("incluye propiedades destacadas y borradores no publicados", () => {
    expect(
      publishedProperties.some((property) => property.isFeatured),
    ).toBe(true);
    expect(seedProperties.some((property) => !property.isPublished)).toBe(true);
    expect(
      seedProperties.some(
        (property) => !property.isPublished && property.isFeatured,
      ),
    ).toBe(false);
  });

  it("tiene título, descripción y dirección completos", () => {
    for (const property of seedProperties) {
      expect(property.title.trim()).not.toBe("");
      expect(property.description.length).toBeGreaterThan(50);
      expect(property.address.trim()).not.toBe("");
    }
  });
});
