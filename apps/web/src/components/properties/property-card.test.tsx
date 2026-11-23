import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createPropertySummary } from "@/test-utilities/property-fixtures";

import { PropertyCard } from "./property-card";

describe("PropertyCard", () => {
  it("muestra precio, operación, título y ubicación", () => {
    render(<PropertyCard property={createPropertySummary()} />);

    expect(screen.getByText("US$320.000")).toBeInTheDocument();
    expect(screen.getByText("Venta")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Departamento de 3 dormitorios en Las Condes",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Las Condes, Santiago")).toBeInTheDocument();
  });

  it("enlaza el título con el detalle de la propiedad", () => {
    render(<PropertyCard property={createPropertySummary()} />);

    expect(
      screen.getByRole("link", {
        name: "Departamento de 3 dormitorios en Las Condes",
      }),
    ).toHaveAttribute(
      "href",
      "/properties/5eed0000-0000-7000-8000-000000000001",
    );
  });

  it("muestra el precio mensual en arriendo", () => {
    render(
      <PropertyCard
        property={createPropertySummary({ operationType: "RENT", price: 950 })}
      />,
    );

    expect(screen.getByText("Arriendo")).toBeInTheDocument();
    expect(screen.getByText("US$950 / mes")).toBeInTheDocument();
  });

  it("muestra un marcador cuando no hay imagen principal", () => {
    render(<PropertyCard property={createPropertySummary()} />);

    expect(screen.getByText("Sin fotografía")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("muestra la imagen principal con texto alternativo", () => {
    render(
      <PropertyCard
        property={createPropertySummary({
          mainImage: { url: "https://res.cloudinary.com/demo/casa.jpg" },
        })}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Departamento de 3 dormitorios en Las Condes",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Sin fotografía")).not.toBeInTheDocument();
  });
});
