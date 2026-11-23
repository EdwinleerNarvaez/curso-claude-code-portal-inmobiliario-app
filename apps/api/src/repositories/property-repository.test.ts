// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { Prisma } from "@/generated/prisma/client";

import {
  buildPublicPropertyWhere,
  createPropertyRepository,
  mapPropertyDetail,
  mapPropertySummary,
  type PropertyDatabaseClient,
  type PropertyDetailRecord,
  type PropertySummaryRecord,
} from "./property-repository";

const createdAt = new Date("2026-11-20T12:00:00.000Z");
const updatedAt = new Date("2026-11-21T08:30:00.000Z");

function createSummaryRecord(
  overrides: Partial<PropertySummaryRecord> = {},
): PropertySummaryRecord {
  return {
    id: "5eed0000-0000-7000-8000-000000000001",
    title: "Departamento en Las Condes",
    operationType: "SALE",
    propertyType: "APARTMENT",
    price: new Prisma.Decimal("320000.50"),
    currency: "USD",
    usableArea: new Prisma.Decimal("98.25"),
    bedrooms: 3,
    bathrooms: 2,
    commune: "Las Condes",
    city: "Santiago",
    region: "Región Metropolitana",
    isFeatured: true,
    createdAt,
    images: [{ url: "https://res.cloudinary.com/demo/principal.jpg" }],
    ...overrides,
  };
}

function createDetailRecord(): PropertyDetailRecord {
  return {
    id: "5eed0000-0000-7000-8000-000000000006",
    title: "Terreno en Chicureo",
    description: "Terreno plano con factibilidad de agua y luz.",
    operationType: "SALE",
    propertyType: "LAND",
    price: new Prisma.Decimal("210000"),
    currency: "USD",
    usableArea: null,
    totalArea: new Prisma.Decimal("5000"),
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    ageInYears: null,
    address: "Camino Chicureo 3200",
    commune: "Colina",
    city: "Colina",
    region: "Región Metropolitana",
    isFeatured: false,
    createdAt,
    updatedAt,
    images: [
      {
        id: "00000000-0000-7000-8000-000000000301",
        url: "https://res.cloudinary.com/demo/uno.jpg",
        position: 0,
        isMain: true,
      },
    ],
    features: [
      { feature: { id: "00000000-0000-7000-8000-000000000201", name: "Jardín" } },
    ],
  };
}

function createFakeDatabaseClient(results: {
  findMany?: unknown;
  count?: number;
  findFirst?: unknown;
}) {
  const property = {
    findMany: vi.fn().mockResolvedValue(results.findMany ?? []),
    count: vi.fn().mockResolvedValue(results.count ?? 0),
    findFirst: vi.fn().mockResolvedValue(results.findFirst ?? null),
  };

  return {
    property,
    databaseClient: { property } as unknown as PropertyDatabaseClient,
  };
}

describe("mapPropertySummary", () => {
  it("convierte decimales, fechas e imagen principal a tipos JSON", () => {
    expect(mapPropertySummary(createSummaryRecord())).toEqual({
      id: "5eed0000-0000-7000-8000-000000000001",
      title: "Departamento en Las Condes",
      operationType: "SALE",
      propertyType: "APARTMENT",
      price: 320000.5,
      currency: "USD",
      usableArea: 98.25,
      bedrooms: 3,
      bathrooms: 2,
      commune: "Las Condes",
      city: "Santiago",
      region: "Región Metropolitana",
      isFeatured: true,
      mainImage: { url: "https://res.cloudinary.com/demo/principal.jpg" },
      createdAt: "2026-11-20T12:00:00.000Z",
    });
  });

  it("devuelve mainImage nulo y superficie nula cuando no existen", () => {
    const summary = mapPropertySummary(
      createSummaryRecord({ images: [], usableArea: null }),
    );

    expect(summary.mainImage).toBeNull();
    expect(summary.usableArea).toBeNull();
  });
});

describe("mapPropertyDetail", () => {
  it("incluye imágenes, características y campos opcionales nulos", () => {
    expect(mapPropertyDetail(createDetailRecord())).toEqual({
      id: "5eed0000-0000-7000-8000-000000000006",
      title: "Terreno en Chicureo",
      description: "Terreno plano con factibilidad de agua y luz.",
      operationType: "SALE",
      propertyType: "LAND",
      price: 210000,
      currency: "USD",
      usableArea: null,
      totalArea: 5000,
      bedrooms: null,
      bathrooms: null,
      parkingSpaces: null,
      ageInYears: null,
      address: "Camino Chicureo 3200",
      commune: "Colina",
      city: "Colina",
      region: "Región Metropolitana",
      isFeatured: false,
      images: [
        {
          id: "00000000-0000-7000-8000-000000000301",
          url: "https://res.cloudinary.com/demo/uno.jpg",
          position: 0,
          isMain: true,
        },
      ],
      features: [{ id: "00000000-0000-7000-8000-000000000201", name: "Jardín" }],
      createdAt: "2026-11-20T12:00:00.000Z",
      updatedAt: "2026-11-21T08:30:00.000Z",
    });
  });
});

describe("buildPublicPropertyWhere", () => {
  it("siempre exige propiedades publicadas", () => {
    expect(buildPublicPropertyWhere({})).toEqual({ isPublished: true });
  });

  it("agrega solo los filtros definidos", () => {
    expect(buildPublicPropertyWhere({ operationType: "SALE" })).toEqual({
      isPublished: true,
      operationType: "SALE",
    });
    expect(buildPublicPropertyWhere({ isFeatured: false })).toEqual({
      isPublished: true,
      isFeatured: false,
    });
  });
});

describe("createPropertyRepository", () => {
  it("lista solo propiedades publicadas, ordenadas y paginadas", async () => {
    const { property, databaseClient } = createFakeDatabaseClient({
      findMany: [createSummaryRecord()],
    });

    const properties = await createPropertyRepository(
      databaseClient,
    ).findPublishedProperties({ filters: {}, skip: 12, take: 12 });

    expect(properties).toHaveLength(1);
    expect(properties[0]?.price).toBe(320000.5);
    expect(property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublished: true },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: 12,
        take: 12,
      }),
    );
  });

  it("aplica los filtros de operación y destacada en el listado", async () => {
    const { property, databaseClient } = createFakeDatabaseClient({});

    await createPropertyRepository(databaseClient).findPublishedProperties({
      filters: { operationType: "RENT", isFeatured: true },
      skip: 0,
      take: 6,
    });

    expect(property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isPublished: true, operationType: "RENT", isFeatured: true },
      }),
    );
  });

  it("cuenta solo propiedades publicadas que cumplen los filtros", async () => {
    const { property, databaseClient } = createFakeDatabaseClient({ count: 8 });

    await expect(
      createPropertyRepository(databaseClient).countPublishedProperties({
        operationType: "SALE",
      }),
    ).resolves.toBe(8);
    expect(property.count).toHaveBeenCalledWith({
      where: { isPublished: true, operationType: "SALE" },
    });
  });

  it("busca el detalle por id exigiendo que esté publicada", async () => {
    const { property, databaseClient } = createFakeDatabaseClient({
      findFirst: createDetailRecord(),
    });

    const detail = await createPropertyRepository(
      databaseClient,
    ).findPublishedPropertyById("5eed0000-0000-7000-8000-000000000006");

    expect(detail?.title).toBe("Terreno en Chicureo");
    expect(property.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          isPublished: true,
          id: "5eed0000-0000-7000-8000-000000000006",
        },
      }),
    );
  });

  it("devuelve null cuando no encuentra una propiedad publicada", async () => {
    const { databaseClient } = createFakeDatabaseClient({ findFirst: null });

    await expect(
      createPropertyRepository(databaseClient).findPublishedPropertyById(
        "5eed0000-0000-7000-8000-000000000012",
      ),
    ).resolves.toBeNull();
  });
});
