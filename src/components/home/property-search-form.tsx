"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import {
  operationTypeLabels,
  propertyTypeLabels,
} from "@/lib/property-formatters";
import { buildCatalogUrl, type CatalogSearchValues } from "@/lib/property-urls";
import {
  operationTypes,
  propertyTypes,
  type OperationType,
  type PropertyType,
} from "@/types/property";

function isOperationType(value: string): value is OperationType {
  return (operationTypes as readonly string[]).includes(value);
}

function isPropertyType(value: string): value is PropertyType {
  return (propertyTypes as readonly string[]).includes(value);
}

/** Lee el formulario y descarta valores que no pertenezcan al dominio. */
export function readCatalogSearchValues(
  formData: FormData,
): CatalogSearchValues {
  const operation = String(formData.get("operation") ?? "");
  const type = String(formData.get("type") ?? "");

  return {
    search: String(formData.get("search") ?? ""),
    operation: isOperationType(operation) ? operation : "",
    type: isPropertyType(type) ? type : "",
  };
}

const fieldClassName =
  "h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-2 focus:outline-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

const labelClassName =
  "mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300";

export function PropertySearchForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchValues = readCatalogSearchValues(
      new FormData(event.currentTarget),
    );
    router.push(buildCatalogUrl(searchValues));
  }

  return (
    // action/method permiten que el formulario funcione aunque JavaScript no
    // haya cargado; con JavaScript se omiten los parámetros vacíos.
    <form
      action="/properties"
      method="get"
      role="search"
      aria-label="Buscar propiedades"
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-xl bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end dark:bg-zinc-900"
    >
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="property-search-text" className={labelClassName}>
          ¿Dónde buscas?
        </label>
        <input
          id="property-search-text"
          name="search"
          type="search"
          placeholder="Comuna, ciudad, región o palabra clave"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="property-search-operation" className={labelClassName}>
          Operación
        </label>
        <select
          id="property-search-operation"
          name="operation"
          defaultValue=""
          className={fieldClassName}
        >
          <option value="">Comprar o arrendar</option>
          {operationTypes.map((operationType) => (
            <option key={operationType} value={operationType}>
              {operationTypeLabels[operationType]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="property-search-type" className={labelClassName}>
          Tipo de propiedad
        </label>
        <select
          id="property-search-type"
          name="type"
          defaultValue=""
          className={fieldClassName}
        >
          <option value="">Todos los tipos</option>
          {propertyTypes.map((propertyType) => (
            <option key={propertyType} value={propertyType}>
              {propertyTypeLabels[propertyType]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-11 rounded-md bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:col-span-2 lg:col-span-1"
      >
        Buscar
      </button>
    </form>
  );
}
