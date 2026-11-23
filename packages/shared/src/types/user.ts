// Valores de dominio compartidos entre backend y frontend.
// Deben coincidir con el enum Role de apps/api/prisma/schema.prisma (lo verifica
// apps/api/src/repositories/domain-enumerations.test.ts).

export const userRoles = ["USER", "ADMIN"] as const;
export type UserRole = (typeof userRoles)[number];
