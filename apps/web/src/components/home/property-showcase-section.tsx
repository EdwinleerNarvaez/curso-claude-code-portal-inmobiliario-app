"use client";

import Link from "next/link";
import { useId } from "react";

import {
  PropertyCard,
  PropertyCardSkeleton,
} from "@/components/properties/property-card";
import { usePublicProperties } from "@/hooks/use-public-properties";
import type { PublicPropertiesApiQuery } from "@/lib/property-urls";

type PropertyShowcaseSectionProps = {
  title: string;
  description: string;
  query: PublicPropertiesApiQuery;
  viewAllHref: string;
  viewAllLabel: string;
  emptyMessage: string;
};

export function PropertyShowcaseSection({
  title,
  description,
  query,
  viewAllHref,
  viewAllLabel,
  emptyMessage,
}: PropertyShowcaseSectionProps) {
  const headingIdentifier = useId();
  const { properties, error, isLoading, retry } = usePublicProperties(query);
  const skeletonCount = query.pageSize ?? 3;

  return (
    <section
      aria-labelledby={headingIdentifier}
      aria-busy={isLoading}
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id={headingIdentifier}
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
        <Link
          href={viewAllHref}
          className="shrink-0 rounded-md text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 dark:text-emerald-400"
        >
          {viewAllLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: skeletonCount }, (_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
            <span className="sr-only">Cargando propiedades…</span>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          >
            <p>{error.message}</p>
            <button
              type="button"
              onClick={retry}
              className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : properties.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            {emptyMessage}
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <li key={property.id} className="flex">
                <div className="flex-1">
                  <PropertyCard property={property} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
