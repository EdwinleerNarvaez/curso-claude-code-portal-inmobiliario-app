import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createPropertySummary } from "@/test-utilities/property-fixtures";

import { PropertyShowcaseSection } from "./property-showcase-section";

function IsolatedCache({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  );
}

function renderSection() {
  return render(
    <PropertyShowcaseSection
      title="Propiedades en venta"
      description="Las publicaciones más recientes para comprar."
      query={{ operation: "SALE", pageSize: 3 }}
      viewAllHref="/properties?operation=SALE"
      viewAllLabel="Ver todas en venta"
      emptyMessage="Por ahora no hay propiedades en venta."
    />,
    { wrapper: IsolatedCache },
  );
}

function paginatedResponse(itemCount: number) {
  return Response.json({
    data: Array.from({ length: itemCount }, (_, index) =>
      createPropertySummary({
        id: `5eed0000-0000-7000-8000-00000000000${index + 1}`,
        title: `Propiedad ${index + 1}`,
      }),
    ),
    pagination: {
      page: 1,
      pageSize: 3,
      totalItems: itemCount,
      totalPages: 1,
    },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PropertyShowcaseSection", () => {
  it("consulta la API REST con los filtros de la sección", async () => {
    const fetchMock = vi.fn(async () => paginatedResponse(0));
    vi.stubGlobal("fetch", fetchMock);

    renderSection();
    await screen.findByText("Por ahora no hay propiedades en venta.");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/properties?pageSize=3&operation=SALE",
      expect.anything(),
    );
  });

  it("muestra el estado de carga y luego las tarjetas", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => paginatedResponse(2)));

    renderSection();

    expect(screen.getByText("Cargando propiedades…")).toBeInTheDocument();
    expect(await screen.findByText("Propiedad 1")).toBeInTheDocument();
    expect(screen.getByText("Propiedad 2")).toBeInTheDocument();
    expect(screen.queryByText("Cargando propiedades…")).not.toBeInTheDocument();
  });

  it("muestra el encabezado y el enlace para ver todas", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => paginatedResponse(1)));

    renderSection();

    expect(
      screen.getByRole("region", { name: "Propiedades en venta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Ver todas en venta/ }),
    ).toHaveAttribute("href", "/properties?operation=SALE");
    await screen.findByText("Propiedad 1");
  });

  it("muestra un mensaje cuando no hay propiedades", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => paginatedResponse(0)));

    renderSection();

    expect(
      await screen.findByText("Por ahora no hay propiedades en venta."),
    ).toBeInTheDocument();
  });

  it("muestra el error y permite reintentar", async () => {
    const fetchMock = vi
      .fn<() => Promise<Response>>()
      .mockResolvedValueOnce(
        Response.json(
          { message: "Error interno del servidor", status: 500 },
          { status: 500 },
        ),
      )
      .mockResolvedValueOnce(paginatedResponse(1));
    vi.stubGlobal("fetch", fetchMock);

    renderSection();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error interno del servidor",
    );

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Propiedad 1")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
