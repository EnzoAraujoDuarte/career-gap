import type { Metadata } from 'next';
import Link from 'next/link';
import { CATALOG } from '@/catalog';
import { selectResourcesFor } from '@/domain/resources';
import { StyleSpecimen, type Specimen } from '@/components/estilos/style-specimen';
import { ACTION_VERB } from '@/domain/model';

/**
 * Página de comparação de direções visuais.
 *
 * Existe para resolver uma discordância de design olhando, não descrevendo: o mesmo
 * conteúdo real do catálogo renderizado em seis direções. Fica como registro do método
 * (ADR-0008), fora da busca.
 */
export const metadata: Metadata = {
  title: 'Direções visuais · Career Gap',
  robots: { index: false, follow: false },
};

export default function EstilosPage() {
  const competency = CATALOG.competencies.get('http-fundamentals')!;
  const picked = selectResourcesFor('http-fundamentals', 'L2', CATALOG.resources);

  const specimen: Specimen = {
    focus: { name: competency.name, summary: competency.summary },
    neighbours: [
      { name: 'JavaScript essencial', state: 'met' },
      { name: 'Consumo de API', state: 'blocked' },
      { name: 'Construir uma aplicação completa', state: 'available' },
    ],
    actions: picked.slice(0, 3).map((item) => ({
      verb: ACTION_VERB[item.resource.actionType],
      title: item.resource.title,
      source: item.resource.sourceName,
      recommended: item.recommended,
    })),
    exitCriteria: competency.levels.L2?.exitCriteria ?? [],
  };

  return (
    <main className="bg-paper min-h-dvh px-5 py-10">
      <div className="mx-auto max-w-[1100px]">
        <header className="border-rule mb-10 border-b pb-6">
          <h1 className="text-ink text-[26px] leading-tight font-medium">
            Seis direções visuais para o Career Gap
          </h1>
          <p className="text-ink-soft mt-2 max-w-[70ch] text-[14px] leading-relaxed">
            O mesmo nó, os mesmos recursos e os mesmos critérios de saída, renderizados de
            seis formas. Compare pela velocidade de leitura: quanto tempo você leva para
            achar o título do nó, o que fazer primeiro, e o que está travado.
          </p>
          <p className="text-ink-soft mt-3 max-w-[70ch] text-[14px] leading-relaxed">
            A direção adotada veio depois destas seis:{' '}
            <Link href="/trilha" className="text-ink underline underline-offset-2">
              G · Estrada
            </Link>
            , a trilha inteira desenhada como uma estrada vertical (ADR-0011). Ela só faz sentido
            com todas as competências, por isso está na própria trilha e não aqui.
          </p>
        </header>

        <div className="space-y-12">
          <StyleSpecimen variant="fluxo" specimen={specimen} />
          <StyleSpecimen variant="atual" specimen={specimen} />
          <StyleSpecimen variant="anotacao" specimen={specimen} />
          <StyleSpecimen variant="blueprint" specimen={specimen} />
          <StyleSpecimen variant="metro" specimen={specimen} />
          <StyleSpecimen variant="editorial" specimen={specimen} />
        </div>
      </div>
    </main>
  );
}
