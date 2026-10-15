import type { Metadata } from 'next';
import { Fraunces, Inter, Shantell_Sans } from 'next/font/google';
import { PersistenceProvider } from '@/components/persistence/persistence';
import { configuredProviders } from '@/lib/auth';
import './globals.css';

/** Leitura: formulários, textos e detalhes. */
const ui = Inter({ variable: '--font-ui', subsets: ['latin'] });

/** Anotação: "você está aqui", "comece aqui", "não agora". Shantell Sans tem altura-x maior
 *  que as manuscritas usuais e foi desenhada para permanecer legível — e agora é a ÚNICA
 *  coisa manuscrita na tela, que é o que faz a anotação voltar a se destacar. */
const hand = Shantell_Sans({ variable: '--font-hand', subsets: ['latin'] });

/** Títulos e rótulos de seção do fluxo editorial. */
const serif = Fraunces({ variable: '--font-serif', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Career Gap',
  description:
    'Onde você está, onde quer chegar e o que faz sentido fazer agora — um mapa de carreira em desenvolvimento de software.',
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
