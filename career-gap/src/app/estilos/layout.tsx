import { Architects_Daughter, IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';

/**
 * Fontes exclusivas da página de comparação de direções visuais.
 *
 * Ficam aqui, e não no layout raiz, para que o produto não carregue face que só a página de
 * decisão usa. A página é mantida como registro do método — a comparação vira evidência no
 * capítulo de metodologia.
 */
/* A variante A precisa continuar exibindo a face ORIGINAL do projeto, senão o registro da
   comparação deixa de ser honesto sobre o que foi comparado. */
const original = Architects_Daughter({
  variable: '--font-original-hand',
  weight: '400',
  subsets: ['latin'],
});
const grotesk = Space_Grotesk({ variable: '--font-grotesk', subsets: ['latin'] });
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
});

export default function EstilosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${original.variable} ${grotesk.variable} ${plexMono.variable}`}>
      {children}
    </div>
  );
}
