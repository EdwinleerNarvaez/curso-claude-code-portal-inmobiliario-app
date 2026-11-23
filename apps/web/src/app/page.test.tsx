import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import HomePage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function IsolatedCache({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  );
}

const fetchMock = vi.fn(async () =>
  Response.json({
    data: [],
    pagination: { page: 1, pageSize: 3, totalItems: 0, totalPages: 0 },
  }),
);

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockClear();
});

describe("HomePage", () => {
  it("tiene un único encabezado principal en el hero", async () => {
    render(<HomePage />, { wrapper: IsolatedCache });

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Encuentra tu próximo hogar o inversión",
      }),
    ).toBeInTheDocument();
    await screen.findByText("Por ahora no hay propiedades destacadas.");
  });

  it("incluye buscador, secciones de propiedades y llamadas a la acción", async () => {
    render(<HomePage />, { wrapper: IsolatedCache });

    expect(
      screen.getByRole("search", { name: "Buscar propiedades" }),
    ).toBeInTheDocument();
    for (const sectionName of [
      "Propiedades destacadas",
      "Propiedades en venta",
      "Propiedades en arriendo",
      "Da el siguiente paso",
    ]) {
      expect(
        screen.getByRole("region", { name: sectionName }),
      ).toBeInTheDocument();
    }
    await screen.findByText("Por ahora no hay propiedades en arriendo.");
  });

  it("consulta destacadas, venta y arriendo mediante la API REST", async () => {
    render(<HomePage />, { wrapper: IsolatedCache });
    await screen.findByText("Por ahora no hay propiedades en arriendo.");

    const requestedUrls = fetchMock.mock.calls.map(
      (call: unknown[]) => call[0],
    );
    expect(requestedUrls).toEqual(
      expect.arrayContaining([
        "/api/properties?pageSize=6&featured=true",
        "/api/properties?pageSize=3&operation=SALE",
        "/api/properties?pageSize=3&operation=RENT",
      ]),
    );
  });
});
