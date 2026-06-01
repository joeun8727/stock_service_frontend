import type { NextConfig } from "next";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const nextConfig: NextConfig = {
  // 브라우저 → Next.js(/api/v1/*) → 백엔드 프록시 (CORS 우회)
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND}/:path*`,
      },
    ];
  },
};

export default nextConfig;
