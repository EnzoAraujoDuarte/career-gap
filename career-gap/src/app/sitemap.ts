import type { MetadataRoute } from 'next';
import { BUILDS, FIRST_WEB_ROLE } from '@/catalog';
import { SITE_URL } from '@/lib/site-url';

/** As telas públicas, uma página por competência e uma por construção — as que alguém procuraria. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/trilha', '/carta', '/kit', '/explorar', '/avaliacao', '/privacidade'];
  const competencies = FIRST_WEB_ROLE.requirements.map((item) => `/competencias/${item.competency}`);
  const builds = BUILDS.map((build) => `/construir/${build.id}`);
  return [...pages, ...competencies, ...builds].map((path) => ({ url: `${SITE_URL}${path}` }));
}
