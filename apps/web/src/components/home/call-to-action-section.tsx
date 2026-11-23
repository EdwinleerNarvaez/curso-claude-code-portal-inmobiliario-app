import Link from "next/link";

import { loginNavigationLink } from "@/components/layout/navigation-links";
import { buildCatalogUrl } from "@/lib/property-urls";

const callToActionCards = [
  {
    title: "¿Quieres comprar?",
    description:
      "Revisa casas, departamentos, terrenos y oficinas disponibles para la venta.",
    href: buildCatalogUrl({ operation: "SALE" }),
    linkLabel: "Ver propiedades en venta",
  },
  {
    title: "¿Buscas arriendo?",
    description:
      "Encuentra departamentos, casas y locales en arriendo en distintas comunas.",
    href: buildCatalogUrl({ operation: "RENT" }),
    linkLabel: "Ver propiedades en arriendo",
  },
] as const;

export function CallToActionSection() {
  return (
    <section
      aria-labelledby="call-to-action-heading"
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          id="call-to-action-heading"
          className="text-center text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Da el siguiente paso
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {callToActionCards.map((callToActionCard) => (
            <div
              key={callToActionCard.title}
              className="flex flex-col rounded-xl border border-zinc-200 bg-background p-6 dark:border-zinc-800"
            >
              <h3 className="text-lg font-semibold">{callToActionCard.title}</h3>
              <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                {callToActionCard.description}
              </p>
              <Link
                href={callToActionCard.href}
                className="mt-4 self-start rounded-md text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 dark:text-emerald-400"
              >
                {callToActionCard.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}

          <div className="flex flex-col rounded-xl bg-emerald-700 p-6 text-white">
            <h3 className="text-lg font-semibold">
              Guarda tus propiedades favoritas
            </h3>
            <p className="mt-2 flex-1 text-sm text-emerald-50">
              Ingresa o crea tu cuenta para guardar propiedades y revisar las
              consultas que has realizado.
            </p>
            <Link
              href={loginNavigationLink.href}
              className="mt-4 self-start rounded-md bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ingresar o crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
