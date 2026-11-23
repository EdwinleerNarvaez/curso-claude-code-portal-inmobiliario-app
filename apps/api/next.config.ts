import type { NextConfig } from "next";

// Backend REST: solo expone Route Handlers en /api/** (plan.md, sección 4).
const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ["@portal/shared"],
};

export default nextConfig;
