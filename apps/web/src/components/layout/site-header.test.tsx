import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "./site-header";

const expectedLinks = [
  { name: "Inicio", href: "/" },
  { name: "Propiedades", href: "/properties" },
  { name: "Comprar", href: "/properties?operation=SALE" },
  { name: "Arrendar", href: "/properties?operation=RENT" },
  { name: "Ingresar", href: "/login" },
];

describe("SiteHeader", () => {
  it("muestra el logo enlazado a la página de inicio", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: "Portal Inmobiliario" }),
    ).toHaveAttribute("href", "/");
  });

  it("muestra la navegación principal con los enlaces públicos en orden", () => {
    render(<SiteHeader />);

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Navegación principal",
    });
    const links = within(desktopNavigation).getAllByRole("link");

    expect(
      links.map((link) => ({
        name: link.textContent,
        href: link.getAttribute("href"),
      })),
    ).toEqual(expectedLinks);
  });
});
