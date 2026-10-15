'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { CareerTrack } from '@/domain/model';
import type { Catalog } from '@/domain/roadmap';
import { CatalogFlow } from '@/components/flow/catalog-flow';

interface Stats {
  readonly competencies: number;
  readonly resources: number;
  readonly ptBr: number;
}

/**
 * Mapa aberto com convite fixo à personalização.
 *
 * O convite fica preso ao rodapé porque o usuário precisa poder rolar o caminho inteiro e
 * aceitar a qualquer altura — não só no topo, onde ele ainda não tem motivo para confiar.
 */
export function OpenMap({
  track,
  catalog,
  stats,
}: {
  track: CareerTrack;
  catalog: Catalog;
  stats: Stats;
}) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <main className="bg-paper min-h-dvh px-4 pb-28 pt-8 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <header>
          <p className="hand text-ink text-[26px] leading-none">Career Gap</p>
          <h1 className="font-serif text-ink mt-3 text-[23px] leading-tight">
            O caminho até a primeira vaga em desenvolvimento web
          </h1>
          <p className="text-ink-soft mt-2.5 text-[14px] leading-relaxed">
            Estas são as {stats.competencies} competências que esse objetivo pede, com{' '}
            {stats.resources} materiais verificados um a um — {stats.ptBr} deles em português.
            Role à vontade.
          </p>
          <p className="text-ink-soft mt-2.5 text-[14px] leading-relaxed">
            Quando quiser, diga o que você já sabe fazer: o caminho encolhe para o que falta,
            na ordem que faz sentido, e some o que não é para agora.
          </p>
        </header>

        <CatalogFlow track={track} catalog={catalog} />
      </div>

      {!dismissed && (
        <div className="border-rule bg-paper-edge fixed inset-x-0 bottom-0 z-10 border-t px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-[640px] items-center gap-3">
            <p className="text-ink min-w-0 flex-1 text-[13px] leading-snug">
              Este caminho é o mesmo para todo mundo.{' '}
              <span className="text-ink-soft">Deixe-o do seu tamanho.</span>
            </p>
            <Link
              href="/avaliacao"
              className="bg-ink text-paper hover:bg-ink-soft focus-visible:outline-attention shrink-0 rounded-sm px-4 py-2 text-[13.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Personalizar
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Esconder convite"
              className="text-ink-faint hover:text-ink focus-visible:outline-attention shrink-0 px-1 text-[18px] leading-none focus-visible:outline-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
