import type { NextConfig } from "next";

const CANONICAL_ORIGIN = "https://kahvaltikonagi.com.tr";
const CANONICAL_REDIRECT_HOSTS = [
  "www.kahvaltikonagi.com.tr",
  "kahvaltikonagi.com",
  "www.kahvaltikonagi.com",
  "kahvaltikonagi.info",
  "www.kahvaltikonagi.info",
  "kahvaltikonagi.online",
  "www.kahvaltikonagi.online",
];

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false, // Güvenlik için X-Powered-By başlığını gizler
  
  // Core Web Vitals iyileştirmeleri
  compress: true, // Gzip kompresyonu
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 gün
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Prod'da console.log'ları siler
  },
  async redirects() {
    return CANONICAL_REDIRECT_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
