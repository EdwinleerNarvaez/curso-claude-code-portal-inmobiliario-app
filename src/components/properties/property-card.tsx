import Image from "next/image";
import Link from "next/link";

import {
  formatPropertyLocation,
  formatPropertyPrice,
  operationTypeLabels,
} from "@/lib/property-formatters";
import { buildPropertyDetailUrl } from "@/lib/property-urls";
import type { PropertySummary } from "@/types/property";

type PropertyCardProps = {
  property: PropertySummary;
};

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-10"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </svg>
      <span className="text-xs font-medium">Sin fotografía</span>
    </div>
  );
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-background shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-emerald-600 hover:shadow-md dark:border-zinc-800">
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.mainImage ? (
          <Image
            src={property.mainImage.url}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
          {operationTypeLabels[property.operationType]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
          {formatPropertyPrice(
            property.price,
            property.currency,
            property.operationType,
          )}
        </p>
        <h3 className="text-base leading-snug font-semibold">
          <Link
            href={buildPropertyDetailUrl(property.id)}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {property.title}
          </Link>
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatPropertyLocation(property)}
        </p>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
    >
      <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
