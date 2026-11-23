// Errores de aplicación independientes de HTTP. Los servicios los lanzan y la
// capa de API los traduce a códigos de estado (ver src/lib/api-response.ts).

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
