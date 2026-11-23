import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MobileNavigation } from "./mobile-navigation";
import { loginNavigationLink, publicNavigationLinks } from "./navigation-links";

function renderMobileNavigation() {
  render(
    <MobileNavigation
      links={publicNavigationLinks}
      loginLink={loginNavigationLink}
    />,
  );
}

function getMenu() {
  return screen.getByRole("navigation", {
    name: "Navegación principal móvil",
    hidden: true,
  });
}

describe("MobileNavigation", () => {
  it("inicia con el menú cerrado", () => {
    renderMobileNavigation();

    const toggleButton = screen.getByRole("button", { name: "Abrir menú" });

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(toggleButton).toHaveAttribute("aria-controls", getMenu().id);
    expect(getMenu()).toHaveClass("hidden");
  });

  it("abre y cierra el menú con el botón", () => {
    renderMobileNavigation();

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

    const closeButton = screen.getByRole("button", { name: "Cerrar menú" });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    expect(getMenu()).not.toHaveClass("hidden");

    fireEvent.click(closeButton);

    expect(screen.getByRole("button", { name: "Abrir menú" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("muestra todos los enlaces públicos y el enlace para ingresar", () => {
    renderMobileNavigation();
    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

    for (const link of [...publicNavigationLinks, loginNavigationLink]) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      );
    }
  });

  it("cierra el menú al seleccionar un enlace", () => {
    renderMobileNavigation();
    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

    const propertiesLink = screen.getByRole("link", { name: "Propiedades" });
    // jsdom no implementa la navegación entre documentos.
    propertiesLink.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(propertiesLink);

    expect(getMenu()).toHaveClass("hidden");
  });

  it("cierra el menú con la tecla Escape", () => {
    renderMobileNavigation();
    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

    fireEvent.keyDown(screen.getByRole("button", { name: "Cerrar menú" }), {
      key: "Escape",
    });

    expect(getMenu()).toHaveClass("hidden");
  });
});
