// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { NotFoundError } from "@/lib/application-errors";
import type { PropertyRepository } from "@/repositories/property-repository";
import type { PropertyDetail, PropertySummary } from "@/types/property";

import { createPropertyService } from "./property-service";

const propertySummary: PropertySummary = {
  id: "5eed0000-0000-7000-8000-000000000001",
  title: "Departamento en Las Condes",
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
};

const propertyDetail: PropertyDetail = {
  ...propertySummary,
  description: "Amplio departamento con terraza.",
  totalArea: 110,
  parkingSpaces: 1,
  ageInYears: 8,
  address: "Av. Apoquindo 4500",
  images: [],
  features: [],
  updatedAt: "2026-11-21T08:30:00.000Z",
};

function createFakeRepository(
  overrides: Partial<PropertyRepository> = {},
): PropertyRepository {
  return {
    findPublishedProperties: vi.fn().mockResolvedValue([propertySummary]),
    countPublishedProperties: vi.fn().mockResolvedValue(25),
    findPublishedPropertyById: vi.fn().mockResolvedValue(propertyDetail),
    ...overrides,
  };
}

describe("createPropertyService", () => {
  describe("listPublishedProperties", () => {
    it("calcula el desplazamiento según la página solicitada", async () => {
      const propertyRepository = createFakeRepository();

      await createPropertyService(propertyRepository).listPublishedProperties({
        page: 3,
        pageSize: 10,
        filters: {},
      });

      expect(propertyRepository.findPublishedProperties).toHaveBeenCalledWith({
        filters: {},
        skip: 20,
        take: 10,
      });
    });

    it("usa los mismos filtros para listar y para contar", async () => {
      const propertyRepository = createFakeRepository();
      const filters = { operationType: "RENT" as const, isFeatured: true };

      await createPropertyService(propertyRepository).listPublishedProperties({
        page: 1,
        pageSize: 6,
        filters,
      });

      expect(propertyRepository.findPublishedProperties).toHaveBeenCalledWith({
        filters,
        skip: 0,
        take: 6,
      });
      expect(propertyRepository.countPublishedProperties).toHaveBeenCalledWith(
        filters,
      );
    });

    it("devuelve los datos con la información de paginación", async () => {
      const result = await createPropertyService(
        createFakeRepository(),
      ).listPublishedProperties({ page: 1, pageSize: 12, filters: {} });

      expect(result).toEqual({
        data: [propertySummary],
        pagination: { page: 1, pageSize: 12, totalItems: 25, totalPages: 3 },
      });
    });

    it("devuelve cero páginas cuando no hay propiedades publicadas", async () => {
      const result = await createPropertyService(
        createFakeRepository({
          findPublishedProperties: vi.fn().mockResolvedValue([]),
          countPublishedProperties: vi.fn().mockResolvedValue(0),
        }),
      ).listPublishedProperties({ page: 1, pageSize: 12, filters: {} });

      expect(result).toEqual({
        data: [],
        pagination: { page: 1, pageSize: 12, totalItems: 0, totalPages: 0 },
      });
    });
  });

  describe("getPublishedPropertyById", () => {
    it("devuelve el detalle de una propiedad publicada", async () => {
      await expect(
        createPropertyService(createFakeRepository()).getPublishedPropertyById(
          propertyDetail.id,
        ),
      ).resolves.toEqual(propertyDetail);
    });

    it("lanza NotFoundError cuando la propiedad no existe o no está publicada", async () => {
      const propertyService = createPropertyService(
        createFakeRepository({
          findPublishedPropertyById: vi.fn().mockResolvedValue(null),
        }),
      );

      await expect(
        propertyService.getPublishedPropertyById(
          "5eed0000-0000-7000-8000-000000000012",
        ),
      ).rejects.toThrow(new NotFoundError("Propiedad no encontrada"));
    });
  });
});
