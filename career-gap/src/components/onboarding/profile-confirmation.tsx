'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CompetencyId, Level } from '@/domain/model';
import { LEVEL_SHORT } from '@/lib/reason-text';
import { levelIndex } from '@/domain/model';
import { loadDraft, saveDraft, useStoredDraft } from '@/lib/profile-storage';

export interface ProfileRow {
  readonly competency: CompetencyId;
  readonly name: string;
  readonly targetLevel: Level;
}

/**
 * O perfil inferido é exibido e confirmado antes de virar estado (ADR-0003).
 *
 * Não é etapa opcional: todo o roadmap depende desta estimativa, e o usuário é a única
 * pessoa que pode corrigi-la. Também é o momento em que ele entende que o sistema não
 * adivinhou nada — só organizou o que ele próprio declarou.
 */
export function ProfileConfirmation({ rows }: { rows: readonly ProfileRow[] }) {
  const stored = useStoredDraft();
  const [edited, setEdited] = useState<Record<string, Level> | undefined>(undefined);
  const levels = edited ?? (stored === undefined ? undefined : (stored?.levels ?? {}));

  if (!levels) {
    return <main className="text-ink-faint p-10 text-[14px]">Carregando seu perfil…</main>;
  }

  const change = (competency: string, level: Level) => {
    const next = { ...levels, [competency]: level };
    setEdited(next);
    const draft = loadDraft();
    saveDraft({
      trackId: draft?.trackId ?? 'first-web-role',
      emphasisId: draft?.emphasisId,
      levels: next,
    });
  };

  const known = rows.filter((row) => (levels[row.competency] ?? 'L0') !== 'L0');
  const missing = rows.filter((row) => (levels[row.competency] ?? 'L0') === 'L0');

  return (
    <main className="mx-auto flex min-h-dvh max-w-[680px] flex-col px-5 py-10">
      <header className="mb-6">
        <p className="hand text-ink-faint text-[14px]">passo 3 de 3</p>
        <h1 className="hand text-ink mt-1 text-[30px] leading-tight">Foi isso que entendemos</h1>
        <p className="text-ink-soft mt-2 text-[13.5px] leading-snug">
          Corrija o que estiver errado antes de seguir — o caminho inteiro é montado a partir
          daqui.
        </p>
      </header>

      <Section title={`Você já faz (${known.length})`} tone="done">
        {known.map((row) => (
          <Row key={row.competency} row={row} level={levels[row.competency]} onChange={change} />
        ))}
        {known.length === 0 && (
          <p className="text-ink-faint py-2 text-[13px]">
            Nada marcado ainda — tudo bem, é daí que a maioria começa.
          </p>
        )}
      </Section>

      <Section title={`Ainda não (${missing.length})`} tone="mute">
        {missing.map((row) => (
          <Row key={row.competency} row={row} level={levels[row.competency]} onChange={change} />
        ))}
      </Section>

      <div className="border-rule mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
        <Link
          href="/avaliacao"
          className="text-ink-soft hover:text-ink focus-visible:outline-attention text-[13px] underline underline-offset-2 focus-visible:outline-2"
        >
          voltar e revisar
        </Link>
        <Link
          href="/trilha"
          className="bg-ink text-paper hover:bg-ink-soft focus-visible:outline-attention rounded-sm px-5 py-2.5 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Ver meu caminho
        </Link>
      </div>
    </main>
  );
}

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone: 'done' | 'mute';
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className={`hand text-[16px] ${tone === 'done' ? 'text-done' : 'text-ink-faint'}`}>
        {title.toUpperCase()}
      </h2>
      <ul className="divide-rule mt-1 divide-y">{children}</ul>
    </section>
  );
}

function Row({
  row,
  level,
  onChange,
}: {
  row: ProfileRow;
  level: Level | undefined;
  onChange: (competency: string, level: Level) => void;
}) {
  const options: Level[] = ['L0', 'L1', 'L2'].filter(
    (candidate) => levelIndex(candidate as Level) <= levelIndex(row.targetLevel),
  ) as Level[];

  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <span className="text-ink text-[13.5px] leading-snug">{row.name}</span>
      <select
        value={level ?? 'L0'}
        onChange={(event) => onChange(row.competency, event.target.value as Level)}
        aria-label={`Seu nível em ${row.name}`}
        className="border-rule bg-paper text-ink focus-visible:outline-attention shrink-0 rounded-sm border px-2 py-1 text-[12.5px] focus-visible:outline-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {LEVEL_SHORT[option]}
          </option>
        ))}
      </select>
    </li>
  );
}
