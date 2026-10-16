import type { Metadata } from 'next';
import { Fraunces, Inter, Shantell_Sans } from 'next/font/google';
import { PersistenceProvider } from '@/components/persistence/persistence';
import { configuredProviders } from '@/lib/auth';
import { SITE_URL } from '@/lib/site-url';
import './globals.css';

/** Leitura: formulários, textos e detalhes. */
const ui = Inter({ variable: '--font-ui', subsets: ['latin'] });

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
