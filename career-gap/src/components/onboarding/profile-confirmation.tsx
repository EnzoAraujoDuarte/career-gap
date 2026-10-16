'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CompetencyId, Level } from '@/domain/model';
import { LEVEL_SHORT } from '@/lib/reason-text';
import { levelIndex } from '@/domain/model';
import { loadDraft, saveDraft, useStoredDraft } from '@/lib/profile-storage';
import { Loading, PageShell, SectionLabel } from '@/components/ecosystem/page-shell';

export interface ProfileRow {
  readonly competency: CompetencyId;
  readonly name: string;
  readonly targetLevel: Level;
}

export interface ProfileGroup {
  readonly title: string;
  readonly rows: readonly ProfileRow[];
}

/**
 * O perfil declarado, competência por competência, para corrigir (ADR-0003).
 *
 * Todo o roadmap depende desta estimativa, e só a pessoa pode corrigi-la. A lista segue a
 * ordem da trilha e não se reorganiza ao mudar um nível: antes ela separava "já faz" de "ainda
 * não", e a linha alterada pulava de seção debaixo do cursor e do foco do teclado.
 */
export function ProfileConfirmation({ groups }: { groups: readonly ProfileGroup[] }) {
  const stored = useStoredDraft();
  const [edited, setEdited] = useState<Record<string, Level> | undefined>(undefined);
  const levels = edited ?? (stored === undefined ? undefined : (stored?.levels ?? {}));

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

  const rows = groups.flatMap((group) => group.rows);
  const started = levels ? rows.filter((row) => (levels[row.competency] ?? 'L0') !== 'L0').length : 0;

  return (
    <PageShell
      current="minha-area"
      title="Ajustar o que já sei"
      intro="Corrija o que estiver errado: a trilha inteira é anotada a partir daqui. Concluir um recurso não muda o seu nível, porque assistir não é saber fazer; quem muda é você."
    >
      {!levels ? (
        <Loading />
      ) : (
        <>
          <p className="text-ink-soft mt-4 text-[13px]" aria-live="polite">
            <span className="text-done">{started}</span> de {rows.length} competências com algum
            nível marcado.
          </p>

          {groups.map((group) => (
            <section key={group.title}>
              <SectionLabel>{group.title}</SectionLabel>
              <ul className="divide-rule mt-1 divide-y">
                {group.rows.map((row) => (
                  <Row key={row.competency} row={row} level={levels[row.competency]} onChange={change} />
                ))}
              </ul>
            </section>
          ))}

          <div className="border-rule mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
            <Link
              href="/minha-area"
              className="text-ink-soft hover:text-ink focus-visible:outline-attention -my-3 inline-block py-3 text-[13px] underline underline-offset-2 focus-visible:outline-2"
            >
              ← Minha área
            </Link>
            <Link
              href="/trilha"
              className="bg-ink text-paper hover:bg-ink-soft focus-visible:outline-attention rounded-sm px-5 py-2.5 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Ver a trilha
            </Link>
          </div>
        </>
      )}
    </PageShell>
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
  const value = level ?? 'L0';

  return (
    <li className="flex items-center justify-between gap-4 py-1.5">
      <span className={`text-[14px] leading-snug ${value === 'L0' ? 'text-ink-soft' : 'text-ink'}`}>
        {row.name}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(row.competency, event.target.value as Level)}
        aria-label={`Seu nível em ${row.name}`}
        className="border-rule bg-paper text-ink focus-visible:outline-attention min-h-11 shrink-0 rounded-sm border px-2 text-[13.5px] focus-visible:outline-2"
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
