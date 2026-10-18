'use client';

import { useEffect, useRef } from 'react';

/**
 * Voltar para onde a pessoa estava.
 *
 * A trilha e a Minha área leem o perfil do navegador, então o primeiro quadro é "Carregando…": ao
 * voltar de uma competência ou de uma construção, o navegador não tinha para onde rolar e a pessoa
 * caía no começo, a cada ida e volta. A posição é guardada ao sair por um link de detalhe e
 * restaurada uma vez, quando o conteúdo já está na tela.
 */

const PREFIX = 'career-gap:volta:';
/** Depois disso a posição é velha: a pessoa provavelmente não está "voltando". */
const FRESH_MS = 30 * 60_000;

interface Return {
  /** Posição exata ao sair. */
  readonly y?: number;
  /** Id do elemento para onde voltar, quando não há posição: a estação de uma competência. */
  readonly anchor?: string;
  readonly at: number;
}

const write = (key: string, value: Return) => {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Armazenamento bloqueado: volta-se para o topo, como antes.
  }
};

const read = (key: string): Return | null => {
  try {
    const value = JSON.parse(sessionStorage.getItem(PREFIX + key) ?? 'null') as Return | null;
    return value && Date.now() - value.at < FRESH_MS ? value : null;
  } catch {
    return null;
  }
};

/** O menu de cima abre o espaço do começo, como sempre: esquece qualquer volta pendente. */
export function forgetReturns(): void {
  try {
    for (const key of Object.keys(sessionStorage)) if (key.startsWith(PREFIX)) sessionStorage.removeItem(key);
  } catch {
    // nada a esquecer
  }
}

export function rememberScroll(key: string): void {
  write(key, { y: Math.round(window.scrollY), at: Date.now() });
}

/**
 * Para o "← Trilha" de uma página de detalhe: sem posição guardada (a pessoa chegou por outro
 * caminho), mira o elemento dela. A âncora não vai na URL de propósito: o Next rola até a âncora
 * depois da restauração e jogava a pessoa no começo do nível em vez da estação de onde saiu.
 */
export function aimReturnAt(key: string, anchor: string): void {
  if (!read(key)) write(key, { anchor, at: Date.now() });
}

/** O elemento para onde a volta vai mirar, sem consumi-la: a trilha abre o nível que o contém
 *  antes de rolar até ele. */
export function pendingReturnAnchor(key: string): string | undefined {
  return read(key)?.anchor;
}

/** Para `onClickCapture` da lista: guarda a posição quando o link leva a uma página de detalhe. */
export const rememberOnDetailLink =
  (key: string, prefixes: readonly string[]) =>
  (event: React.MouseEvent): void => {
    const href = (event.target as Element).closest?.('a')?.getAttribute('href') ?? '';
    if (prefixes.some((prefix) => href.startsWith(prefix))) rememberScroll(key);
  };

/**
 * Ordem: a posição guardada ao sair, se recente; senão o elemento mirado pelo "← Trilha" (a
 * estação da competência); senão a âncora da URL; senão o topo.
 *
 * Roda num `setTimeout`, não num quadro de animação: o navegador congela `requestAnimationFrame`
 * em aba sem foco, e a volta não aconteceria. O tempo zero também deixa a rolagem do próprio Next
 * terminar antes. A leitura fica dentro do callback para que o efeito duplo do modo de
 * desenvolvimento não consuma a posição antes de usá-la.
 */
export function useRestoreScroll(key: string, ready: boolean): void {
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    const timer = window.setTimeout(() => {
      done.current = true;
      const saved = read(key);
      try {
        sessionStorage.removeItem(PREFIX + key);
      } catch {
        // nada a limpar
      }
      if (saved?.y !== undefined) {
        window.scrollTo({ top: saved.y, behavior: 'instant' });
        return;
      }
      const target = saved?.anchor ?? decodeURIComponent(window.location.hash.slice(1));
      if (target) document.getElementById(target)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [key, ready]);
}
