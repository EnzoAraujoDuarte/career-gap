'use client';

import Link from 'next/link';
import type { Level } from '@/domain/model';
import { toggleCriterion, useCriteria } from '@/lib/criteria-storage';
import { criteriaKey } from '@/lib/user-state';

/**
 * Critério de saída, marcável e guardado.
 *
 * Marcar NÃO promove o nível (docs/DECISOES.md §3): registra a afirmação e torna o progresso
 * visível. A alternativa que descartamos promovia 16 das 25 competências com um clique, e um
 * checklist que se autopromove é o caminho mais barato para inflar o próprio roadmap. Ao marcar
 * tudo, o componente aponta para a autoavaliação — é ela que muda o nível.
 */
export function ExitCriteria({
  competencyId,
  level,
  criteria,
  competencyName,
  readOnly = false,
}: {
  competencyId: string;
  level: Level;
  criteria: readonly string[];
  competencyName: string;
  /** Congelado durante a sessão experimental, nas duas condições (DECISOES §3). */
  readOnly?: boolean;
}) {
  const stored = useCriteria();
  if (criteria.length === 0) return null;

  const checked = new Set(stored?.[criteriaKey(competencyId, level)]?.checked ?? []);
  const complete = checked.size === criteria.length;

  return (
    <section>
      <h3 className="font-serif text-[13.5px] text-ink-soft">
        Você terminou quando
        {checked.size > 0 && (
          <span className="text-done ml-2 normal-case tracking-normal">
            {checked.size} de {criteria.length}
          </span>
        )}
      </h3>
      <ul className="mt-2 space-y-1.5">
        {criteria.map((criterion, index) => (
          <li key={criterion}>
            <label className="text-ink -mx-1 flex cursor-pointer items-start gap-2.5 rounded-sm px-1 py-1.5 text-[13.5px] leading-relaxed hover:bg-paper-edge">
              <input
                type="checkbox"
                checked={checked.has(index)}
                onChange={() => toggleCriterion(competencyId, level, index)}
                disabled={readOnly}
                className="accent-done mt-[3px] h-4 w-4 shrink-0"
              />
              <span className={checked.has(index) ? 'text-ink-soft line-through' : undefined}>
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
            Marcar não muda o seu nível. Se você já faz isso sem ajuda, diga — a trilha se ajusta.
          </p>
          <Link
            href="/perfil"
            className="border-done text-done focus-visible:outline-attention mt-2 inline-block rounded-sm border px-2 py-1 text-[12px] focus-visible:outline-2"
          >
            Ajustar meu nível
          </Link>
        </div>
      )}
    </section>
  );
}
