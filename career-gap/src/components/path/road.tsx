'use client';

import { useEffect, useState, type CSSProperties, type RefObject } from 'react';
import type { AdviceKind } from '@/lib/advice';

/**
 * A estrada da trilha (ADR-0011): um traço que passa pelo centro real de cada estação.
 *
 * Técnica do Trilha Info (github.com/flaviojmendes/trilhainfo, Apache-2.0), reescrita aqui:
 * medir os centros no DOM e ligar os pontos com curvas que saem e chegam na vertical. A
 * identidade é a nossa: papel, tinta e a anotação do mentor.
 */

/** Balanço em torno do eixo. Fixo, não aleatório: o mesmo catálogo desenha sempre a mesma
 *  estrada, e a pessoa reconhece o caminho na segunda visita. */
export const SWAY = [0, 0.55, 1, 0.55, 0, -0.55, -1, -0.55];

/** Posição de uma linha na estrada: o centro do marcador cai em eixo + balanço × amplitude.
 *  `--axis` e `--amp` são definidos no contêiner e mudam com a largura da tela. */
export const rowStyle = (sway: number, dot: number) =>
  ({
    paddingLeft: `max(0px, calc(var(--axis) + ${sway} * var(--amp) - ${dot / 2}px))`,
  }) as CSSProperties;

export interface Road {
  readonly width: number;
  readonly height: number;
  readonly whole: string;
  readonly walked: string;
}

function centerWithin(element: HTMLElement, container: HTMLElement) {
  // offsetLeft/offsetTop ignoram transform: nenhum movimento entorta a estrada.
  let x = element.offsetWidth / 2;
  let y = element.offsetHeight / 2;
  let current: HTMLElement | null = element;
  while (current && current !== container) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Curva cúbica com as alças na metade da distância vertical: cada trecho sai e chega na
 *  vertical, e por isso lê como estrada, não como rabisco. */
function toPath(points: readonly { x: number; y: number }[]) {
  const r = (value: number) => Math.round(value * 10) / 10;
  return points
    .map((point, index) => {
      if (index === 0) return `M${r(point.x)} ${r(point.y)}`;
      const previous = points[index - 1];
      const bend = (point.y - previous.y) / 2;
      return `C${r(previous.x)} ${r(previous.y + bend)} ${r(point.x)} ${r(point.y - bend)} ${r(point.x)} ${r(point.y)}`;
    })
    .join(' ');
}

/**
 * Mede os pontos `[data-road-point]` do contêiner. `data-walked="true"` marca o que já ficou
 * para trás; o trecho percorrido vai até o último deles.
 */
export function useRoad(ref: RefObject<HTMLElement | null>, signature: string) {
  const [road, setRoad] = useState<Road>();
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    // O ResizeObserver entrega uma medição assim que começa a observar, e outra a cada
    // mudança de tamanho — inclusive quando a fonte termina de carregar e o texto reflui.
    const observer = new ResizeObserver(() => {
      const points = [...container.querySelectorAll<HTMLElement>('[data-road-point]')].map(
        (element) => ({ ...centerWithin(element, container), walked: element.dataset.walked === 'true' }),
      );
      if (points.length < 2) return setRoad(undefined);
      let lastWalked = -1;
      points.forEach((point, index) => {
        if (point.walked) lastWalked = index;
      });
      const next: Road = {
        width: container.offsetWidth,
        height: container.offsetHeight,
        whole: toPath(points),
        walked: lastWalked > 0 ? toPath(points.slice(0, lastWalked + 1)) : '',
      };
      setRoad((previous) =>
        previous &&
        previous.whole === next.whole &&
        previous.walked === next.walked &&
        previous.width === next.width &&
        previous.height === next.height
          ? previous
          : next,
      );
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [ref, signature]);
  return road;
}

/** A estrada se desenha uma vez por carregamento; voltar à página não repete o movimento. */
let roadDrawn = false;

export function RoadSvg({ road }: { road?: Road }) {
  const [draw] = useState(() => !roadDrawn);
  useEffect(() => {
    roadDrawn = true;
  }, []);
  if (!road) return null;
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      width={road.width}
      height={road.height}
      viewBox={`0 0 ${road.width} ${road.height}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={road.whole} stroke="var(--paper-edge)" strokeWidth={14} />
      <path d={road.whole} stroke="var(--rule)" strokeWidth={14} strokeOpacity={0.55} />
      <path d={road.whole} stroke="var(--ink-faint)" strokeWidth={1.4} strokeDasharray="1 9" />
      {road.walked && (
        <path
          d={road.walked}
          pathLength={1}
          stroke="var(--ink)"
          strokeWidth={3}
          className={draw ? 'road-draw' : undefined}
        />
      )}
    </svg>
  );
}

/** Forma, cor e anotação juntas: o ponto nunca é o único sinal do estado. */
export function StationDot({ kind }: { kind?: AdviceKind }) {
  const ring = { stroke: 'var(--paper)', strokeWidth: 3 };
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" className="block overflow-visible" aria-hidden>
      {kind === 'met' ? (
        <>
          <circle cx={9} cy={9} r={8} fill="var(--state-done)" {...ring} />
          <path
            d="M5.4 9.2l2.4 2.3 4.6-4.8"
            stroke="var(--paper)"
            strokeWidth={1.8}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : kind === 'recommended' ? (
        <>
          <circle cx={9} cy={9} r={8.5} fill="var(--state-now)" {...ring} />
          <circle cx={9} cy={9} r={3} fill="var(--paper)" />
        </>
      ) : kind === 'missing-base' ? (
        <>
          <circle cx={9} cy={9} r={8.5} fill="var(--paper)" />
          <circle
            cx={9}
            cy={9}
            r={7}
            fill="var(--paper)"
            stroke="var(--state-attention)"
            strokeWidth={2}
            strokeDasharray="3 2.4"
          />
        </>
      ) : kind === 'not-now' ? (
        <circle cx={9} cy={9} r={6} fill="var(--paper)" stroke="var(--state-future)" strokeWidth={2} />
      ) : (
        <circle cx={9} cy={9} r={7} fill="var(--paper)" stroke="var(--ink-soft)" strokeWidth={2} />
      )}
    </svg>
  );
}

export function FlagIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 13V1.5" stroke="var(--ink)" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M3 2h7.5l-1.8 2.6L10.5 7.2H3" fill="var(--ink)" />
    </svg>
  );
}
