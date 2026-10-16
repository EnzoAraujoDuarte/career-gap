import type { Metadata } from 'next';
import Link from 'next/link';
import { CATALOG } from '@/catalog';
import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import { CatalogFlow } from '@/components/flow/catalog-flow';

/** Fora da navegação e da busca: existe só para o experimento. */
export const metadata: Metadata = {
  title: 'Catálogo completo · Career Gap',
  robots: { index: false, follow: false },
};

/**
 * Condição A do experimento: o catálogo completo do track, na ordem de declaração, sem
 * filtro por lacuna, sem ranking e sem NÃO AGORA.
 *
 * Usa o MESMO componente de estação da condição personalizada, com os mesmos recursos por
 * competência. Se a camada de recursos ou o tratamento visual existisse só de um lado, a
 * variável independente deixaria de ser a seleção e ordenação por lacuna — que é a tese
 * (docs/DECISOES.md §1).
 */
export default function CatalogoPage() {
  return (
    <main className="min-h-dvh bg-paper px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <header>
          <p className="font-serif text-[12.5px] tracking-[0.12em] text-ink-soft">
            {FIRST_WEB_ROLE.name}
          </p>
          <p className="text-ink-soft mt-1.5 text-[13px] leading-snug">
            Todas as {FIRST_WEB_ROLE.requirements.length} competências do objetivo, na ordem do
            catálogo. Sem filtro pelo que você já sabe e sem prioridade.
          </p>
        </header>

        <CatalogFlow track={FIRST_WEB_ROLE} catalog={CATALOG} />

        <footer className="border-rule mt-10 border-t pt-4">
          <Link href="/mapa" className="text-ink-faint hover:text-ink text-[12px] underline">
            ver o caminho personalizado
          </Link>
        </footer>
      </div>
    </main>
  );
}
