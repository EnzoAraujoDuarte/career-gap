'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CareerTrack, Level } from '@/domain/model';
import { loadDraft, saveDraft, useStoredDraft } from '@/lib/profile-storage';
import { answeredStatement, applyAnswer } from '@/lib/quick-assessment';

/**
 * Autoavaliação em seis temas, um por tela.
 *
 * Eram 25 telas, uma por competência — o custo vinha antes do valor. Agora cada tema tem duas
 * frases "consigo…" e cada frase declara quais competências afirma (`quickAssessment` no
 * track). O que não é perguntado começa em "ainda não" e se ajusta na página da competência.
 *
 * As frases continuam ancoradas em tarefa. Nunca se pergunta "dê uma nota de 1 a 5": item
 * abstrato é o menos confiável que existe, e o ancorado em tarefa leva a pessoa a subestimar
 * em vez de inflar (ADR-0003).
 */
export function SelfAssessment({ track }: { track: CareerTrack }) {
  const router = useRouter();
  // Ler localStorage no inicializador de estado quebra a hidratação: o servidor não tem
  // navegador e devolve vazio, o cliente devolve o rascunho. `useStoredDraft` resolve isso
  // por `useSyncExternalStore`, que é a ferramenta para estado externo ao React.
  const stored = useStoredDraft();
  const [edited, setEdited] = useState<Record<string, Level> | undefined>(undefined);
  const levels = edited ?? stored?.levels ?? {};
  const [index, setIndex] = useState(0);
  const [askingEmphasis, setAskingEmphasis] = useState(false);

  const questions = track.quickAssessment;
  const question = questions[index];
  const credited = Object.values(levels).filter((level) => level !== 'L0').length;
  const total = track.requirements.length;

  const persist = (next: Record<string, Level>, emphasisId?: string) => {
    const draft = loadDraft();
    saveDraft({
      trackId: track.id,
      emphasisId: emphasisId ?? draft?.emphasisId,
      levels: next,
    });
  };

  const answer = (statementIndex: number | undefined) => {
    const next = applyAnswer(track, levels, question, statementIndex);
    setEdited(next);
    persist(next);
    if (index + 1 < questions.length) setIndex(index + 1);
    else setAskingEmphasis(true);
  };

  if (askingEmphasis) {
    return (
      <Shell step="Opcional" progress={1} credited={credited} total={total}>
        <h1 className="font-serif text-ink mt-4 text-[25px] leading-tight">
          Já tem ideia de qual lado quer seguir?
        </h1>
        <p className="text-ink-soft mt-2 text-[13.5px] leading-snug">
          Dá para mudar depois. Isso só muda o peso de algumas competências.
        </p>
        <div className="mt-5 space-y-2.5">
          <Option
            onSelect={() => {
              persist(levels, undefined);
              router.push('/trilha');
            }}
            label="Ainda não sei"
            hint="Caminho equilibrado — a maioria começa assim"
          />
          {track.emphases.map((emphasis) => (
            <Option
              key={emphasis.id}
              onSelect={() => {
                persist(levels, emphasis.id);
                router.push('/trilha');
              }}
              label={emphasis.name.replace('Ênfase em ', '')}
              hint={emphasis.description}
            />
          ))}
        </div>
      </Shell>
    );
  }

  const selected = answeredStatement(track, levels, question);
  const answeredNo = question.statements
    .flatMap((statement) => statement.competencies)
    .every((competency) => levels[competency] === 'L0');
  return (
    <Shell
      step={`${index + 1} de ${questions.length}`}
      progress={index / questions.length}
      credited={credited}
      total={total}
      onBack={index > 0 ? () => setIndex(index - 1) : undefined}
    >
      <h1 className="font-serif text-ink mt-4 text-[25px] leading-tight">{question.title}</h1>
      <p className="text-ink-soft mt-1.5 text-[13.5px] leading-snug">{question.summary}</p>

      <div className="mt-6 space-y-2.5">
        <Option onSelect={() => answer(undefined)} label="Ainda não" muted selected={answeredNo} />
        {question.statements.map((statement, statementIndex) => (
          <Option
            key={statement.level}
            onSelect={() => answer(statementIndex)}
            label={statement.canDo}
            selected={selected === statementIndex}
          />
        ))}
      </div>
    </Shell>
  );
}

function Shell({
  step,
  progress,
  credited,
  total,
  onBack,
  children,
}: {
  step: string;
  progress: number;
  credited: number;
  total: number;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-paper flex min-h-dvh flex-col px-5 py-7">
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
        {/* Decorativa: o "1 de 6" logo abaixo já diz o progresso em texto. */}
        <div className="bg-rule h-1 overflow-hidden rounded-full" aria-hidden>
          <div
            className="bg-done h-full origin-left transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-ink-faint text-[12px]">{step}</p>
          {/* Crédito ao vivo: começar em zero deprime quem já sabe alguma coisa, e o crédito
              aqui é real — sai do mesmo motor de elegibilidade. */}
          <p className="text-ink-soft text-[12px]">
            <strong className="text-done font-medium">{credited}</strong> já no seu mapa
          </p>
        </div>

        <div className="flex-1">{children}</div>

        <div className="border-rule mt-6 flex items-center justify-between border-t pt-4">
          {onBack ? (
            <button
              onClick={onBack}
              className="text-ink-soft hover:text-ink focus-visible:outline-attention text-[13px] focus-visible:outline-2"
            >
              ← voltar
            </button>
          ) : (
            <Link
              href="/"
              className="text-ink-soft hover:text-ink focus-visible:outline-attention text-[13px] focus-visible:outline-2"
            >
              ← sair
            </Link>
          )}
          <p className="text-ink-faint text-[12px]">{total} competências ao todo</p>
        </div>
      </div>
    </main>
  );
}

function Option({
  onSelect,
  label,
  hint,
  muted,
  selected,
}: {
  onSelect: () => void;
  label: string;
  hint?: string;
  muted?: boolean;
  selected?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`focus-visible:outline-attention block w-full rounded-sm border px-3.5 py-3 text-left transition-colors focus-visible:outline-2 ${
        selected ? 'border-now bg-tint-now' : 'border-rule hover:border-ink-faint'
      }`}
    >
      <span className={`block text-[14px] leading-snug ${muted ? 'text-ink-faint' : 'text-ink'}`}>
        {label}
      </span>
      {hint && <span className="text-ink-soft mt-0.5 block text-[12.5px] leading-snug">{hint}</span>}
    </button>
  );
}
