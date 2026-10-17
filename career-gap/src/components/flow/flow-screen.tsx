'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATALOG } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { buildRoadmapView, type ViewNode } from '@/lib/roadmap-view';
import { useCurrentProfile } from '@/lib/current-profile';
import { EcosystemNav } from '@/components/ecosystem/ecosystem-nav';
import { FlowStation } from './flow-station';
import { DemoSwitcher } from './demo-switcher';

/**
 * Roadmap como fluxo vertical, sem canvas.
 *
 * O grafo é um DAG, não uma linha. A conversão honesta para vertical usa as ONDAS que o
 * motor já calcula: onda 0 é o que está alcançável agora, onda 1 abre depois, e assim por
 * diante. Indentar por "filho" seria mentira — um nó costuma ter mais de um bloqueador.
 * A dependência aparece como texto no nó bloqueado, não como linha.
 */
export function FlowScreen() {
  const { profile, demoId } = useCurrentProfile();
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const [showMet, setShowMet] = useState(false);

  if (profile === undefined) {
    return <Shell><p className="text-ink-faint text-[14px]">Montando seu caminho…</p></Shell>;
  }
  if (profile === null) {
    return (
      <Shell>
        <p className="text-ink text-[15px]">Nenhum perfil ainda.</p>
        <Link href="/avaliacao" className="text-now mt-2 inline-block text-[14px] underline">
          Montar meu caminho
        </Link>
      </Shell>
    );
  }

  const view = buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG);
  const track = CATALOG.tracks.get(profile.trackId);

  const open = view.nodes.filter((node) => node.status !== 'met');
  const met = view.nodes.filter((node) => node.status === 'met');
  const focus = open.find((node) => node.status === 'now');
  const rest = open.filter((node) => node !== focus);

  // As ondas vêm do motor; aqui só viram títulos de seção.
  const waves = groupByWave(rest);

  return (
    <Shell>
      <header>
        <p className="font-serif text-[13.5px] text-ink-soft">
          {track?.name}
        </p>
        <p className="text-ink-soft mt-1.5 text-[13px]">
          <strong className="text-done font-medium">{view.counts.met}</strong> no seu nível ·{' '}
          <strong className="text-ink font-medium">{view.counts.open}</strong> em aberto ·{' '}
          <strong className="text-ink-faint font-medium">{view.counts.notNow}</strong> adiadas
        </p>
      </header>

      {met.length > 0 && (
        <section className="mt-5">
          <button
            onClick={() => setShowMet(!showMet)}
            aria-expanded={showMet}
            className="text-done focus-visible:outline-attention -my-1.5 py-1.5 text-[13.5px] focus-visible:outline-2"
          >
            ✓ {met.length} competências já no seu nível {showMet ? '▴' : '▾'}
          </button>
          {showMet && (
            <ul className="mt-2 space-y-1 border-l-2 border-rule pl-3">
              {met.map((node) => (
                <li key={node.id} className="text-ink-soft text-[13px] leading-snug">
                  {node.name}
                  {node.needsVerification && (
                    <span className="hand text-attention ml-1.5 text-[12px]">verificar?</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {focus && (
        <section className="mt-7">
          <p className="hand text-now text-[15px]">seu foco agora</p>
          <ol className="mt-1.5">
            <FlowStation node={focus} expanded alwaysOpen />
          </ol>
        </section>
      )}

      {waves.map(([wave, nodes]) => (
        <section key={wave} className="mt-8">
          <h2 className="font-serif border-b border-rule pb-1.5 text-[13.5px] text-ink-soft">
            {WAVE_TITLE(wave)} <span className="normal-case tracking-normal">· {nodes.length}</span>
          </h2>
          <ol className="mt-3">
            {nodes.map((node) => (
              <FlowStation
                key={node.id}
                node={node}
                expanded={expanded === node.id}
                onToggle={() => setExpanded(expanded === node.id ? undefined : node.id)}
              />
            ))}
          </ol>
        </section>
      ))}

      {view.notNow.length > 0 && (
        <section className="mt-9 border-t border-dashed border-rule pt-5">
          <p className="hand text-critical text-[16px]">não agora</p>
          <ul className="mt-2 space-y-2.5">
            {groupByExplanation(view.notNow).map(([explanation, names]) => (
              <li key={explanation}>
                <p className="text-ink-faint text-[13px] leading-snug line-through">
                  {names.join(' · ')}
                </p>
                <p className="text-ink-soft text-[12px] leading-snug">{explanation}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <DemoSwitcher currentId={demoId} />
    </Shell>
  );
}

const WAVE_TITLE = (wave: number): string =>
  wave === 0 ? 'Também alcançável agora' : wave === 1 ? 'Em seguida' : 'Mais adiante';

/** Itens adiados pelo mesmo motivo viram uma linha só. Repetir a mesma justificativa três
 *  vezes seguidas transforma a seção que deveria aliviar em mais uma lista para ler. */
function groupByExplanation(
  items: readonly { name: string; explanation: string }[],
): [string, string[]][] {
  const grouped = new Map<string, string[]>();
  for (const item of items) {
    const bucket = grouped.get(item.explanation);
    if (bucket) bucket.push(item.name);
    else grouped.set(item.explanation, [item.name]);
  }
  return [...grouped.entries()];
}

function groupByWave(nodes: readonly ViewNode[]): [number, ViewNode[]][] {
  const byWave = new Map<number, ViewNode[]>();
  for (const node of nodes) {
    // `blocked` sem onda conhecida cai no grupo mais distante.
    const wave = node.status === 'blocked' ? Math.max(1, node.wave ?? 1) : (node.wave ?? 0);
    const bucket = byWave.get(wave);
    if (bucket) bucket.push(node);
    else byWave.set(wave, [node]);
  }
  return [...byWave.entries()].sort((a, b) => a[0] - b[0]);
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-paper">
      <EcosystemNav />
      <div className="mx-auto max-w-[1040px] px-4 pb-12 sm:px-6">
        <div className="max-w-[640px]">
        <div className="mt-7">{children}</div>
        </div>
      </div>
    </main>
  );
}
