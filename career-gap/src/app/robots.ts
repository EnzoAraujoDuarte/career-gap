import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

/** Fora da busca: a API, a área pessoal e as páginas de método e do experimento, que não são
 *  porta de entrada para quem está estudando. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/minha-area', '/perfil', '/estilos', '/entrada', '/mapa', '/catalogo'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
