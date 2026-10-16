import type { MetadataRoute } from 'next';
import { FIRST_WEB_ROLE } from '@/catalog';
import { SITE_URL } from '@/lib/site-url';

/** As telas públicas e uma página por competência da trilha — as que alguém procuraria. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/trilha', '/explorar', '/avaliacao', '/privacidade'];
  const competencies = FIRST_WEB_ROLE.requirements.map((item) => `/competencias/${item.competency}`);
  return [...pages, ...competencies].map((path) => ({ url: `${SITE_URL}${path}` }));
}
