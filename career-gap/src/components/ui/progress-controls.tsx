'use client';

import { toggleCompleted, toggleSaved, useProgress } from '@/lib/progress-storage';

/**
 * Guardar para depois e marcar como concluído. Concluir não muda o nível da competência —
 * consumir não é saber fazer; o nível muda pela autoavaliação.
 *
 * Dois ícones de 44px ao lado da ficha, como o marcador de salvar dos apps de leitura: a frase
 * "+ minha lista · marcar como concluído" repetida em cada material era a linha mais pesada da
 * lista. O marcador é o mesmo desenho da aba Minha área, para onde o material vai.
 */
export function ProgressControls({ resourceId, title }: { resourceId: string; title: string }) {
  const entry = useProgress()?.[resourceId];
  const saved = Boolean(entry?.savedAt);
  const completed = Boolean(entry?.completedAt);
  const button =
    'focus-visible:outline-attention inline-flex h-11 w-11 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:-outline-offset-2';

  return (
    <span className="-my-2 -mr-2.5 flex shrink-0">
      <button
        type="button"
        aria-pressed={saved}
        // O título vai no nome: sem ele, o leitor de tela ouve "guardar" repetido sem saber de quê.
        aria-label={`Guardar na minha lista: ${title}`}
        title={saved ? 'Na minha lista' : 'Guardar na minha lista'}
        onClick={() => toggleSaved(resourceId)}
        className={`${button} ${saved ? 'text-now' : 'text-ink-soft hover:text-ink'}`}
      >
        <svg width={22} height={22} viewBox="0 0 22 22" aria-hidden>
          <path
            d="M6 3.5h10v15.25l-5-3.75-5 3.75z"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-pressed={completed}
        aria-label={`Marcar como concluído: ${title}`}
        title={completed ? 'Concluído' : 'Marcar como concluído'}
        onClick={() => toggleCompleted(resourceId)}
        className={`${button} ${completed ? 'text-done' : 'text-ink-soft hover:text-ink'}`}
      >
        <svg width={22} height={22} viewBox="0 0 22 22" aria-hidden>
          <circle
            cx={11}
            cy={11}
            r={8}
            fill={completed ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.6}
          />
          <path
            d="M7.4 11.2l2.5 2.4 4.7-4.9"
            fill="none"
            stroke={completed ? 'var(--paper)' : 'currentColor'}
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </span>
  );
}
