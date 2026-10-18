'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { levelAtLeast, type Resource } from '@/domain/model';
import { generateRoadmap } from '@/domain/roadmap';
import { exercisePrompt, studyPrompt, type PromptContext } from '@/lib/ai-prompt';
import { buildBuildsView, type BuildView } from '@/lib/builds-view';
import { buildCompetencyView, type Neighbor } from '@/lib/competency-view';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { useProgress } from '@/lib/progress-storage';
import { LEVEL_ASKED, LEVEL_SHORT } from '@/lib/reason-text';
import { buildPathView } from '@/lib/path-view';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { aimReturnAt } from '@/lib/scroll-memory';
import { concludeStation, reopenStation } from '@/lib/station-done';
import { EcosystemNav } from '@/components/ecosystem/ecosystem-nav';
import { SectionLabel } from '@/components/ecosystem/page-shell';
import { ExitCriteria } from '@/components/flow/exit-criteria';
import { AdviceMark } from '@/components/ui/advice-mark';
import { BackBar } from '@/components/ui/back-bar';
import { BuildGlyph } from '@/components/ui/build-glyph';
import { CheckCircle } from '@/components/ui/check-circle';
import { CopyPrompt } from '@/components/ui/copy-prompt';
import { ResourceLine } from '@/components/ui/resource-line';
import { BuildMark } from './build-mark';

export function CompetencyScreen({ id }: { id: string }) {
  const { profile, demoId } = useCurrentProfile();
  const suffix = useProfileSuffix();
  const progress = useProgress();
  const track = (profile && CATALOG.tracks.get(profile.trackId)) || FIRST_WEB_ROLE;
  const builds = useMemo(
    () =>
      buildBuildsView(CATALOG, track, profile, progress).all.filter(
        (item) =>
          item.build.exercises.includes(id) ||
          item.build.requires.some((requirement) => requirement.competency === id),
      ),
    [id, track, profile, progress],
  );
  const currentLevel = profile?.competencies.find((item) => item.competency === id)?.level ?? 'L0';
  const roadmap = useMemo(
    () => (profile ? buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG) : undefined),
    [profile],
  );
  const competency = useMemo(() => buildCompetencyView(CATALOG, track, id, roadmap), [id, track, roadmap]);
  // A próxima estação é o novo "você está aqui": a primeira da estrada que ainda é lacuna.
  const next = useMemo(() => {
    const hereId = buildPathView(CATALOG, track, roadmap).hereId;
    return hereId && hereId !== id ? { id: hereId, name: CATALOG.competencies.get(hereId)?.name ?? hereId } : undefined;
  }, [id, track, roadmap]);

  const definition = CATALOG.competencies.get(id);
  if (!competency || !definition) return null;

  // O que o site sabe e a IA não: o que a pessoa já estudou nesta estação.
  const promptContext: PromptContext = {
    done: [...competency.learn, ...competency.practice, ...competency.prove].filter(
      (resource) => progress?.[resource.id]?.completedAt,
    ),
  };
  const mission = competency.practice.find((resource) => resource.task);

  return (
    <main className="min-h-dvh bg-paper">
      <EcosystemNav current="trilha" />
      <div className="mx-auto max-w-[1040px] px-4 pb-12 sm:px-6">
        <div className="max-w-[640px]">

        <BackBar
          href={`/trilha${suffix}`}
          label="Trilha"
          place={competency.levelTitle}
          title={competency.name}
          titleId="titulo"
          onNavigate={() => aimReturnAt('trilha', competency.id)}
        />
        <h1 id="titulo" className="font-serif text-ink mt-5 text-[28px] leading-tight sm:mt-1">
          {competency.name}
        </h1>
        <p className="text-ink-soft mt-1 text-[12.5px]">
          a vaga pede que você {LEVEL_ASKED[competency.targetLevel]} ·{' '}
          {competency.learn.length + competency.practice.length + competency.prove.length} recursos
        </p>
        <p className="text-ink mt-3 text-[14.5px] leading-relaxed">{competency.summary}</p>

        {competency.advice && (
          <div className="mt-4 border-l-2 border-[var(--rule)] pl-3">
            <AdviceMark kind={competency.advice.kind} />
            <p className="text-ink-soft mt-0.5 text-[13px] leading-snug">{competency.advice.reason}</p>
          </div>
        )}

        {!demoId && (
          <ConcludeStation
            id={competency.id}
            name={competency.name}
            done={levelAtLeast(currentLevel, competency.targetLevel)}
            next={next}
            suffix={suffix}
          />
        )}

        {competency.before.length > 0 && (
          <Neighbors
            title="Antes, vale ter"
            hint="Não se sente pronto? Comece por aqui. É conselho, não cadeado."
            items={competency.before}
            suffix={suffix}
          />
        )}

        {/* Os materiais vêm logo depois do resumo, o "comece aqui" primeiro: era a tela 1,1, depois
            de cinco construções. Cada grupo mostra os primeiros e guarda o resto num toque. */}
        <ResourceGroup
          title="Aprender"
          resources={competency.learn}
          startId={competency.startId}
          technologyId={competency.technologyId}
          visible={4}
        />
        <ResourceGroup
          title="Praticar"
          resources={competency.practice}
          technologyId={competency.technologyId}
          hint="Só assistir não forma ninguém: escolha pelo menos uma."
          visible={3}
          after={
            <CopyPrompt
              prompt={exercisePrompt(definition, currentLevel, competency.targetLevel, mission, promptContext)}
              label="Resolver um exercício com ajuda de IA"
              hint={
                mission
                  ? 'Já vem com a missão desta estação. Cole o seu código no lugar indicado; o assistente dá pistas antes da solução.'
                  : 'Cole o enunciado e o seu código no lugar indicado; o assistente dá pistas antes da solução.'
              }
            />
          }
        />
        <ResourceGroup
          title="Provar"
          resources={competency.prove}
          technologyId={competency.technologyId}
          hint="Dá para mostrar a alguém: vai para o portfólio ou passa por conferência."
          visible={3}
        />

        {builds.length > 0 && <BuildsFor items={builds} competency={id} hasProfile={Boolean(profile)} suffix={suffix} />}

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
          <ExitCriteria
            competencyId={competency.id}
            level={competency.targetLevel}
            criteria={competency.exitCriteria}
            competencyName={competency.name}
            done={levelAtLeast(currentLevel, competency.targetLevel)}
            onConclude={demoId ? undefined : () => concludeStation(competency.id, competency.name)}
          />
        </div>

        <div className="mt-8">
          <CopyPrompt
            prompt={studyPrompt(definition, currentLevel, competency.targetLevel, promptContext)}
            label="Estudar isto com um assistente de IA"
            hint="Leva o que você já sabe, aonde quer chegar e os critérios desta estação. O assistente ensina no seu nível, com exemplos do dia a dia."
          />
        </div>

        {competency.opens.length > 0 && (
          <Neighbors title="Abre caminho para" items={competency.opens} suffix={suffix} />
        )}
        </div>
      </div>
    </main>
  );
}

/**
 * Concluir aqui, sem passar por todos os materiais: a pessoa que já faz o que a vaga pede diz isso
 * com um toque, e a trilha passa para a próxima estação (ADR-0017). Concluída, a estação aponta a
 * próxima, como um app de curso aponta a próxima aula.
 */
function ConcludeStation({
  id,
  name,
  done,
  next,
  suffix,
}: {
  id: string;
  name: string;
  done: boolean;
  next?: { readonly id: string; readonly name: string };
  suffix: string;
}) {
  if (!done) {
    return (
      <div className="mt-5">
        <button
          type="button"
          onClick={() => concludeStation(id, name)}
          className="border-ink text-ink hover:bg-paper-edge focus-visible:outline-attention inline-flex min-h-12 items-center gap-2 rounded-sm border px-4 text-[14.5px] focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <CheckCircle filled={false} />
          Concluí esta estação
        </button>
        <p className="text-ink-soft mt-1.5 text-[12.5px] leading-snug">
          Não precisa ver todos os materiais: se você já faz o que a vaga pede, conclua. Dá para desfazer.
        </p>
      </div>
    );
  }
  return (
    <div className="mt-5 border-l-2 border-[var(--state-done)] pl-3">
      <p className="text-done flex items-center gap-2 text-[14.5px] font-medium">
        <CheckCircle filled />
        Estação concluída
      </p>
      {next ? (
        <Link
          href={`/competencias/${next.id}${suffix}`}
          className="focus-visible:outline-attention mt-3 flex min-h-12 items-center justify-center rounded-sm bg-[var(--ink)] px-4 text-center text-[14.5px] font-medium text-[var(--paper)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-flex"
        >
          Próxima estação: {next.name}
        </Link>
      ) : (
        <Link
          href={`/trilha${suffix}`}
          className="text-now focus-visible:outline-attention mt-2 inline-flex min-h-11 items-center text-[14px] underline underline-offset-2 focus-visible:outline-2"
        >
          Voltar à trilha
        </Link>
      )}
      <p>
        <button
          type="button"
          onClick={() => reopenStation(id, name)}
          className="text-ink-soft hover:text-ink focus-visible:outline-attention inline-flex min-h-11 items-center text-[12.5px] underline underline-offset-2 focus-visible:outline-2"
        >
          Reabrir esta estação
        </button>
      </p>
    </div>
  );
}

/** O que a competência permite construir: a resposta a "para que eu estudo isto". */
function BuildsFor({
  items,
  competency,
  hasProfile,
  suffix,
}: {
  items: readonly BuildView[];
  competency: string;
  hasProfile: boolean;
  suffix: string;
}) {
  return (
    <section>
      <SectionLabel>O que você constrói com isto</SectionLabel>
      <ul className="mt-3 space-y-3">
        {items.map((item) => {
          const onlyMissing = item.status === 'one-away' && item.missing[0].competency === competency;
          return (
            <li key={item.build.id} className="flex items-start gap-3">
              <BuildGlyph kind={item.build.kind} size={36} className="text-ink shrink-0" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <Link
                    href={`/construir/${item.build.id}${suffix}`}
                    className="text-ink focus-visible:outline-attention text-[14.5px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                  >
                    {item.build.title}
                  </Link>
                  {hasProfile &&
                    (onlyMissing ? (
                      <span className="hand text-now text-[13.5px]">← esta é a única que falta</span>
                    ) : (
                      <BuildMark status={item.status} missing={item.missingNames[0]?.name} />
                    ))}
                </p>
                <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{item.build.result}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ResourceGroup({
  title,
  resources,
  startId,
  technologyId,
  hint,
  visible,
  after,
}: {
  title: string;
  resources: readonly Resource[];
  startId?: string;
  technologyId?: string;
  hint?: string;
  /** Quantos aparecem antes do "mostrar mais". */
  visible: number;
  /** O que vem depois da lista, como o pedido de ajuda com um exercício. */
  after?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  if (resources.length === 0) return null;
  // Uma sobra de um só não vale um botão: mostra logo.
  const shown = expanded || resources.length <= visible + 1 ? resources : resources.slice(0, visible);
  const hidden = resources.length - shown.length;
  return (
    <section>
      <SectionLabel>
        {title} · {resources.length}
      </SectionLabel>
      {hint && <p className="text-ink-soft mt-1 text-[12.5px]">{hint}</p>}
      <ul className="mt-3 space-y-5">
        {shown.map((resource) => (
          <li key={resource.id}>
            <ResourceLine
              resource={resource}
              startHere={resource.id === startId}
              yourStack={Boolean(technologyId) && resource.technology === technologyId}
              detailed
            />
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="border-rule text-ink hover:border-ink-faint focus-visible:outline-attention mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-sm border text-[14px] focus-visible:outline-2 sm:w-auto sm:px-5"
        >
          Mostrar mais {hidden} {hidden === 1 ? 'material' : 'materiais'}
        </button>
      )}
      {after && <div className="mt-6">{after}</div>}
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
