import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("muestra el encabezado principal del portal", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Portal Inmobiliario" }),
    ).toBeInTheDocument();
  });
});
