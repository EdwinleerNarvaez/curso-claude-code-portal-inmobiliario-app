"use client";

import useSWR from "swr";

import { fetchJson, type ApiClientError } from "@/lib/api-client";
import {
  buildPublicPropertiesApiUrl,
  type PublicPropertiesApiQuery,
} from "@/lib/property-urls";
import type { PaginatedResult } from "@/types/pagination";
import type { PropertySummary } from "@/types/property";

/** Obtiene propiedades publicadas desde GET /api/properties con caché de SWR. */
export function usePublicProperties(query: PublicPropertiesApiQuery) {
  const apiUrl = buildPublicPropertiesApiUrl(query);
  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResult<PropertySummary>,
    ApiClientError
  >(apiUrl, fetchJson);

  return {
    properties: data?.data ?? [],
    pagination: data?.pagination,
    error,
    isLoading,
    retry: () => mutate(),
  };
}
