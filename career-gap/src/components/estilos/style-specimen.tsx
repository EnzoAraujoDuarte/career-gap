import type { ReactNode } from 'react';
import { FlowSpecimen } from './flow-specimen';

export interface Specimen {
  readonly focus: { name: string; summary: string };
  readonly neighbours: readonly { name: string; state: 'met' | 'blocked' | 'available' }[];
  readonly actions: readonly {
    verb: string;
    title: string;
    source: string;
    recommended: boolean;
  }[];
  readonly exitCriteria: readonly string[];
}

type Variant = 'atual' | 'anotacao' | 'blueprint' | 'metro' | 'editorial' | 'fluxo';

const META: Record<Variant, { title: string; thesis: string; cost: string; risk: string }> = {
  atual: {
    title: 'A · Atual — quadro branco desenhado',
    thesis:
      'Manuscrita em tudo: título de nó, número, cabeçalho e anotação. Traço irregular em todas as bordas.',
    cost: 'já construído',
    risk: 'o rótulo compete com a anotação e some no zoom baixo',
  },
  anotacao: {
    title: 'B · Anotação sobre estrutura',
    thesis:
      'Inverte a regra: tipografia legível em tudo que carrega informação, manuscrita só na marginália. É um documento impresso que alguém anotou à mão, não um desenho inteiro.',
    cost: 'ajuste de 1 dia',
    risk: 'preserva a identidade, mas é o passo mais conservador',
  },
  blueprint: {
    title: 'C · Planta técnica',
    thesis:
      'Abandona a manuscrita. Linha fina precisa, grade, monoespaçada nos rótulos de estado. Continua não sendo dashboard, mas é preciso em vez de casual.',
    cost: '2 a 3 dias',
    risk: 'pode ficar frio para quem está começando',
  },
  metro: {
    title: 'D · Mapa de metrô',
    thesis:
      'Troca o canvas livre por uma estrutura de linhas e estações. Sequência e ramificação ficam óbvias sem precisar de seta.',
    cost: '4 a 5 dias, muda o layout do grafo',
    risk: 'força o grafo a virar linhas; nem todo pré-requisito cabe',
  },
  fluxo: {
    title: 'F · Fluxo editorial — sem canvas, mobile primeiro',
    thesis:
      'Junta E com a estrutura do roadmap.sh: fluxo vertical fixo, sem pan e sem zoom. O painel de detalhe some — o conteúdo abre dentro do próprio nó. Uma interface só, que relê por CSS no celular.',
    cost: '4 a 5 dias; aposenta React Flow, dagre e rough.js',
    risk: 'perde a metáfora do quadro branco quase inteira',
  },
  editorial: {
    title: 'E · Caderno editorial',
    thesis:
      'O mapa deixa de ser a tela principal. Hierarquia tipográfica forte, fio, numeração. Lê-se como um guia de estudo bem diagramado.',
    cost: '3 dias',
    risk: 'perde o diferencial visual que te empolgou no início',
  },
};

export function StyleSpecimen({
  variant,
  specimen,
}: {
  variant: Variant;
  specimen: Specimen;
}) {
  const meta = META[variant];
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-ink text-[17px] font-medium">{meta.title}</h2>
        <p className="text-ink-soft mt-1 max-w-[80ch] text-[13px] leading-snug">{meta.thesis}</p>
        <p className="text-ink-faint mt-1 text-[12px]">
          custo: {meta.cost} · risco: {meta.risk}
        </p>
      </div>
      <div className="border-rule overflow-hidden rounded-sm border">
        {RENDER[variant](specimen)}
      </div>
    </section>
  );
}

const RENDER: Record<Variant, (s: Specimen) => ReactNode> = {
  fluxo: (s) => <FlowSpecimen specimen={s} />,
  atual: (s) => (
    <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
      <div className="paper-grid border-rule relative border-b p-6 md:border-b-0 md:border-r">
        <Sketch>
          <p className="font-original-hand text-now absolute -top-1 left-2 text-[13px]">↓ VOCÊ ESTÁ AQUI</p>
          <p className="font-original-hand text-ink text-[17px] leading-tight">{s.focus.name}</p>
          <p className="text-ink-soft mt-1 text-[11px]">não sei ainda → sozinho · 3 recursos</p>
        </Sketch>
        <div className="mt-7 space-y-2.5">
          {s.neighbours.map((n) => (
            <Sketch key={n.name} state={n.state} small>
              <p className="font-original-hand text-ink text-[15px] leading-tight">{n.name}</p>
            </Sketch>
          ))}
        </div>
      </div>
      <div className="bg-paper-edge p-6">
        <h3 className="font-original-hand text-ink text-[21px] leading-tight">{s.focus.name}</h3>
        <p className="font-original-hand text-ink-soft mt-4 text-[14px]">O QUE FAZER</p>
        <ol className="mt-2 space-y-2.5">
          {s.actions.map((a, i) => (
            <li key={a.title} className="flex gap-2">
              <span className="font-original-hand text-ink-faint w-4 text-[14px]">{i + 1}</span>
              <span>
                <span className="font-original-hand text-now mr-1.5 text-[12px]">{a.verb}</span>
                <span className="font-original-hand text-ink text-[14px] leading-snug">{a.title}</span>
                <span className="text-ink-faint block text-[11px]">{a.source}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="font-original-hand text-ink-soft mt-5 text-[14px]">COMO SEI QUE ACABEI</p>
        <ul className="mt-1.5 space-y-1">
          {s.exitCriteria.map((c) => (
            <li key={c} className="font-original-hand text-ink text-[13.5px] leading-snug">
              ☐ {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  anotacao: (s) => (
    <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
      <div className="paper-grid border-rule relative border-b p-6 md:border-b-0 md:border-r">
        <Sketch>
          <p className="font-hand text-now absolute -top-1 left-2 text-[13px]">↓ você está aqui</p>
          <p className="text-ink text-[15px] font-medium leading-tight">{s.focus.name}</p>
          <p className="text-ink-soft mt-1 text-[11px]">não sei ainda → sozinho · 3 recursos</p>
        </Sketch>
        <div className="mt-7 space-y-2.5">
          {s.neighbours.map((n) => (
            <Sketch key={n.name} state={n.state} small>
              <p className="text-ink text-[13.5px] leading-tight">{n.name}</p>
            </Sketch>
          ))}
        </div>
      </div>
      <div className="bg-paper-edge p-6">
        <h3 className="text-ink text-[18px] font-medium leading-tight">{s.focus.name}</h3>
        <p className="text-ink-faint mt-4 text-[11px] uppercase tracking-[0.12em]">O que fazer</p>
        <ol className="mt-2 space-y-2.5">
          {s.actions.map((a, i) => (
            <li key={a.title} className="flex gap-2.5">
              <span className="text-ink-faint w-4 text-[12px] tabular-nums">{i + 1}</span>
              <span className="min-w-0">
                <span className="text-now mr-1.5 text-[10.5px] font-medium uppercase tracking-wider">
                  {a.verb}
                </span>
                <span className="text-ink text-[13.5px] leading-snug">{a.title}</span>
                {a.recommended && (
                  <span className="font-hand text-done ml-1.5 text-[13px]">← comece aqui</span>
                )}
                <span className="text-ink-faint block text-[11px]">{a.source}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-ink-faint mt-5 text-[11px] uppercase tracking-[0.12em]">
          Como sei que acabei
        </p>
        <ul className="mt-1.5 space-y-1">
          {s.exitCriteria.map((c) => (
            <li key={c} className="text-ink text-[13px] leading-snug">
              ☐ {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  blueprint: (s) => (
    <div
      className="grid gap-0 md:grid-cols-[1.1fr_1fr]"
      style={{
        backgroundColor: '#f4f6f8',
        backgroundImage:
          'linear-gradient(#dde4ea 1px, transparent 1px), linear-gradient(90deg, #dde4ea 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="border-b p-6 md:border-b-0 md:border-r" style={{ borderColor: '#c9d4de' }}>
        <div className="relative border-2 bg-white/80 p-3" style={{ borderColor: '#1c4e80' }}>
          <p
            className="font-mono absolute -top-2.5 left-2 bg-[#f4f6f8] px-1 text-[9.5px] uppercase tracking-[0.18em]"
            style={{ color: '#1c4e80' }}
          >
            posição atual
          </p>
          <p className="text-ink font-grotesk text-[15px] font-medium leading-tight">
            {s.focus.name}
          </p>
          <p className="font-mono mt-1 text-[10px] uppercase tracking-wider text-[#5b6b7a]">
            L0 → L2 · 03 recursos
          </p>
        </div>
        <div className="mt-6 space-y-2">
          {s.neighbours.map((n) => (
            <div
              key={n.name}
              className="border bg-white/60 p-2.5"
              style={{
                borderColor: n.state === 'blocked' ? '#b8c4cf' : '#7b8fa1',
                borderStyle: n.state === 'blocked' ? 'dashed' : 'solid',
                opacity: n.state === 'blocked' ? 0.65 : 1,
              }}
            >
              <p className="font-grotesk text-ink text-[13px] leading-tight">{n.name}</p>
              <p className="font-mono text-[9.5px] uppercase tracking-wider text-[#5b6b7a]">
                {n.state === 'met' ? 'concluído' : n.state === 'blocked' ? 'bloqueado' : 'liberado'}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/70 p-6">
        <h3 className="font-grotesk text-ink text-[18px] font-medium leading-tight">
          {s.focus.name}
        </h3>
        <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.18em] text-[#1c4e80]">
          01 · o que fazer
        </p>
        <ol className="mt-2 space-y-2.5">
          {s.actions.map((a, i) => (
            <li key={a.title} className="flex gap-2.5">
              <span className="font-mono w-5 text-[11px] text-[#5b6b7a]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="font-mono mr-1.5 text-[10px] uppercase tracking-wider text-[#1c4e80]">
                  {a.verb}
                </span>
                <span className="text-ink text-[13.5px] leading-snug">{a.title}</span>
                <span className="block text-[11px] text-[#5b6b7a]">{a.source}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="font-mono mt-5 text-[10px] uppercase tracking-[0.18em] text-[#1c4e80]">
          02 · critério de saída
        </p>
        <ul className="mt-1.5 space-y-1">
          {s.exitCriteria.map((c) => (
            <li key={c} className="text-ink text-[13px] leading-snug">
              ☐ {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  metro: (s) => (
    <div className="grid gap-0 bg-[#fbfbf9] md:grid-cols-[1.1fr_1fr]">
      <div className="border-rule border-b p-7 md:border-b-0 md:border-r">
        <div className="relative pl-7">
          <span className="absolute left-0 top-0 h-full w-[5px] rounded-full bg-[#2c5aa0]" />
          {[{ name: s.neighbours[0].name, state: 'met' as const }, { name: s.focus.name, state: 'now' as const }, ...s.neighbours.slice(1)].map(
            (station, index) => (
              <div key={station.name} className="relative pb-6 last:pb-0">
                <span
                  className="absolute -left-[26px] top-[3px] h-[15px] w-[15px] rounded-full border-[3px] bg-white"
                  style={{
                    borderColor:
                      station.state === 'met'
                        ? '#4a7c59'
                        : station.state === 'now'
                          ? '#2c5aa0'
                          : '#9a948a',
                    boxShadow: station.state === 'now' ? '0 0 0 4px #eaf0f8' : undefined,
                  }}
                />
                <p
                  className={`text-[14px] leading-tight ${
                    station.state === 'now' ? 'text-ink font-semibold' : 'text-ink'
                  }`}
                  style={{ opacity: station.state === 'blocked' ? 0.5 : 1 }}
                >
                  {station.name}
                </p>
                {station.state === 'now' && (
                  <p className="mt-0.5 text-[11px] font-medium text-[#2c5aa0]">
                    você está aqui · 3 recursos
                  </p>
                )}
                {station.state === 'blocked' && (
                  <p className="text-ink-faint mt-0.5 text-[11px]">
                    abre depois de {index === 2 ? s.focus.name : 'a etapa anterior'}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      </div>
      <div className="p-7">
        <h3 className="text-ink text-[19px] font-semibold leading-tight">{s.focus.name}</h3>
        <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">{s.focus.summary}</p>
        <div className="mt-5 space-y-3">
          {s.actions.map((a) => (
            <div key={a.title} className="border-l-[3px] border-[#2c5aa0] pl-3">
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#2c5aa0]">
                {a.verb}
              </p>
              <p className="text-ink text-[13.5px] leading-snug">{a.title}</p>
              <p className="text-ink-faint text-[11px]">{a.source}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-faint mt-5 text-[11px] font-semibold uppercase tracking-[0.1em]">
          Você terminou quando
        </p>
        <ul className="mt-1.5 space-y-1">
          {s.exitCriteria.map((c) => (
            <li key={c} className="text-ink text-[13px] leading-snug">
              ☐ {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),

  editorial: (s) => (
    <div className="bg-[#fdfbf7] px-8 py-9">
      <div className="mx-auto max-w-[62ch]">
        <p className="font-serif text-[11px] uppercase tracking-[0.22em] text-[#8a7f6d]">
          Etapa 04 — em andamento
        </p>
        <h3 className="font-serif text-ink mt-2 text-[30px] leading-[1.15]">{s.focus.name}</h3>
        <p className="text-ink-soft mt-3 text-[14.5px] leading-relaxed">{s.focus.summary}</p>

        <hr className="my-6 border-t border-[#e2d9c8]" />

        <p className="font-serif text-[12px] uppercase tracking-[0.18em] text-[#8a7f6d]">
          O que fazer
        </p>
        <ol className="mt-3 space-y-4">
          {s.actions.map((a, i) => (
            <li key={a.title} className="flex gap-4">
              <span className="font-serif text-[22px] leading-none text-[#c9bda6]">{i + 1}</span>
              <span>
                <span className="text-ink text-[15px] leading-snug">{a.title}</span>
                <span className="text-ink-soft mt-0.5 block text-[12.5px]">
                  {a.verb.toLowerCase()} · {a.source}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <hr className="my-6 border-t border-[#e2d9c8]" />

        <p className="font-serif text-[12px] uppercase tracking-[0.18em] text-[#8a7f6d]">
          Você terminou quando
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {s.exitCriteria.map((c) => (
            <li key={c} className="text-ink text-[14px] leading-relaxed">
              — {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ),
};

/** Caixa com traço irregular, imitando o nó atual do canvas. */
function Sketch({
  children,
  state,
  small,
}: {
  children: ReactNode;
  state?: 'met' | 'blocked' | 'available';
  small?: boolean;
}) {
  const stroke =
    state === 'met' ? 'var(--state-done)' : state === 'blocked' ? 'var(--state-future)' : 'var(--ink)';
  return (
    <div
      className={`relative bg-[#fffdf8] ${small ? 'px-3 py-2' : 'px-3.5 py-3'}`}
      style={{
        border: `${state === 'blocked' ? '1.3px dashed' : '1.7px solid'} ${stroke}`,
        borderRadius: '255px 12px 225px 10px / 10px 225px 12px 255px',
        opacity: state === 'blocked' ? 0.6 : 1,
      }}
    >
      {children}
    </div>
  );
}
