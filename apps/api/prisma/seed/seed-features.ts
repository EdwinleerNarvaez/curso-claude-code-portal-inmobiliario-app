// Características iniciales (spec.md, sección 4).
export const seedFeatureNames = [
  "Piscina",
  "Gimnasio",
  "Quincho",
  "Lavandería",
  "Jardín",
  "Terraza",
  "Bodega",
  "Ascensor",
  "Conserjería",
  "Seguridad",
  "Calefacción",
  "Aire acondicionado",
  "Pet friendly",
] as const;

export type SeedFeatureName = (typeof seedFeatureNames)[number];
