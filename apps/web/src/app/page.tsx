import { CallToActionSection } from "@/components/home/call-to-action-section";
import { HeroSection } from "@/components/home/hero-section";
import { PropertyShowcaseSection } from "@/components/home/property-showcase-section";
import { buildCatalogUrl } from "@/lib/property-urls";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <PropertyShowcaseSection
        title="Propiedades destacadas"
        description="Una selección de propiedades recomendadas en venta y arriendo."
        query={{ featured: true, pageSize: 6 }}
        viewAllHref={buildCatalogUrl()}
        viewAllLabel="Ver todas las propiedades"
        emptyMessage="Por ahora no hay propiedades destacadas."
      />

      <PropertyShowcaseSection
        title="Propiedades en venta"
        description="Las publicaciones más recientes para comprar."
        query={{ operation: "SALE", pageSize: 3 }}
        viewAllHref={buildCatalogUrl({ operation: "SALE" })}
        viewAllLabel="Ver todas en venta"
        emptyMessage="Por ahora no hay propiedades en venta."
      />

      <PropertyShowcaseSection
        title="Propiedades en arriendo"
        description="Las publicaciones más recientes para arrendar."
        query={{ operation: "RENT", pageSize: 3 }}
        viewAllHref={buildCatalogUrl({ operation: "RENT" })}
        viewAllLabel="Ver todas en arriendo"
        emptyMessage="Por ahora no hay propiedades en arriendo."
      />

      <CallToActionSection />
    </>
  );
}
