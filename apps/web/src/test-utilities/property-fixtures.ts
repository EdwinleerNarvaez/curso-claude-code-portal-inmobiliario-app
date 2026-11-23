import type { PropertySummary } from "@portal/shared/types/property";

/** Propiedad de ejemplo para pruebas de componentes. */
export function createPropertySummary(
  overrides: Partial<PropertySummary> = {},
): PropertySummary {
  return {
    id: "5eed0000-0000-7000-8000-000000000001",
    title: "Departamento de 3 dormitorios en Las Condes",
    operationType: "SALE",
    propertyType: "APARTMENT",
    price: 320000,
    currency: "USD",
    usableArea: 98,
    bedrooms: 3,
    bathrooms: 2,
    commune: "Las Condes",
    city: "Santiago",
    region: "Región Metropolitana",
    isFeatured: true,
    mainImage: null,
    createdAt: "2026-11-20T12:00:00.000Z",
    ...overrides,
  };
}
