import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiClientError, fetchJson } from "./api-client";

function stubFetch(implementation: () => Promise<Response>) {
  const fetchMock = vi.fn(implementation);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchJson", () => {
  it("devuelve el cuerpo JSON cuando la respuesta es exitosa", async () => {
    const fetchMock = stubFetch(async () =>
      Response.json({ data: [1, 2] }, { status: 200 }),
    );

    await expect(fetchJson("/api/properties")).resolves.toEqual({
      data: [1, 2],
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/properties", {
      headers: { Accept: "application/json" },
    });
  });

  it("lanza ApiClientError con el mensaje y el estado de la API", async () => {
    stubFetch(async () =>
      Response.json(
        { message: "Propiedad no encontrada", status: 404 },
        { status: 404 },
      ),
    );

    await expect(fetchJson("/api/properties/x")).rejects.toEqual(
      new ApiClientError(404, "Propiedad no encontrada"),
    );
  });

  it("usa un mensaje genérico si la respuesta de error no es JSON", async () => {
    stubFetch(async () => new Response("<html>error</html>", { status: 502 }));

    const error = await fetchJson("/api/properties").catch(
      (caughtError: unknown) => caughtError,
    );

    expect(error).toBeInstanceOf(ApiClientError);
    expect(error).toMatchObject({
      status: 502,
      message: "No se pudo obtener la información. Intenta nuevamente.",
    });
  });

  it("lanza ApiClientError con estado 0 cuando falla la red", async () => {
    stubFetch(async () => {
      throw new TypeError("Failed to fetch");
    });

    await expect(fetchJson("/api/properties")).rejects.toMatchObject({
      status: 0,
      message: "No se pudo obtener la información. Intenta nuevamente.",
    });
  });
});
