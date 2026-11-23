import type { NextConfig } from "next";

// URL del backend (@portal/api). Solo se usa en el servidor: nunca llega al navegador.
const apiUrl = process.env.API_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@portal/shared"],
  images: {
    // Las imágenes de propiedades se sirven desde Cloudinary (spec.md, sección 5).
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
  async rewrites() {
    // El navegador llama a /api/... en este mismo dominio y Next.js lo reenvía
    // al backend (plan.md, sección 4): sin CORS y con cookies del mismo dominio.
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
