// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PropertyService } from "@/services/property-service";

import { GET } from "./route";

const listPublishedProperties =
  vi.fn<PropertyService["listPublishedProperties"]>();

vi.mock("@/services/property-service", () => ({
  getPropertyService: () => ({ listPublishedProperties }),
}));

function createRequest(query = ""): NextRequest {
  return new NextRequest(`http://localhost:3000/api/properties${query}`);
}

beforeEach(() => {
  listPublishedProperties.mockReset();
});

describe("GET /api/properties", () => {
  it("responde 200 con el resultado paginado usando valores por defecto", async () => {
    const paginatedResult = {
      data: [],
      pagination: { page: 1, pageSize: 12, totalItems: 0, totalPages: 0 },
    };
    listPublishedProperties.mockResolvedValue(paginatedResult);

    const response = await GET(createRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(paginatedResult);
    expect(listPublishedProperties).toHaveBeenCalledWith({
      page: 1,
      pageSize: 12,
      filters: {},
    });
  });

  it("pasa la página y el tamaño recibidos en la URL", async () => {
    listPublishedProperties.mockResolvedValue({
      data: [],
      pagination: { page: 2, pageSize: 5, totalItems: 0, totalPages: 0 },
    });

    await GET(createRequest("?page=2&pageSize=5"));

    expect(listPublishedProperties).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5,
      filters: {},
    });
  });

  it("pasa los filtros de operación y destacada", async () => {
    listPublishedProperties.mockResolvedValue({
      data: [],
      pagination: { page: 1, pageSize: 6, totalItems: 0, totalPages: 0 },
    });

    await GET(createRequest("?operation=SALE&featured=true&pageSize=6"));

    expect(listPublishedProperties).toHaveBeenCalledWith({
      page: 1,
      pageSize: 6,
      filters: { operationType: "SALE", isFeatured: true },
    });
  });

  it("responde 400 cuando los parámetros no son válidos", async () => {
    const response = await GET(createRequest("?page=0"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "El parámetro page debe ser un número entero mayor o igual a 1.",
      status: 400,
    });
    expect(listPublishedProperties).not.toHaveBeenCalled();
  });

  it("responde 500 sin detalles cuando falla el servicio", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    listPublishedProperties.mockRejectedValue(new Error("database down"));

    const response = await GET(createRequest());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Error interno del servidor",
      status: 500,
    });
  });
});
