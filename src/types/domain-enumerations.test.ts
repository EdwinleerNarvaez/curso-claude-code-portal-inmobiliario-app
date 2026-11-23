// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  Currency,
  OperationType,
  PropertyType,
  Role,
} from "@/generated/prisma/enums";

import { currencies, operationTypes, propertyTypes } from "./property";
import { userRoles } from "./user";

describe("valores de dominio", () => {
  it("las operaciones coinciden con la especificación y con Prisma", () => {
    expect(operationTypes).toEqual(["SALE", "RENT"]);
    expect(Object.values(OperationType)).toEqual([...operationTypes]);
  });

  it("los tipos de propiedad coinciden con la especificación y con Prisma", () => {
    expect(propertyTypes).toEqual([
      "HOUSE",
      "APARTMENT",
      "LAND",
      "OFFICE",
      "COMMERCIAL",
      "OTHER",
    ]);
    expect(Object.values(PropertyType)).toEqual([...propertyTypes]);
  });

  it("las monedas coinciden con la especificación y con Prisma", () => {
    expect(currencies).toEqual(["USD"]);
    expect(Object.values(Currency)).toEqual([...currencies]);
  });

  it("los roles coinciden con la especificación y con Prisma", () => {
    expect(userRoles).toEqual(["USER", "ADMIN"]);
    expect(Object.values(Role)).toEqual([...userRoles]);
  });
});
