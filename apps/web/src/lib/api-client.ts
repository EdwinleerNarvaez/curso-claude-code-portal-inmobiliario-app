// Cliente HTTP del frontend para consumir la API REST propia.

export class ApiClientError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

const defaultErrorMessage = "No se pudo obtener la información. Intenta nuevamente.";

function readErrorMessage(body: unknown): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }

  return defaultErrorMessage;
}

/** Realiza un GET y devuelve el JSON, o lanza ApiClientError con el mensaje de la API. */
export async function fetchJson<ResponseBody>(
  url: string,
): Promise<ResponseBody> {
  let response: Response;

  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    throw new ApiClientError(0, defaultErrorMessage);
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiClientError(response.status, readErrorMessage(body));
  }

  return body as ResponseBody;
}
