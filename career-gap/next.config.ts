import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O selo de desenvolvimento fica exatamente sobre o painel NÃO AGORA, no canto
  // inferior esquerdo, e atrapalha demonstrações da tela.
  devIndicators: false,
  // Os espaços antigos viraram filtros do Explorar e a Minha área (docs/PLANO-FASE4.md §3).
  // Temporário: um link antigo compartilhado continua chegando ao lugar certo.
  redirects: async () => [
    { source: '/projetos', destination: '/explorar?tipo=praticar', permanent: false },
    { source: '/biblioteca', destination: '/explorar?tipo=livros', permanent: false },
    { source: '/kit', destination: '/explorar?aba=ferramentas', permanent: false },
    { source: '/comportamental', destination: '/explorar?aba=habitos', permanent: false },
    { source: '/plano', destination: '/minha-area', permanent: false },
  ],
};

export default nextConfig;
