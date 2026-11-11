import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O selo de desenvolvimento fica exatamente sobre o painel NÃO AGORA, no canto
  // inferior esquerdo, e atrapalha demonstrações da tela.
  devIndicators: false,
  // Os espaços antigos viraram filtros do Explorar e a Minha área.
  // Temporário: um link antigo compartilhado continua chegando ao lugar certo.
  redirects: async () => [
    // A trilha sem perfil é a porta de entrada: valor em zero toque, e o convite para dizer o
    // que já sabe fica no topo dela.
    { source: '/', destination: '/trilha', permanent: false },
    { source: '/projetos', destination: '/explorar?tipo=praticar', permanent: false },
    { source: '/biblioteca', destination: '/explorar?tipo=livros', permanent: false },
    { source: '/comportamental', destination: '/explorar?aba=habitos', permanent: false },
    { source: '/plano', destination: '/minha-area', permanent: false },
  ],
  // Antes de ter gente real logada: ninguém embute o site num iframe para induzir clique (o
  // "Apagar meus dados" é um botão), o navegador não adivinha tipo de arquivo, e o endereço
  // completo não vaza para os sites dos recursos. CSP fica de fora: o Next injeta scripts
  // inline, e uma política mal feita quebraria a página sem ganho proporcional neste estágio.
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
};

export default nextConfig;
