import { describe, expect, it } from "vitest";

import { cn } from "./class-names";

describe("cn", () => {
  it("combina clases e ignora valores falsos", () => {
    const isHidden = false;

    expect(cn("block", isHidden && "hidden", undefined, "px-2")).toBe(
      "block px-2",
    );
  });

  it("resuelve conflictos de Tailwind dejando la última clase", () => {
    expect(cn("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });
});
