import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible_Next, Fraunces, Shantell_Sans } from 'next/font/google';
import { PersistenceProvider } from '@/components/persistence/persistence';
import { configuredProviders } from '@/lib/auth';
import { SITE_URL } from '@/lib/site-url';
import './globals.css';

/** Leitura: formulários, textos e detalhes. Atkinson Hyperlegible foi desenhada pelo Braille
 *  Institute para quem lê com baixa visão — letras que não se confundem (I, l e 1; O e 0). Um
 *  produto que ensina acessibilidade lê melhor nela do que na Inter, a face padrão de toda
 *  interface gerada (auditoria impeccable, docs/AUDITORIA-UI-2026-10-15.md). Licença OFL. */
const ui = Atkinson_Hyperlegible_Next({ variable: '--font-ui', subsets: ['latin', 'latin-ext'] });

/** Anotação: "você está aqui", "comece aqui", "não agora". Shantell Sans tem altura-x maior
 *  que as manuscritas usuais e foi desenhada para permanecer legível — e agora é a ÚNICA
 *  coisa manuscrita na tela, que é o que faz a anotação voltar a se destacar. */
const hand = Shantell_Sans({ variable: '--font-hand', subsets: ['latin'] });

/** Títulos e rótulos de seção do fluxo editorial. */
const serif = Fraunces({ variable: '--font-serif', subsets: ['latin'] });

const description =
  'O que estudar agora e o que pode esperar, para a primeira vaga em desenvolvimento web: uma trilha aberta, com conteúdo em português e o motivo de cada recomendação.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Career Gap',
  description,
  openGraph: { title: 'Career Gap', description, siteName: 'Career Gap', locale: 'pt_BR', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Career Gap', description },
  // Na tela de início do iPhone, abre como app: sem a barra do Safari, com o nome curto.
  appleWebApp: { capable: true, title: 'Career Gap', statusBarStyle: 'default' },
};

/** `cover` leva o papel até a borda física do celular (as margens do entalhe e da barra de
 *  gestos ficam com `env(safe-area-inset-*)`), e a cor do tema pinta a barra do navegador com o
 *  mesmo papel: a página deixa de parecer um site dentro do navegador. */
export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfbf7' },
    { media: '(prefers-color-scheme: dark)', color: '#16140f' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // Sem `h-full` no html: com o canvas removido, a página inteira rola, e travar a altura
    // do documento no viewport é resíduo do layout antigo de rolagem interna.
    <html lang="pt-BR" className={`${ui.variable} ${hand.variable} ${serif.variable} antialiased`}>
      <body>
        {/* Só o nome dos provedores desce para o navegador; credenciais ficam no servidor. */}
        <PersistenceProvider enabled={Boolean(process.env.DATABASE_URL)} providers={configuredProviders()}>
          {children}
        </PersistenceProvider>
      </body>
    </html>
  );
}
