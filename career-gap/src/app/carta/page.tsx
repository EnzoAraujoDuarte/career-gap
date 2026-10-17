import type { Metadata } from 'next';
import { PageShell } from '@/components/ecosystem/page-shell';
import { OpeningLetter } from '@/components/path/opening-letter';

export const metadata: Metadata = { title: 'Antes de começar · Career Gap' };

/** A carta de abertura inteira; o resumo dela abre a trilha. */
export default function Page() {
  return (
    <PageShell
      current="trilha"
      title="Antes de começar"
      intro="O que mudou com as IAs, e as três coisas que contam para quem entra agora: construir, mostrar, conviver."
    >
      <OpeningLetter />
    </PageShell>
  );
}
