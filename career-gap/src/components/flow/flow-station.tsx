'use client';

import type { ViewNode } from '@/lib/roadmap-view';
import { ACTION_VERB } from '@/domain/model';
import { technologyName } from '@/lib/tech-badge';
import { Tag } from '@/components/ui/tag';
import { ExitCriteria } from './exit-criteria';
import {
  COST_LABEL,
  ENGLISH_ONLY_NOTE,
  LEVEL_SHORT,
  PICK_REASON_TEXT,
  PT_BR_LABEL,
  REASON_TEXT,
  primaryReason,
} from '@/lib/reason-text';

/** Razões que valem uma linha na visão fechada. "É essencial para o objetivo" é verdade em
 *  quase todo nó core — repeti-la em oito itens seguidos não informa, só ocupa. */
const DISTINGUISHING = new Set([
  // BLOCKED_BY_PREREQUISITE fica de fora: a linha "abre depois de X" já diz isso, com o
  // nome do bloqueador, o que é mais útil que a frase genérica.
  'NEEDS_VERIFICATION',
  'UNLOCKS_OTHER_COMPETENCIES',
  'LARGE_GAP',
]);

const DOT = {
  now: { color: 'var(--state-now)', filled: true },
  available: { color: 'var(--ink-soft)', filled: false },
  blocked: { color: 'var(--ink-faint)', filled: false },
  met: { color: 'var(--state-done)', filled: true },
} as const;

/**
 * Uma estação do fluxo.
 *
 * Fechada mostra o suficiente para decidir se interessa; aberta vira a ficha inteira, no
 * lugar — sem painel lateral, que é o que obrigava a ter uma interface separada no celular.
 */
export function FlowStation({
  node,
  expanded,
  onToggle,
  alwaysOpen,
  readOnlyCriteria,
}: {
  node: ViewNode;
  expanded: boolean;
  onToggle?: () => void;
  alwaysOpen?: boolean;
  /** Congelado durante a sessão experimental, nas duas condições. */
  readOnlyCriteria?: boolean;
}) {
  const dot = DOT[node.status];
  const isFocus = node.status === 'now';
  const reason = primaryReason(node.reasonCodes);
  const reasonIsDistinguishing =
    reason !== undefined && DISTINGUISHING.has(reason);
  const onlyEnglish =
    node.resources.length > 0 && node.resources.every((r) => r.resource.ptBrStatus === 'none');

  return (
    <li className="relative pl-7">
      <span
        className="absolute bottom-0 left-[6px] top-2.5 w-px bg-[var(--rule)]"
        aria-hidden
      />
      <span
        className="absolute left-0 top-[6px] h-[13px] w-[13px] rounded-full border-2"
        style={{
          borderColor: dot.color,
          background: dot.filled ? dot.color : 'var(--paper)',
          boxShadow: isFocus ? '0 0 0 4px var(--tint-now)' : undefined,
        }}
        aria-hidden
      />

      <div className="pb-6">
        <Header node={node} isFocus={isFocus} expanded={expanded} onToggle={onToggle} />

        <p className="text-ink-soft mt-0.5 text-[12px]">
          {LEVEL_SHORT[node.currentLevel]} → {LEVEL_SHORT[node.targetLevel]}
          {node.resources.length > 0 && ` · ${node.resources.length} recursos`}
        </p>

        {node.blockedBy.length > 0 && (
          <p className="text-ink-faint mt-1 text-[12px] leading-snug">
            abre depois de {node.blockedBy.join(', ')}
          </p>
        )}

        {!expanded && reason && reasonIsDistinguishing && !isFocus && (
          <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">{REASON_TEXT[reason]}</p>
        )}

        {(expanded || alwaysOpen) && (
          <div className="mt-3">
            <p className="text-ink-soft text-[13.5px] leading-relaxed">{node.summary}</p>

            {node.reasonCodes.length > 0 && (
              <ul className="mt-3 space-y-1">
                {node.reasonCodes.map((code) => (
                  <li key={code} className="text-ink-soft flex gap-2 text-[12.5px] leading-snug">
                    <span className="text-ink-faint">—</span>
                    {REASON_TEXT[code]}
                  </li>
                ))}
              </ul>
            )}

            {node.resources.length > 0 && (
              <>
                <p className="font-serif mt-5 text-[13.5px] text-ink-soft">
                  O que fazer
                </p>
                {onlyEnglish && (
                  <p className="text-attention mt-1.5 border-l border-[var(--state-attention)] pl-2 text-[12px] leading-snug">
                    {ENGLISH_ONLY_NOTE}
                  </p>
                )}
                <ol className="mt-2.5 space-y-3.5">
                  {node.resources.map(({ resource, recommended, reasons }, index) => (
                    <li key={resource.id} className="flex gap-3.5">
                      <span className="font-serif text-[19px] leading-none text-ink-faint">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-ink focus-visible:outline-attention -my-1 inline-block py-1 text-[14.5px] leading-snug underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                        >
                          {resource.title}
                        </a>
                        {recommended && (
                          <span className="hand text-done ml-1.5 whitespace-nowrap text-[13px]">
                            ← comece aqui
                          </span>
                        )}
                        <span className="text-ink-soft mt-0.5 block text-[12px]">
                          {ACTION_VERB[resource.actionType].toLowerCase()} · {resource.sourceName}
                        </span>
                        <span className="mt-1 flex flex-wrap gap-1.5">
                          <Tag warn={resource.ptBrStatus === 'none'}>
                            {PT_BR_LABEL[resource.ptBrStatus]}
                          </Tag>
                          <Tag warn={resource.cost === 'paid'}>{COST_LABEL[resource.cost]}</Tag>
                          {resource.estimatedTime && <Tag>{resource.estimatedTime}</Tag>}
                          {resource.requiresSignup && <Tag warn>exige cadastro</Tag>}
                        </span>
                        {resource.chapters && (
                          <span className="text-ink-soft mt-1 block text-[12px] leading-snug">
                            Só a parte que serve agora: {resource.chapters}
                          </span>
                        )}
                        {resource.task && (
                          <span className="text-ink mt-2 block border-l-2 border-[var(--rule)] pl-2.5 text-[13px] leading-relaxed">
                            <span className="text-ink-soft">Sua missão: </span>
                            {resource.task}
                          </span>
                        )}
                        {recommended && reasons.length > 0 && (
                          <span className="text-ink-faint mt-1 block text-[12px] leading-snug">
                            Escolhido por ser {reasons.map((r) => PICK_REASON_TEXT[r]).join(', ')}.
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {node.habits.length > 0 && (
              <>
                <p className="font-serif mt-6 text-[13.5px] text-ink-soft">
                  Como profissionais fazem
                </p>
                <ul className="mt-2.5 space-y-3">
                  {node.habits.map((habit) => (
                    <li key={habit.id} className="leading-snug">
                      <span className="text-ink block text-[14px]">{habit.title}</span>
                      <span className="text-ink-soft mt-0.5 block text-[13px] leading-relaxed">
                        {habit.detail}
                      </span>
                      <span className="text-ink-faint mt-0.5 block text-[12px]">{habit.credit}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-6">
              <ExitCriteria
                competencyId={node.id}
                level={node.targetLevel}
                criteria={node.exitCriteria}
                competencyName={node.name}
                readOnly={readOnlyCriteria}
              />
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

function Header({
  node,
  isFocus,
  expanded,
  onToggle,
}: {
  node: ViewNode;
  isFocus: boolean;
  expanded: boolean;
  onToggle?: () => void;
}) {
  const title = (
    <>
      <span
        className={
          isFocus
            ? 'font-serif text-ink text-[22px] leading-tight'
            : 'text-ink text-[14.5px] leading-snug'
        }
      >
        {node.name}
      </span>
      {node.techBadge && <TechSuffix technology={node.techBadge} />}
      {isFocus && <span className="hand text-now ml-2 text-[14px]">← você está aqui</span>}
      {node.needsVerification && !isFocus && (
        <span className="hand text-attention ml-1.5 text-[12.5px]">verificar?</span>
      )}
    </>
  );

  if (!onToggle) return <p className="flex flex-wrap items-baseline gap-x-1">{title}</p>;

  return (
    <button
      onClick={onToggle}
      aria-expanded={expanded}
      className="focus-visible:outline-attention -my-1.5 flex w-full flex-wrap items-baseline gap-x-1 py-1.5 text-left focus-visible:outline-2"
    >
      {title}
      <span className="text-ink-faint ml-auto pl-2 text-[12px]" aria-hidden>
        {expanded ? '▴' : '▾'}
      </span>
    </button>
  );
}

function TechSuffix({ technology }: { technology: string }) {
  const name = technologyName(technology);
  if (!name) return null;
  return <span className="text-ink-faint text-[13px]"> — com {name}</span>;
}

