/** A Vercel expõe o domínio de produção; sem ele (local), os links apontam para cá. É a base da
 *  prévia de compartilhamento, do robots.txt e do sitemap — os três precisam concordar. */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';
