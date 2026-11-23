import type {
  Currency,
  OperationType,
  PropertyType,
} from "@portal/shared/types/property";

export const operationTypeLabels: Record<OperationType, string> = {
  SALE: "Venta",
  RENT: "Arriendo",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  HOUSE: "Casa",
  APARTMENT: "Departamento",
  LAND: "Terreno",
  OFFICE: "Oficina",
  COMMERCIAL: "Local comercial",
  OTHER: "Otro",
};

const locale = "es-CL";

/** Ejemplo: "US$320.000" en venta o "US$950 / mes" en arriendo. */
export function formatPropertyPrice(
  price: number,
  currency: Currency,
  operationType: OperationType,
): string {
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

  return operationType === "RENT" ? `${formattedPrice} / mes` : formattedPrice;
}

/** Ejemplo: "Las Condes, Santiago"; si comuna y ciudad coinciden, "Temuco". */
export function formatPropertyLocation(location: {
  commune: string;
  city: string;
}): string {
  return location.commune === location.city
    ? location.commune
    : `${location.commune}, ${location.city}`;
}

/** Ejemplo: "98,5 m²". */
export function formatArea(squareMeters: number): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(squareMeters)} m²`;
}
