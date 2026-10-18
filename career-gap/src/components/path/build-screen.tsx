'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { ToolSetupKind } from '@/domain/model';
import { buildPrompt } from '@/lib/ai-prompt';
import { buildBuildsView } from '@/lib/builds-view';
import { toggleCriterionKey, useCriteria } from '@/lib/criteria-storage';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { toggleCompleted, useProgress } from '@/lib/progress-storage';
import { LEVEL_SHORT } from '@/lib/reason-text';
import { formatDuration } from '@/lib/resource-duration';
import { buildProgressKey, buildStepsKey } from '@/lib/user-state';
import { EcosystemNav } from '@/components/ecosystem/ecosystem-nav';
import { Loading, SectionLabel } from '@/components/ecosystem/page-shell';
import { BackBar } from '@/components/ui/back-bar';
import { BuildGlyph } from '@/components/ui/build-glyph';
import { CopyCommand } from '@/components/ui/copy-command';
import { CopyPrompt } from '@/components/ui/copy-prompt';
import { ResourceLine } from '@/components/ui/resource-line';
import { BuildMark } from './build-mark';
import { aimReturnAt } from '@/lib/scroll-memory';

const RESOURCES = new Map(CATALOG.resources.map((resource) => [resource.id, resource]));
const TOOLS = new Map(CATALOG.tools.map((tool) => [tool.id, tool]));

const SETUP_LABEL: Record<ToolSetupKind, string> = {
  'built-in': 'já vem no computador',
  account: 'conta gratuita',
  install: 'programa para instalar',
  'project-dependency': 'dependência do projeto',
  'repository-file': 'arquivo no repositório',
  'claude-plugin': 'plugin do Claude Code',
};

/**
 * A página de uma construção: o que você vai ter na mão, o que precisa, o passo a passo e o
 * apoio. Abre para todo mundo; o que muda com o perfil é a anotação do que falta (ADR-0009).
 */
export function BuildScreen({ id }: { id: string }) {
  const { profile } = useCurrentProfile();
  const suffix = useProfileSuffix();
  const progress = useProgress();
  const criteria = useCriteria();
  const track = (profile && CATALOG.tracks.get(profile.trackId)) || FIRST_WEB_ROLE;
  const view = useMemo(() => buildBuildsView(CATALOG, track, profile, progress), [track, profile, progress]);
  const item = view.all.find((candidate) => candidate.build.id === id);
  if (!item) return null;

  const { build } = item;
  const built = item.status === 'built';
  const exercises = build.exercises.map((competency) => ({
    id: competency,
    name: CATALOG.competencies.get(competency)?.name ?? competency,
  }));
  const missing = new Set(item.missing.map((requirement) => requirement.competency));
  const stepsKey = buildStepsKey(build.id);
  const doneSteps = new Set(criteria?.[stepsKey]?.checked ?? []);
  const allStepsDone = doneSteps.size === build.steps.length;
  const tools = build.tools.map((id) => TOOLS.get(id)).filter((tool) => tool !== undefined);

  return (
    <main className="min-h-dvh bg-paper">
      <EcosystemNav current="trilha" />
      <div className="mx-auto max-w-[1040px] px-4 pb-12 sm:px-6">
        <div className="max-w-[640px]">

        <BackBar
          href={`/trilha${suffix}`}
          label="Trilha"
          place={item.level.title}
          title={build.title}
          titleId="titulo"
          ready={profile !== undefined && progress !== undefined}
          onNavigate={() => aimReturnAt('trilha', `construcao-${build.id}`)}
        />

        {profile === undefined || progress === undefined ? (
          <Loading />
        ) : (
          <>
            <div className="mt-5 flex items-start gap-5 sm:mt-3">
              <BuildGlyph kind={build.kind} size={72} className="text-ink mt-1 shrink-0" />
              <div className="min-w-0">
                <h1 id="titulo" className="font-serif text-ink text-[28px] leading-tight text-balance">{build.title}</h1>
                <p className="text-ink-soft mt-1 text-[12.5px]">
                  {formatDuration(build.estimatedMinutes)} · nível {item.levelNumber}
                </p>
                {profile && (
                  <p className="mt-1.5">
                    <BuildMark status={item.status} missing={item.missingNames[0]?.name} />
                  </p>
                )}
              </div>
            </div>
            <p className="text-ink mt-5 max-w-[62ch] text-[16px] leading-relaxed">{build.result}</p>

            <section>
              <SectionLabel>O que você precisa</SectionLabel>
              {build.requires.length === 0 ? (
                <p className="text-ink mt-2 text-[14px] leading-relaxed">
                  Nada. É por isso que é a primeira: dá para fazer hoje, sem saber nada ainda.
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {build.requires.map((requirement) => {
                    const name = CATALOG.competencies.get(requirement.competency)?.name ?? requirement.competency;
                    const state = !profile ? undefined : missing.has(requirement.competency) ? 'missing' : 'has';
                    return (
                      <li key={requirement.competency} className="text-[14px] leading-snug">
                        <Link
                          href={`/competencias/${requirement.competency}${suffix}`}
                          className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                        >
                          {name}
                        </Link>
                        <span className="text-ink-soft text-[12.5px]"> · {LEVEL_SHORT[requirement.level]}</span>
                        {state === 'has' && <span className="hand text-done ml-1.5 text-[13px]">✓ você tem</span>}
                        {state === 'missing' && <span className="hand text-attention ml-1.5 text-[13px]">↑ ainda não</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
              {item.status === 'later' && profile && (
                <p className="text-ink-soft mt-2 text-[12.5px] leading-snug">
                  Nada aqui tranca: se quiser tentar agora, tente. A anotação só diz o que vai render mais.
                </p>
              )}
            </section>

            <section>
              <SectionLabel>Você vai precisar de</SectionLabel>
              <ul className="mt-2 space-y-2.5">
                {tools.map((tool) => (
                  <li key={tool.id} className="text-[14px] leading-snug">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                      >
                        {tool.name}
                        <span className="sr-only"> (abre em nova aba)</span>
                      </a>
                      <span className="text-ink-soft text-[12.5px]">{SETUP_LABEL[tool.setup.kind]}</span>
                    </p>
                    <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{tool.setup.note}</p>
                    {tool.setup.command && tool.setup.kind !== 'built-in' && (
                      <div className="mt-1">
                        <CopyCommand command={tool.setup.command} compact />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionLabel>
                Passo a passo
                {doneSteps.size > 0 && ' '}
                {doneSteps.size > 0 && (
                  <span className="text-done ml-2 normal-case tracking-normal">
                    {doneSteps.size} de {build.steps.length}
                  </span>
                )}
              </SectionLabel>
              <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">
                Marque conforme avança; fica guardado para você voltar depois.
              </p>
              {/* "Aperte F12" e "abra o terminal" não existem no celular: o mentor avisa antes. */}
              <p className="hand text-attention mt-1 text-[13.5px] leading-snug sm:hidden">
                isto se faz no computador; no celular, leia e deixe marcado o que já fez
              </p>
              <ol className="mt-2 space-y-1">
                {build.steps.map((step, index) => (
                  <li key={step}>
                    <label className="text-ink -mx-1 flex cursor-pointer items-start gap-3 rounded-sm px-1 py-1.5 text-[14px] leading-relaxed hover:bg-paper-edge">
                      <input
                        type="checkbox"
                        checked={doneSteps.has(index)}
                        onChange={() => toggleCriterionKey(stepsKey, index)}
                        className="accent-done mt-[5px] h-5 w-5 shrink-0 sm:h-4 sm:w-4"
                      />
                      <span className="font-serif text-ink-faint w-4 shrink-0 tabular-nums">{index + 1}</span>
                      <span className={doneSteps.has(index) ? 'text-ink-soft line-through' : undefined}>{step}</span>
                    </label>
                  </li>
                ))}
              </ol>
              <p className="text-ink mt-4 border-l border-[var(--state-done)] pl-3 text-[14px] leading-relaxed">
                <span className="text-done">Está pronto quando:</span> {build.doneWhen}
              </p>
            </section>

            <section className="mt-7 flex flex-wrap items-start gap-x-8 gap-y-4">
              <div>
                <button
                  type="button"
                  onClick={() => toggleCompleted(buildProgressKey(build.id))}
                  aria-pressed={built}
                  className={`focus-visible:outline-attention inline-flex min-h-11 items-center rounded-sm px-4 text-[14px] focus-visible:outline-2 ${
                    built
                      ? 'border-[var(--state-done)] text-done border'
                      : 'bg-[var(--ink)] text-[var(--paper)] hover:opacity-90'
                  }`}
                >
                  {built ? '✓ Construído · desmarcar' : 'Construí isto'}
                </button>
                <p className="text-ink-soft mt-1.5 max-w-[34ch] text-[12.5px] leading-snug">
                  {built
                    ? 'Fica na sua área. Marcar não muda o seu nível: quem muda é você, na avaliação.'
                    : allStepsDone
                      ? 'Todos os passos marcados. Se o critério de pronto está cumprido, é só dizer.'
                      : 'Quando o critério de pronto estiver cumprido. Vai para a sua área.'}
                </p>
              </div>
              <CopyPrompt
                prompt={buildPrompt(build, exercises.map((competency) => competency.name))}
                label="Construir com um assistente de IA"
                hint="Leva o plano e o critério de pronto. O assistente programa junto, um passo por vez, e explica cada decisão."
              />
            </section>

            {build.resources.length > 0 && (
              <section>
                <SectionLabel>Apoio</SectionLabel>
                <ul className="mt-3 space-y-4">
                  {build.resources.map((resourceId) => {
                    const resource = RESOURCES.get(resourceId);
                    return resource ? (
                      <li key={resourceId}>
                        <ResourceLine resource={resource} />
                      </li>
                    ) : null;
                  })}
                </ul>
              </section>
            )}

            <section>
              <SectionLabel>O que isto treina</SectionLabel>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                {exercises.map((competency) => (
                  <li key={competency.id}>
                    <Link
                      href={`/competencias/${competency.id}${suffix}`}
                      className="text-ink focus-visible:outline-attention text-[14px] underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                    >
                      {competency.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
        </div>
      </div>
    </main>
  );
}
