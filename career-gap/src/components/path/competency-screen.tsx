'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { Resource } from '@/domain/model';
import { generateRoadmap } from '@/domain/roadmap';
import { buildCompetencyView, type Neighbor } from '@/lib/competency-view';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { LEVEL_SHORT } from '@/lib/reason-text';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { EcosystemNav } from '@/components/ecosystem/ecosystem-nav';
import { SectionLabel } from '@/components/ecosystem/page-shell';
import { ExitCriteria } from '@/components/flow/exit-criteria';
import { AdviceMark } from '@/components/ui/advice-mark';
import { ResourceLine } from '@/components/ui/resource-line';

export function CompetencyScreen({ id }: { id: string }) {
  const { profile } = useCurrentProfile();
  const suffix = useProfileSuffix();
  const track = (profile && CATALOG.tracks.get(profile.trackId)) || FIRST_WEB_ROLE;
  const competency = useMemo(
    () =>
      buildCompetencyView(
        CATALOG,
        track,
        id,
        profile ? buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG) : undefined,
      ),
    [id, profile, track],
  );

  if (!competency) return null;

  return (
    <main className="min-h-dvh bg-paper px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <EcosystemNav current="trilha" />

        <Link
          href={`/trilha${suffix}`}
          className="text-ink-soft hover:text-ink focus-visible:outline-attention mt-7 inline-block py-1 text-[13px] focus-visible:outline-2"
        >
          ← Trilha{competency.levelTitle && ` · ${competency.levelTitle}`}
        </Link>
        <h1 className="font-serif text-ink mt-1 text-[28px] leading-tight">{competency.name}</h1>
        <p className="text-ink-soft mt-1 text-[12.5px]">
          a vaga pede: {LEVEL_SHORT[competency.targetLevel]} ·{' '}
          {competency.learn.length + competency.practice.length + competency.prove.length} recursos
        </p>
        <p className="text-ink mt-3 text-[14.5px] leading-relaxed">{competency.summary}</p>

        {competency.advice && (
          <div className="mt-4 border-l-2 border-[var(--rule)] pl-3">
            <AdviceMark kind={competency.advice.kind} />
            <p className="text-ink-soft mt-0.5 text-[13px] leading-snug">{competency.advice.reason}</p>
          </div>
        )}

        {competency.before.length > 0 && (
          <Neighbors
            title="Antes, vale ter"
            hint="Não se sente pronto? Comece por aqui. É conselho, não cadeado."
            items={competency.before}
            suffix={suffix}
          />
        )}

        <ResourceGroup title="Aprender" resources={competency.learn} startId={competency.startId} />
        <ResourceGroup
          title="Praticar"
          resources={competency.practice}
          hint="Só assistir não forma ninguém: escolha pelo menos uma."
        />
        <ResourceGroup
          title="Provar"
          resources={competency.prove}
          hint="Dá para mostrar a alguém: vai para o portfólio ou passa por conferência."
        />

        {competency.habits.length > 0 && (
          <>
            <SectionLabel>Como profissionais fazem</SectionLabel>
            <ul className="mt-3 space-y-3">
              {competency.habits.map((habit) => (
                <li key={habit.id} className="leading-snug">
                  <span className="text-ink block text-[14px]">{habit.title}</span>
                  <span className="text-ink-soft mt-0.5 block text-[13px] leading-relaxed">{habit.detail}</span>
                  <span className="text-ink-faint mt-0.5 block text-[12px]">{habit.credit}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-9">
          <ExitCriteria criteria={competency.exitCriteria} competencyName={competency.name} />
        </div>

        {competency.opens.length > 0 && (
          <Neighbors title="Abre caminho para" items={competency.opens} suffix={suffix} />
        )}
      </div>
    </main>
  );
}

function ResourceGroup({
  title,
  resources,
  startId,
  hint,
}: {
  title: string;
  resources: readonly Resource[];
  startId?: string;
  hint?: string;
}) {
  if (resources.length === 0) return null;
  return (
    <section>
      <SectionLabel>
        {title} · {resources.length}
      </SectionLabel>
      {hint && <p className="text-ink-soft mt-1 text-[12.5px]">{hint}</p>}
      <ul className="mt-3 space-y-4">
        {resources.map((resource) => (
          <li key={resource.id}>
            <ResourceLine resource={resource} startHere={resource.id === startId} detailed />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Neighbors({
  title,
  hint,
  items,
  suffix,
}: {
  title: string;
  hint?: string;
  items: readonly Neighbor[];
  suffix: string;
}) {
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      {hint && <p className="text-ink-soft mt-1 text-[12.5px]">{hint}</p>}
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="text-[14px] leading-snug">
            <Link
              href={`/competencias/${item.id}${suffix}`}
              className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
            >
              {item.name}
            </Link>
            <span className="text-ink-soft text-[12.5px]"> · {LEVEL_SHORT[item.atLevel]}</span>
            {item.ready === true && <span className="hand text-done ml-1.5 text-[13px]">✓ você tem</span>}
            {item.ready === false && <span className="hand text-attention ml-1.5 text-[13px]">↑ ainda não</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
