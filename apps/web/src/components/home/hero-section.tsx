import { PropertySearchForm } from "./property-search-form";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-emerald-100 uppercase">
            Propiedades en todo Chile
          </p>
          <h1
            id="hero-heading"
            className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Encuentra tu próximo hogar o inversión
          </h1>
          <p className="mt-4 text-lg text-emerald-50">
            Casas, departamentos, terrenos y oficinas en venta y arriendo.
            Busca por comuna, ciudad o región y encuentra la propiedad que
            necesitas.
          </p>
        </div>

        <div className="mt-10">
          <PropertySearchForm />
        </div>
      </div>
    </section>
  );
}
