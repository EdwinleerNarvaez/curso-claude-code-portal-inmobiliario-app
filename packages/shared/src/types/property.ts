// Valores de dominio compartidos entre backend y frontend.
// Deben coincidir con los enums de apps/api/prisma/schema.prisma (lo verifica
// apps/api/src/repositories/domain-enumerations.test.ts).

export const operationTypes = ["SALE", "RENT"] as const;
export type OperationType = (typeof operationTypes)[number];

export const propertyTypes = [
  "HOUSE",
  "APARTMENT",
  "LAND",
  "OFFICE",
  "COMMERCIAL",
  "OTHER",
] as const;
export type PropertyType = (typeof propertyTypes)[number];

export const currencies = ["USD"] as const;
export type Currency = (typeof currencies)[number];

/** Filtros admitidos por el catálogo público. Un valor undefined no filtra. */
export type PublicPropertyFilters = {
  operationType?: OperationType;
  isFeatured?: boolean;
};

// ---------------------------------------------------------------------------
// Representaciones públicas devueltas por la API REST.
// Las fechas viajan como texto ISO 8601 y los decimales como number.
// ---------------------------------------------------------------------------

export type PropertyImage = {
  id: string;
  url: string;
  position: number;
  isMain: boolean;
};

export type PropertyFeature = {
  id: string;
  name: string;
};

/** Datos necesarios para una tarjeta del catálogo. */
export type PropertySummary = {
  id: string;
  title: string;
  operationType: OperationType;
  propertyType: PropertyType;
  price: number;
  currency: Currency;
  usableArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  commune: string;
  city: string;
  region: string;
  isFeatured: boolean;
  mainImage: Pick<PropertyImage, "url"> | null;
  createdAt: string;
};

/** Información completa para la página de detalle. */
export type PropertyDetail = Omit<PropertySummary, "mainImage"> & {
  description: string;
  totalArea: number | null;
  parkingSpaces: number | null;
  ageInYears: number | null;
  address: string;
  images: PropertyImage[];
  features: PropertyFeature[];
  updatedAt: string;
};
