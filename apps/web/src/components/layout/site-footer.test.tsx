import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("se identifica como contenido de pie de página", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("incluye los enlaces para explorar propiedades", () => {
    render(<SiteFooter />);

    const exploreNavigation = screen.getByRole("navigation", {
      name: "Explorar propiedades",
    });

    expect(
      within(exploreNavigation)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual([
      "/",
      "/properties",
      "/properties?operation=SALE",
      "/properties?operation=RENT",
    ]);
  });

  it("incluye el enlace para ingresar", () => {
    render(<SiteFooter />);

    const accountNavigation = screen.getByRole("navigation", {
      name: "Cuenta",
    });

    expect(
      within(accountNavigation).getByRole("link", { name: "Ingresar" }),
    ).toHaveAttribute("href", "/login");
  });
});
