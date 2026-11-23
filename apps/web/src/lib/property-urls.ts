import type { OperationType, PropertyType } from "@portal/shared/types/property";

export type PublicPropertiesApiQuery = {
  page?: number;
  pageSize?: number;
  operation?: OperationType;
  featured?: boolean;
};

function toQueryString(entries: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined && value.trim() !== "") {
      searchParams.set(key, value.trim());
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/** URL de GET /api/properties con solo los parámetros definidos. */
export function buildPublicPropertiesApiUrl(
  query: PublicPropertiesApiQuery = {},
): string {
  return `/api/properties${toQueryString({
    page: query.page?.toString(),
    pageSize: query.pageSize?.toString(),
    operation: query.operation,
    featured: query.featured?.toString(),
  })}`;
}

export type CatalogSearchValues = {
  search?: string;
  operation?: OperationType | "";
  type?: PropertyType | "";
};

/** URL del catálogo público (/properties) sin parámetros vacíos (spec.md, secciones 9 y 10). */
export function buildCatalogUrl(values: CatalogSearchValues = {}): string {
  return `/properties${toQueryString({
    search: values.search,
    operation: values.operation || undefined,
    type: values.type || undefined,
  })}`;
}

export function buildPropertyDetailUrl(propertyId: string): string {
  return `/properties/${propertyId}`;
}
