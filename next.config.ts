import type { NextConfig } from "next";

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
  }
};

export default nextConfig;
