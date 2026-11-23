import type { PrismaClient } from "@/generated/prisma/client";
import type {
  PropertyGetPayload,
  PropertySelect,
  PropertyWhereInput,
} from "@/generated/prisma/models";
import type {
  PropertyDetail,
  PropertySummary,
  PublicPropertyFilters,
} from "@/types/property";

// Toda consulta pública debe incluir este filtro (spec.md, sección 8).
const publishedPropertyFilter = {
  isPublished: true,
} satisfies PropertyWhereInput;

/** Construye el where público. Prisma ignora las claves con valor undefined. */
export function buildPublicPropertyWhere(
  filters: PublicPropertyFilters,
): PropertyWhereInput {
  return {
    ...publishedPropertyFilter,
    operationType: filters.operationType,
    isFeatured: filters.isFeatured,
  };
}

const propertySummarySelect = {
  id: true,
  title: true,
  operationType: true,
  propertyType: true,
  price: true,
  currency: true,
  usableArea: true,
  bedrooms: true,
  bathrooms: true,
  commune: true,
  city: true,
  region: true,
  isFeatured: true,
  createdAt: true,
  // Imagen principal o, si no hay ninguna marcada, la primera según su posición.
  images: {
    select: { url: true },
    orderBy: [{ isMain: "desc" }, { position: "asc" }],
    take: 1,
  },
} satisfies PropertySelect;

const propertyDetailSelect = {
  id: true,
  title: true,
  description: true,
  operationType: true,
  propertyType: true,
  price: true,
  currency: true,
  usableArea: true,
  totalArea: true,
  bedrooms: true,
  bathrooms: true,
  parkingSpaces: true,
  ageInYears: true,
  address: true,
  commune: true,
  city: true,
  region: true,
  isFeatured: true,
  createdAt: true,
  updatedAt: true,
  images: {
    select: { id: true, url: true, position: true, isMain: true },
    orderBy: { position: "asc" },
  },
  features: {
    select: { feature: { select: { id: true, name: true } } },
    orderBy: { feature: { name: "asc" } },
  },
} satisfies PropertySelect;

export type PropertySummaryRecord = PropertyGetPayload<{
  select: typeof propertySummarySelect;
}>;

export type PropertyDetailRecord = PropertyGetPayload<{
  select: typeof propertyDetailSelect;
}>;

type DecimalValue = { toNumber(): number };

function decimalToNumber(value: DecimalValue): number {
  return value.toNumber();
}

function optionalDecimalToNumber(value: DecimalValue | null): number | null {
  return value === null ? null : value.toNumber();
}

export function mapPropertySummary(
  record: PropertySummaryRecord,
): PropertySummary {
  const firstImage = record.images[0];

  return {
    id: record.id,
    title: record.title,
    operationType: record.operationType,
    propertyType: record.propertyType,
    price: decimalToNumber(record.price),
    currency: record.currency,
    usableArea: optionalDecimalToNumber(record.usableArea),
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    commune: record.commune,
    city: record.city,
    region: record.region,
    isFeatured: record.isFeatured,
    mainImage: firstImage ? { url: firstImage.url } : null,
    createdAt: record.createdAt.toISOString(),
  };
}

export function mapPropertyDetail(record: PropertyDetailRecord): PropertyDetail {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    operationType: record.operationType,
    propertyType: record.propertyType,
    price: decimalToNumber(record.price),
    currency: record.currency,
    usableArea: optionalDecimalToNumber(record.usableArea),
    totalArea: optionalDecimalToNumber(record.totalArea),
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    parkingSpaces: record.parkingSpaces,
    ageInYears: record.ageInYears,
    address: record.address,
    commune: record.commune,
    city: record.city,
    region: record.region,
    isFeatured: record.isFeatured,
    images: record.images.map((image) => ({
      id: image.id,
      url: image.url,
      position: image.position,
      isMain: image.isMain,
    })),
    features: record.features.map(({ feature }) => ({
      id: feature.id,
      name: feature.name,
    })),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export type PropertyRepository = {
  findPublishedProperties(options: {
    filters: PublicPropertyFilters;
    skip: number;
    take: number;
  }): Promise<PropertySummary[]>;
  countPublishedProperties(filters: PublicPropertyFilters): Promise<number>;
  findPublishedPropertyById(propertyId: string): Promise<PropertyDetail | null>;
};

export type PropertyDatabaseClient = Pick<PrismaClient, "property">;

export function createPropertyRepository(
  databaseClient: PropertyDatabaseClient,
): PropertyRepository {
  return {
    async findPublishedProperties({ filters, skip, take }) {
      const records = await databaseClient.property.findMany({
        where: buildPublicPropertyWhere(filters),
        select: propertySummarySelect,
        // El id desempata propiedades creadas en el mismo instante.
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take,
      });

      return records.map(mapPropertySummary);
    },

    countPublishedProperties(filters) {
      return databaseClient.property.count({
        where: buildPublicPropertyWhere(filters),
      });
    },

    async findPublishedPropertyById(propertyId) {
      const record = await databaseClient.property.findFirst({
        where: { ...publishedPropertyFilter, id: propertyId },
        select: propertyDetailSelect,
      });

      return record ? mapPropertyDetail(record) : null;
    },
  };
}
