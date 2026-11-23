import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  PropertySearchForm,
  readCatalogSearchValues,
} from "./property-search-form";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  push.mockReset();
});

describe("PropertySearchForm", () => {
  it("tiene campos etiquetados para búsqueda, operación y tipo", () => {
    render(<PropertySearchForm />);

    expect(
      screen.getByRole("search", { name: "Buscar propiedades" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("¿Dónde buscas?")).toBeInTheDocument();
    expect(screen.getByLabelText("Operación")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo de propiedad")).toBeInTheDocument();
  });

  it("navega al catálogo con la búsqueda y los filtros elegidos", () => {
    render(<PropertySearchForm />);

    fireEvent.change(screen.getByLabelText("¿Dónde buscas?"), {
      target: { value: "Providencia" },
    });
    fireEvent.change(screen.getByLabelText("Operación"), {
      target: { value: "RENT" },
    });
    fireEvent.change(screen.getByLabelText("Tipo de propiedad"), {
      target: { value: "APARTMENT" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    expect(push).toHaveBeenCalledWith(
      "/properties?search=Providencia&operation=RENT&type=APARTMENT",
    );
  });

  it("navega a /properties sin parámetros vacíos", () => {
    render(<PropertySearchForm />);

    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));

    expect(push).toHaveBeenCalledWith("/properties");
  });
});

describe("readCatalogSearchValues", () => {
  it("descarta operaciones y tipos que no existen en el dominio", () => {
    const formData = new FormData();
    formData.set("search", "Viña");
    formData.set("operation", "LEASE");
    formData.set("type", "CASTLE");

    expect(readCatalogSearchValues(formData)).toEqual({
      search: "Viña",
      operation: "",
      type: "",
    });
  });
});
