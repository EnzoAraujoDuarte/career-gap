'use client';

import { toggleCompleted, toggleSaved, useProgress } from '@/lib/progress-storage';

/**
 * Guardar para depois e marcar como concluído. Concluir não muda o nível da competência —
 * consumir não é saber fazer; o nível muda pela autoavaliação.
 */
export function ProgressControls({ resourceId }: { resourceId: string }) {
  const entry = useProgress()?.[resourceId];
  const saved = Boolean(entry?.savedAt);
  const completed = Boolean(entry?.completedAt);

  return (
    // 44 px de área de toque: o produto é usado sobretudo no celular.
    <span className="mt-0.5 flex flex-wrap gap-x-5">
      <button
        aria-pressed={saved}
        onClick={() => toggleSaved(resourceId)}
        className={`focus-visible:outline-attention inline-flex min-h-11 items-center text-[12.5px] focus-visible:outline-2 ${
          saved ? 'text-now' : 'text-ink-soft hover:text-ink'
        }`}
      >
        {saved ? '✓ na minha lista' : '+ minha lista'}
      </button>
      <button
        aria-pressed={completed}
        onClick={() => toggleCompleted(resourceId)}
        className={`focus-visible:outline-attention inline-flex min-h-11 items-center text-[12.5px] focus-visible:outline-2 ${
          completed ? 'text-done' : 'text-ink-soft hover:text-ink'
        }`}
      >
        {completed ? '✓ concluído' : 'marcar como concluído'}
      </button>
    </span>
  );
}
