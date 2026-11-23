import "server-only";

import { NotFoundError } from "@/lib/application-errors";
import { getPrismaClient } from "@/repositories/prisma-client";
import {
  createPropertyRepository,
  type PropertyRepository,
} from "@/repositories/property-repository";
import type { PaginatedResult, PaginationRequest } from "@/types/pagination";
import type {
  PropertyDetail,
  PropertySummary,
  PublicPropertyFilters,
} from "@/types/property";

export type PublicPropertyListRequest = PaginationRequest & {
  filters: PublicPropertyFilters;
};

export type PropertyService = {
  listPublishedProperties(
    listRequest: PublicPropertyListRequest,
  ): Promise<PaginatedResult<PropertySummary>>;
  getPublishedPropertyById(propertyId: string): Promise<PropertyDetail>;
};

export function createPropertyService(
  propertyRepository: PropertyRepository,
): PropertyService {
  return {
    async listPublishedProperties({ page, pageSize, filters }) {
      const [properties, totalItems] = await Promise.all([
        propertyRepository.findPublishedProperties({
          filters,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        propertyRepository.countPublishedProperties(filters),
      ]);

      return {
        data: properties,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      };
    },

    async getPublishedPropertyById(propertyId) {
      const property =
        await propertyRepository.findPublishedPropertyById(propertyId);

      // Una propiedad no publicada se trata igual que una inexistente para no
      // revelar borradores.
      if (!property) {
        throw new NotFoundError("Propiedad no encontrada");
      }

      return property;
    },
  };
}

let propertyServiceInstance: PropertyService | undefined;

/** Instancia por defecto conectada a PostgreSQL. */
export function getPropertyService(): PropertyService {
  propertyServiceInstance ??= createPropertyService(
    createPropertyRepository(getPrismaClient()),
  );

  return propertyServiceInstance;
}
