// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotFoundError } from "@/lib/application-errors";
import type { PropertyService } from "@/services/property-service";
import type { PropertyDetail } from "@/types/property";

import { GET } from "./route";

const getPublishedPropertyById =
  vi.fn<PropertyService["getPublishedPropertyById"]>();

vi.mock("@/services/property-service", () => ({
  getPropertyService: () => ({ getPublishedPropertyById }),
}));

const propertyId = "5eed0000-0000-7000-8000-000000000001";

function callGet(id: string) {
  return GET(new NextRequest(`http://localhost:3000/api/properties/${id}`), {
    params: Promise.resolve({ id }),
  });
}

beforeEach(() => {
  getPublishedPropertyById.mockReset();
});

describe("GET /api/properties/{id}", () => {
  it("responde 200 con el detalle dentro de data", async () => {
    const propertyDetail = { id: propertyId, title: "Departamento" };
    getPublishedPropertyById.mockResolvedValue(
      propertyDetail as PropertyDetail,
    );

    const response = await callGet(propertyId);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: propertyDetail });
    expect(getPublishedPropertyById).toHaveBeenCalledWith(propertyId);
  });

  it("responde 400 cuando el identificador no es un UUID", async () => {
    const response = await callGet("123");

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "El identificador de la propiedad no es válido.",
      status: 400,
    });
    expect(getPublishedPropertyById).not.toHaveBeenCalled();
  });

  it("responde 404 cuando la propiedad no existe o no está publicada", async () => {
    getPublishedPropertyById.mockRejectedValue(
      new NotFoundError("Propiedad no encontrada"),
    );

    const response = await callGet(propertyId);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: "Propiedad no encontrada",
      status: 404,
    });
  });
});
