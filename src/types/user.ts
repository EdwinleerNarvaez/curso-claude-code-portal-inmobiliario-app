// Valores de dominio compartidos entre backend y frontend.
// Deben coincidir con el enum Role de prisma/schema.prisma (lo verifica
// src/types/domain-enumerations.test.ts).

export const userRoles = ["USER", "ADMIN"] as const;
export type UserRole = (typeof userRoles)[number];
