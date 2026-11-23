import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Carga .env, .env.local, etc. con las mismas reglas que Next.js.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // react-server permite importar módulos marcados con "server-only".
    seed: "tsx --conditions=react-server prisma/seed.ts",
  },
  datasource: {
    // Se lee directamente para que `prisma generate` funcione sin base de datos.
    url: process.env.DATABASE_URL,
  },
});
