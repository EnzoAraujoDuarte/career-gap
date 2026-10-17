import type { MetadataRoute } from 'next';

/**
 * "Adicionar à tela de início" vira um app: abre em tela cheia, direto na trilha, com o papel
 * como cor de fundo enquanto carrega. É só o manifesto da web, não um app de loja.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Career Gap',
    short_name: 'Career Gap',
    description: 'O que estudar agora e o que pode esperar, para a primeira vaga em desenvolvimento web.',
    lang: 'pt-BR',
    start_url: '/trilha',
    display: 'standalone',
    background_color: '#fdfbf7',
    theme_color: '#fdfbf7',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
