'use client';

import type { Level } from '@/domain/model';
import { toggleCriterion, useCriteria } from '@/lib/criteria-storage';
import { criteriaKey } from '@/lib/user-state';

/**
 * Critério de saída, marcável e guardado.
 *
 * Marcar NÃO promove o nível: registra a afirmação e torna o progresso
 * visível. A alternativa que descartamos promovia 16 das 25 competências com um clique, e um
 * checklist que se autopromove é o caminho mais barato para inflar o próprio roadmap. Ao marcar
 * tudo, o componente oferece concluir a estação: uma declaração à parte, explícita e reversível
 * (ADR-0017), em vez de mandar a pessoa refazer a autoavaliação noutra página.
 */
export function ExitCriteria({
  competencyId,
  level,
  criteria,
  competencyName,
  readOnly = false,
  done = false,
  onConclude,
}: {
  competencyId: string;
  level: Level;
  criteria: readonly string[];
  competencyName: string;
  /** Congelado durante a sessão experimental, nas duas condições. */
  readOnly?: boolean;
  /** A estação já está concluída: o nível chegou ao que a vaga pede. */
  done?: boolean;
  /** Concluir a estação; sem ele (perfil de demonstração), o aviso só informa. */
  onConclude?: () => void;
}) {
  const stored = useCriteria();
  if (criteria.length === 0) return null;

  const checked = new Set(stored?.[criteriaKey(competencyId, level)]?.checked ?? []);
  const complete = checked.size === criteria.length;

  return (
    <section>
      <h3 className="font-serif text-ink text-[18px] leading-snug">
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
        <div className="border-done mt-3 border-l-2 pl-3">
          {done ? (
            <p className="text-done text-[13.5px] leading-snug">Tudo marcado e estação concluída.</p>
          ) : (
            <>
              <p className="text-ink text-[13.5px] leading-snug">
                Você marcou tudo em <strong className="font-medium">{competencyName}</strong>.
              </p>
              <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">
                Marcar os critérios não muda o seu nível sozinho. Se você já faz isso sem ajuda, conclua
                a estação e a trilha passa para a próxima.
              </p>
              {onConclude && (
                <button
                  type="button"
                  onClick={onConclude}
                  className="border-done text-done focus-visible:outline-attention mt-2 inline-flex min-h-11 items-center rounded-sm border px-3 text-[13.5px] focus-visible:outline-2"
                >
                  Concluir a estação
                </button>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
