import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'], // Admin panelini arama motorlarından gizle
    },
    sitemap: 'https://kahvaltikonagi.com.tr/sitemap.xml',
  };
}
