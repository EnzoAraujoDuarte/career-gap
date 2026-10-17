'use client';

import type { Resource } from '@/domain/model';
import { ACTION_VERB } from '@/domain/model';
import { markStarted } from '@/lib/progress-storage';
import { COST_LABEL, PT_BR_LABEL, PICK_REASON_TEXT } from '@/lib/reason-text';
import { technologyName } from '@/lib/tech-badge';
import { ProgressControls } from './progress-controls';
import { Tag } from './tag';

/**
 * Um recurso como linha de catálogo: o que é, quem fez, quanto custa em tempo e dinheiro.
 * Link externo para a página do detentor dos direitos (ADR-0005).
 */
export function ResourceLine({
  resource,
  startHere,
  detailed,
  yourStack,
}: {
  resource: Resource;
  startHere?: boolean;
  /** Na página da competência: mostra capítulos recomendados e o enunciado da missão. */
  detailed?: boolean;
  /** O material está na linguagem de servidor que a pessoa escolheu (ADR-0014). */
  yourStack?: boolean;
}) {
  const time = resource.estimatedTime?.split('(')[0].trim();
  // A linguagem do recurso: sem ela, o "comece aqui" de autenticação era um vídeo de Java
  // ao lado de práticas em Node e Django, e nada na linha avisava.
  const technology = resource.technology === 'agnostic' ? undefined : technologyName(resource.technology);
  return (
    <div className="min-w-0">
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => markStarted(resource.id)}
        className="text-ink focus-visible:outline-attention -my-1 inline-block py-1 text-[14.5px] leading-snug underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
      >
        {resource.title}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
      {startHere && (
        <span className="hand text-done ml-1.5 whitespace-nowrap text-[13px]">← comece aqui</span>
      )}
      <span className="text-ink-soft mt-0.5 block text-[12px]">
        {ACTION_VERB[resource.actionType].toLowerCase()} · {resource.sourceName}
      </span>
      <span className="mt-1 flex flex-wrap gap-1.5">
        <Tag warn={resource.ptBrStatus === 'none'}>{PT_BR_LABEL[resource.ptBrStatus]}</Tag>
        {technology && <Tag>{technology}</Tag>}
        {yourStack && <Tag>{PICK_REASON_TEXT.YOUR_STACK}</Tag>}
        <Tag warn={resource.cost === 'paid'}>{COST_LABEL[resource.cost]}</Tag>
        {time && <Tag>{time}</Tag>}
        {resource.published && <Tag>{publishedLabel(resource.published)}</Tag>}
        {resource.requiresSignup && <Tag warn>exige cadastro</Tag>}
      </span>
      {detailed && resource.chapters && (
        <span className="text-ink-soft mt-1 block text-[12px] leading-snug">
          Só a parte que serve agora: {resource.chapters}
        </span>
      )}
      {detailed && resource.task && (
        <span className="text-ink mt-2 block max-w-[65ch] border-l border-[var(--rule)] pl-2.5 text-[13px] leading-relaxed">
          <span className="text-ink-soft">Sua missão: </span>
          {resource.task}
        </span>
      )}
      <ProgressControls resourceId={resource.id} title={resource.title} />
    </div>
  );
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
/** "2025-08-06" → "ago/2025": a data diz se o vídeo ainda vale, sem pedir que a pessoa abra. */
const publishedLabel = (date: string) => `${MONTHS[Number(date.slice(5, 7)) - 1]}/${date.slice(0, 4)}`;
