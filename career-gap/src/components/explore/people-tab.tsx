'use client';

import Link from 'next/link';
import { CATALOG } from '@/catalog';
import type { Person } from '@/domain/model';
import { missingGates } from '@/domain/tools';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { SectionLabel } from '@/components/ecosystem/page-shell';
import { AdviceMark } from '@/components/ui/advice-mark';

/**
 * Quem vale seguir. Duas listas: quem já serve no primeiro dia e quem rende quando você já
 * programa. O portão vem do mesmo motor das ferramentas e é conselho, não cadeado (ADR-0009).
 */
export function PeopleTab() {
  const { profile } = useCurrentProfile();
  const suffix = useProfileSuffix();
  const fromDayOne = CATALOG.people.filter((person) => person.unlockedBy.length === 0);
  const later = CATALOG.people.filter((person) => person.unlockedBy.length > 0);

  return (
    <section className="mt-5">
      <p className="text-ink-soft text-[13px] leading-relaxed">
        Pessoas que publicam em português para quem está começando, escolhidas pelo autor, com a
        página oficial conferida. Siga poucas e acompanhe de verdade; o resto o Explorar já lista.
      </p>
      <PeopleList title="Desde o primeiro dia" people={fromDayOne} profile={profile} suffix={suffix} />
      <PeopleList title="Quando você já programa" people={later} profile={profile} suffix={suffix} />
    </section>
  );
}

function PeopleList({
  title,
  people,
  profile,
  suffix,
}: {
  title: string;
  people: readonly Person[];
  profile: ReturnType<typeof useCurrentProfile>['profile'];
  suffix: string;
}) {
  const nameOf = (competency: string) => CATALOG.competencies.get(competency)?.name ?? competency;
  if (people.length === 0) return null;
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <ul className="mt-3 space-y-5">
        {people.map((person) => {
          const missing = profile ? missingGates(person.unlockedBy, profile) : [];
          return (
            <li key={person.id}>
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <a
                  href={person.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink focus-visible:outline-attention text-[15px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                >
                  {person.name}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                {profile && person.unlockedBy.length > 0 && (missing.length === 0 ? (
                  <span className="hand text-done text-[13.5px]">✓ já rende para você</span>
                ) : (
                  <AdviceMark kind="missing-base" />
                ))}
              </p>
              <p className="text-ink mt-0.5 text-[14px] leading-relaxed">{person.publishes}</p>
              <p className="text-ink-soft mt-0.5 text-[13px] leading-relaxed">{person.why}</p>
              <p className="text-ink-faint mt-0.5 text-[12px]">
                {profile && missing.length > 0 && (
                  <>
                    rende depois de{' '}
                    {missing.map((gate, index) => (
                      <span key={gate.competency}>
                        {index > 0 && ' e '}
                        <Link
                          href={`/competencias/${gate.competency}${suffix}`}
                          className="underline decoration-[var(--rule)] underline-offset-2 hover:text-ink"
                        >
                          {nameOf(gate.competency)}
                        </Link>
                      </span>
                    ))}
                    {' · '}
                  </>
                )}
                {person.competencies.map((id, index) => (
                  <span key={id}>
                    {index > 0 && ' · '}
                    <Link
                      href={`/competencias/${id}${suffix}`}
                      className="underline decoration-[var(--rule)] underline-offset-2 hover:text-ink"
                    >
                      {nameOf(id)}
                    </Link>
                  </span>
                ))}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
