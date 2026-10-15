'use client';

import { useState } from 'react';

/**
 * Critério de saída, marcável.
 *
 * Marcar NÃO promove o nível (docs/DECISOES.md §3): registra a afirmação e torna o progresso
 * visível. Quem promove é evidência — por isso, ao completar, o componente OFERECE a
 * verificação em vez de dar o nível de graça. A alternativa que descartamos promovia 16 das
 * 25 competências com um clique, e um checklist que se autopromove é o caminho mais barato
 * para inflar o próprio roadmap.
 */
export function ExitCriteria({
  criteria,
  competencyName,
  readOnly = false,
}: {
  criteria: readonly string[];
  competencyName: string;
  readOnly?: boolean;
}) {
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());
  if (criteria.length === 0) return null;

  const complete = checked.size === criteria.length;

  const toggle = (index: number) =>
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <section>
      <h3 className="font-serif text-[12.5px] tracking-[0.1em] text-ink-soft">
        Você terminou quando
      </h3>
      <ul className="mt-2 space-y-1.5">
        {criteria.map((criterion, index) => (
          <li key={criterion}>
            <label className="text-ink -mx-1 flex cursor-pointer items-start gap-2.5 rounded-sm px-1 py-1.5 text-[13.5px] leading-relaxed hover:bg-paper-edge">
              <input
                type="checkbox"
                checked={checked.has(index)}
                onChange={() => toggle(index)}
                disabled={readOnly}
                className="accent-done mt-[3px] h-4 w-4 shrink-0"
              />
              <span className={checked.has(index) ? 'text-ink-faint line-through' : undefined}>
                {criterion}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {complete && !readOnly && (
        <div className="border-done mt-3 border-l-2 pl-2.5">
          <p className="text-ink text-[12.5px] leading-snug">
            Você marcou tudo em <strong className="font-medium">{competencyName}</strong>.
          </p>
          <p className="text-ink-soft mt-1 text-[12px] leading-snug">
            Marcar não muda seu nível — quem muda é uma verificação rápida. Quer confirmar em
            3 perguntas?
          </p>
          <button
            className="border-done text-done focus-visible:outline-attention mt-2 rounded-sm border px-2 py-1 text-[12px] focus-visible:outline-2"
            disabled
            title="Sondagens entram no próximo bloco"
          >
            Verificar em 3 perguntas
          </button>
        </div>
      )}
    </section>
  );
}
