'use client';

import type { Resource } from '@/domain/model';
import { ACTION_VERB } from '@/domain/model';
import { markStarted } from '@/lib/progress-storage';
import { COST_LABEL, PT_BR_LABEL, PICK_REASON_TEXT } from '@/lib/reason-text';
import { technologyName } from '@/lib/tech-badge';
import { ProgressControls } from './progress-controls';

/**
 * Um recurso como linha de catálogo: o que é, quem fez, quanto custa em tempo e dinheiro.
 * Link externo para a página do detentor dos direitos (ADR-0005).
 *
 * Título e uma ficha em texto corrido, como a linha de lista dos apps (título + uma linha de
 * apoio). Antes eram até sete etiquetas com borda por material, e uma página de estação tinha
 * quinze materiais: o olho lia caixas, não títulos. Só o que é barreira (inglês, pago, cadastro)
 * ganha a cor de atenção.
 */
export function ResourceLine({
  resource,
  startHere,
  detailed,
  yourStack,
  compact,
}: {
  resource: Resource;
  startHere?: boolean;
  /** Na página da competência: mostra capítulos recomendados e o enunciado da missão. */
  detailed?: boolean;
  /** O material está na linguagem de servidor que a pessoa escolheu (ADR-0014). */
  yourStack?: boolean;
  /** Na estrada: só o que abre e a ficha; guardar e concluir ficam na página da estação. */
  compact?: boolean;
}) {
  const time = resource.estimatedTime?.split('(')[0].trim();
  // A linguagem do recurso: sem ela, o "comece aqui" de autenticação era um vídeo de Java
  // ao lado de práticas em Node e Django, e nada na linha avisava.
  const technology = resource.technology === 'agnostic' ? undefined : technologyName(resource.technology);
  const facts: { text: string; tone?: 'warn' | 'now' }[] = [
    ...(technology ? [{ text: technology }] : []),
    ...(yourStack ? [{ text: PICK_REASON_TEXT.YOUR_STACK, tone: 'now' as const }] : []),
    ...(time ? [{ text: time }] : []),
    ...(resource.published ? [{ text: publishedLabel(resource.published) }] : []),
    { text: PT_BR_LABEL[resource.ptBrStatus], tone: resource.ptBrStatus === 'none' ? ('warn' as const) : undefined },
    { text: COST_LABEL[resource.cost], tone: resource.cost === 'paid' ? ('warn' as const) : undefined },
    ...(resource.requiresSignup ? [{ text: 'exige cadastro', tone: 'warn' as const }] : []),
  ];
  return (
    <div className="min-w-0">
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => markStarted(resource.id)}
        className="tap text-ink focus-visible:outline-attention -my-1 inline-block py-1 text-[14.5px] leading-snug underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
      >
        {resource.title}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
      {startHere && (
        <span className="hand text-done ml-1.5 whitespace-nowrap text-[13px]">← comece aqui</span>
      )}
      <div className="mt-0.5 flex items-start gap-2">
        <p className="text-ink-soft min-w-0 flex-1 text-[12.5px] leading-snug">
          <span className="block">
            {ACTION_VERB[resource.actionType].toLowerCase()} · {resource.sourceName}
          </span>
          <span className="block">
            {facts.map((fact, index) => (
              <span key={fact.text}>
                {index > 0 && ' · '}
                <span
                  className={
                    fact.tone === 'warn' ? 'text-attention' : fact.tone === 'now' ? 'text-now' : undefined
                  }
                >
                  {fact.text}
                </span>
              </span>
            ))}
          </span>
        </p>
        {!compact && <ProgressControls resourceId={resource.id} title={resource.title} />}
      </div>
      {detailed && resource.chapters && (
        <span className="text-ink-soft mt-1 block text-[12.5px] leading-snug">
          Só a parte que serve agora: {resource.chapters}
        </span>
      )}
      {detailed && resource.task && (
        <span className="text-ink mt-2 block max-w-[65ch] border-l border-[var(--rule)] pl-2.5 text-[13.5px] leading-relaxed">
          <span className="text-ink-soft">Sua missão: </span>
          {resource.task}
        </span>
      )}
    </div>
  );
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
/** "2025-08-06" → "ago/2025": a data diz se o vídeo ainda vale, sem pedir que a pessoa abra. */
const publishedLabel = (date: string) => `${MONTHS[Number(date.slice(5, 7)) - 1]}/${date.slice(0, 4)}`;
