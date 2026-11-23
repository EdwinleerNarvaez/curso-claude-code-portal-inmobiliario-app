// Seed de desarrollo. Ejecutar con `npm run db:seed`.
// Es idempotente: puede ejecutarse varias veces sin duplicar datos.
import { loadEnvConfig } from "@next/env";

import type { PrismaClient } from "@/generated/prisma/client";
import { getPrismaClient } from "@/repositories/prisma-client";

import { seedFeatureNames, type SeedFeatureName } from "./seed/seed-features";
import { seedProperties } from "./seed/seed-properties";

loadEnvConfig(process.cwd());

type FeatureIdsByName = Map<SeedFeatureName, string>;

async function seedFeatures(
  prismaClient: PrismaClient,
): Promise<FeatureIdsByName> {
  const featureIdsByName: FeatureIdsByName = new Map();

  for (const featureName of seedFeatureNames) {
    const feature = await prismaClient.feature.upsert({
      where: { name: featureName },
      update: {},
      create: { name: featureName },
    });
    featureIdsByName.set(featureName, feature.id);
  }

  return featureIdsByName;
}

function getFeatureId(
  featureIdsByName: FeatureIdsByName,
  featureName: SeedFeatureName,
): string {
  const featureId = featureIdsByName.get(featureName);

  if (!featureId) {
    throw new Error(`La característica "${featureName}" no existe en el seed.`);
  }

  return featureId;
}

async function seedPropertyRecords(
  prismaClient: PrismaClient,
  featureIdsByName: FeatureIdsByName,
): Promise<void> {
  for (const seedProperty of seedProperties) {
    const { id, featureNames, ...propertyData } = seedProperty;

    await prismaClient.$transaction([
      prismaClient.property.upsert({
        where: { id },
        update: propertyData,
        create: { id, ...propertyData },
      }),
      prismaClient.propertyFeature.deleteMany({ where: { propertyId: id } }),
      prismaClient.propertyFeature.createMany({
        data: featureNames.map((featureName) => ({
          propertyId: id,
          featureId: getFeatureId(featureIdsByName, featureName),
        })),
      }),
    ]);
  }
}

async function main(): Promise<void> {
  const prismaClient = getPrismaClient();

  try {
    const featureIdsByName = await seedFeatures(prismaClient);
    await seedPropertyRecords(prismaClient, featureIdsByName);

    console.log(
      `Seed completado: ${seedFeatureNames.length} características y ${seedProperties.length} propiedades.`,
    );
  } finally {
    await prismaClient.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Error al ejecutar el seed:", error);
  process.exitCode = 1;
});
