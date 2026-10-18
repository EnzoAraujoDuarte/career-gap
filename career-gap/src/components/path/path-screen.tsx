'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { Resource } from '@/domain/model';
import { generateRoadmap } from '@/domain/roadmap';
import { buildBuildsView, type BuildView, type BuildsView } from '@/lib/builds-view';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { useCriteria } from '@/lib/criteria-storage';
import { markStarted, useProgress } from '@/lib/progress-storage';
import { buildPathView, type PathLevelView, type PathStop, type PathView } from '@/lib/path-view';
import { criteriaKey } from '@/lib/user-state';
import { formatDuration } from '@/lib/resource-duration';
import { pendingReturnAnchor, rememberOnDetailLink, useRestoreScroll } from '@/lib/scroll-memory';
import { buildRoadmapView } from '@/lib/roadmap-view';
import type { AdviceKind } from '@/lib/advice';
import { EcosystemNav } from '@/components/ecosystem/ecosystem-nav';
import { Loading } from '@/components/ecosystem/page-shell';
import { DemoSwitcher } from '@/components/flow/demo-switcher';
import { AdviceMark } from '@/components/ui/advice-mark';
import { BuildGlyph } from '@/components/ui/build-glyph';
import { ResourceLine } from '@/components/ui/resource-line';
import { BuildMark } from './build-mark';
import { BuildsNow } from './builds-now';
import { OpeningNote } from './opening-letter';
import { ProKit } from './pro-kit';
import { StackChoice } from './stack-choice';
import { FlagIcon, RoadSvg, SWAY, StationDot, rowStyle, useRoad } from './road';

/** Ritmo de referência para traduzir horas em semanas. É o conselho do Curso em Vídeo, e é
 *  só informação: ninguém é cobrado por ele. */
const MINUTES_PER_WEEK = 90 * 5;

/**
 * A trilha como estrada (ADR-0011): o que você já consegue construir vem primeiro; depois os
 * níveis, cada um fechando numa construção, com conteúdo concreto em cada estação e o trecho já
 * percorrido em tinta. A ordem é sugestão e tudo abre (ADR-0009); o que é pessoal são as marcas,
 * o "você está aqui" e o que cada competência destrava.
 */
export function PathScreen() {
  const { profile, demoId } = useCurrentProfile();
  const suffix = useProfileSuffix();
  const progress = useProgress();
  const track = (profile && CATALOG.tracks.get(profile.trackId)) || FIRST_WEB_ROLE;
  const builds = useMemo(() => buildBuildsView(CATALOG, track, profile, progress), [track, profile, progress]);
  const path = useMemo(
    () =>
      buildPathView(
        CATALOG,
        track,
        profile ? buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG) : undefined,
      ),
    [profile, track],
  );
  const stops = path.levels.flatMap((level) => level.stops);
  const hereIndex = stops.findIndex((stop) => stop.id === path.hereId);
  // Quantas estações ficaram para trás; -1 sem perfil, e tudo quando não resta lacuna.
  const reach = !profile ? -1 : hereIndex < 0 ? stops.length : hereIndex;
  const starts = path.levels.map((_, index) =>
    path.levels.slice(0, index).reduce((sum, level) => sum + level.stops.length, 0),
  );
  const levels = useOpenLevels(path, builds);
  const trailRef = useRef<HTMLOListElement>(null);
  const road = useRoad(trailRef, `${demoId}|${reach}|${profile === undefined}`);
  useRestoreScroll('trilha', profile !== undefined && progress !== undefined);

  return (
    // Ao abrir uma competência, uma construção, o kit ou a carta, a posição fica guardada para a volta.
    <main
      className="min-h-dvh bg-paper"
      onClickCapture={rememberOnDetailLink('trilha', ['/competencias/', '/construir/', '/kit', '/carta'])}
    >
      <EcosystemNav current="trilha" />
      <div className="mx-auto max-w-[1040px] px-4 pb-12 sm:px-6">

        <header className="mt-6 max-w-[62ch] sm:mt-8">
          <h1 className="font-serif text-ink text-[30px] leading-[1.15] text-balance sm:text-[34px]">
            Você não precisa saber tudo para começar a criar.
          </h1>
          <p className="text-ink-soft mt-3 text-[14.5px] leading-relaxed">
            {track.requirements.length} competências em {track.path.length} níveis, e cada nível fecha
            numa coisa que você constrói e mostra. Nada é trancado, e o caminho vale para qualquer
            linguagem.
          </p>
        </header>

        {profile === undefined || progress === undefined ? (
          <Loading />
        ) : (
          // O próximo passo vem antes de tudo no celular, e fica preso ao lado da estrada no
          // computador: era a tela 3,4 de 21, e "onde estou, o que vem agora" é a pergunta do
          // produto. A estrada vem antes do kit, que o próprio motor marca "falta base" para quem
          // está começando.
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
            <Aside
              path={path}
              suffix={suffix}
              hasProfile={profile !== null}
              onOpenLevel={levels.open}
            />

            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <OpeningNote suffix={suffix} />
              <BuildsNow view={builds} hasProfile={profile !== null} suffix={suffix} />

              <section aria-labelledby="estrada" className="mt-12">
                <h2 id="estrada" className="font-serif text-ink text-[22px] leading-tight">
                  A estrada, nível a nível
                </h2>
                <p className="text-ink-soft mt-1 max-w-[62ch] text-[13.5px] leading-relaxed">
                  De cima para baixo, na ordem sugerida. Cada nível abre nas suas estações, cada
                  estação mostra por onde começar, e a bandeira é o que você constrói ao fim do nível.
                </p>
                {/* No celular a lista de níveis do lado não aparece: uma fileira que corre para o
                    lado leva a qualquer nível e já o abre. */}
                <nav aria-label="Ir para o nível" className="mt-3 lg:hidden">
                  <ol className="shelf -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
                    {path.levels.map((level) => (
                      <li key={level.level.id} className="shrink-0">
                        <a
                          href={`#nivel-${level.level.id}`}
                          onClick={() => levels.open(level.level.id)}
                          aria-current={level.level.id === path.hereLevelId ? 'step' : undefined}
                          className={`focus-visible:outline-attention inline-flex min-h-11 items-center gap-1.5 rounded-sm border px-3 text-[13px] whitespace-nowrap focus-visible:outline-2 ${
                            level.level.id === path.hereLevelId
                              ? 'border-now text-now'
                              : 'border-rule text-ink-soft hover:text-ink'
                          }`}
                        >
                          <span className="font-serif tabular-nums">{level.number}</span>
                          {level.level.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <HowToRead />

                <div className="relative mt-6">
                  <RoadSvg road={road} />
                  <ol
                    ref={trailRef}
                    aria-label="Trilha"
                    className="relative [--amp:14px] [--axis:22px] sm:[--amp:40px] sm:[--axis:56px]"
                  >
                    {path.levels.map((level, index) => (
                      <Level
                        key={level.level.id}
                        level={level}
                        start={starts[index]}
                        reach={reach}
                        hereId={path.hereId}
                        personal={profile !== null}
                        builds={builds}
                        technologyId={path.technologyId}
                        suffix={suffix}
                        open={levels.isOpen(level.level.id)}
                        onToggle={(open) => levels.set(level.level.id, open)}
                      />
                    ))}
                    <Destination
                      levels={path.levels.length}
                      competencies={track.requirements.length}
                      walked={reach === stops.length}
                    />
                  </ol>
                </div>
              </section>

              <Detours outside={path.outside} />
              <ProKit profile={profile} suffix={suffix} />
              <div className="mt-10 lg:hidden">
                <ResearchInvite suffix={suffix} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Andaime de quem apresenta o sistema: só aparece com um perfil de demonstração na URL. */}
      {demoId && (
        <div className="mt-6">
          <DemoSwitcher currentId={demoId} />
        </div>
      )}
    </main>
  );
}

const OPEN_KEY = 'career-gap:niveis-abertos';

/**
 * Quais níveis da estrada estão abertos. Só abre sozinho o nível onde a pessoa está (o primeiro,
 * sem respostas): com os quatro abertos, a trilha tinha 21 telas no celular. O que a pessoa abre
 * ou fecha vale até ela fechar a aba, para que a volta de uma estação a encontre do mesmo jeito;
 * e a volta mirada numa estação (o "← Trilha" de quem chegou por outro caminho) abre o nível dela.
 */
function useOpenLevels(path: PathView, builds: BuildsView) {
  const [toggled, setToggled] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(OPEN_KEY) ?? '{}') as Record<string, boolean>;
    } catch {
      return {};
    }
  });
  const [anchor] = useState(() =>
    typeof window === 'undefined'
      ? undefined
      : (pendingReturnAnchor('trilha') ?? decodeURIComponent(window.location.hash.slice(1))),
  );
  const anchorLevel = anchor
    ? path.levels.find(
        (level) =>
          `nivel-${level.level.id}` === anchor ||
          level.stops.some((stop) => stop.id === anchor) ||
          (builds.byLevel.get(level.level.id) ?? []).some((item) => `construcao-${item.build.id}` === anchor),
      )?.level.id
    : undefined;
  const firstOpen = path.hereLevelId ?? path.levels[0]?.level.id;

  const set = (id: string, open: boolean) => {
    const next = { ...toggled, [id]: open };
    setToggled(next);
    try {
      sessionStorage.setItem(OPEN_KEY, JSON.stringify(next));
    } catch {
      // Armazenamento bloqueado: o nível abre agora e volta ao padrão na próxima visita.
    }
  };
  return {
    isOpen: (id: string) => toggled[id] ?? (id === firstOpen || id === anchorLevel),
    set,
    open: (id: string) => set(id, true),
  };
}

/** `start` é a posição da primeira estação do nível na estrada inteira; `reach`, quantas
 *  estações já ficaram para trás. Fechado, o nível é uma linha na estrada: nome, tamanho e o
 *  botão que abre as estações. */
function Level({
  level,
  start,
  reach,
  hereId,
  personal,
  builds,
  technologyId,
  suffix,
  open,
  onToggle,
}: {
  level: PathLevelView;
  start: number;
  reach: number;
  hereId?: string;
  personal: boolean;
  builds: BuildsView;
  technologyId?: string;
  suffix: string;
  open: boolean;
  onToggle: (open: boolean) => void;
}) {
  const weeks = Math.max(1, Math.round(level.minutes / MINUTES_PER_WEEK));
  const met = level.stops.filter((stop) => stop.advice?.kind === 'met').length;
  const here = level.stops.some((stop) => stop.id === hereId);
  const levelBuilds = builds.byLevel.get(level.level.id) ?? [];
  return (
    <li className="pb-6">
      <div
        id={`nivel-${level.level.id}`}
        className="relative flex scroll-mt-16 items-start gap-4"
        style={rowStyle(0, 40)}
      >
        <span
          data-road-point
          data-walked={start <= reach}
          className={`font-serif flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-paper text-[19px] leading-none ${
            here ? 'border-[var(--state-now)] text-now' : 'border-[var(--ink)] text-ink'
          }`}
          aria-hidden
        >
          {level.number}
        </span>
        <div className="bg-paper min-w-0 max-w-[62ch] pr-2">
          <h2 className="font-serif text-ink text-[22px] leading-tight text-balance">
            <span className="sr-only">Nível {level.number}: </span>
            {level.level.title}
          </h2>
          <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">
            {level.stops.length} competências · {formatDuration(level.minutes)} no caminho mínimo ·{' '}
            {weeks === 1 ? 'cerca de 1 semana' : `umas ${weeks} semanas`} a 1h30 por dia
            {personal && (
              <>
                {' · '}
                <span className="text-done">{met} já no seu nível</span>
              </>
            )}
          </p>
          <p className="text-ink mt-2 text-[14px] leading-relaxed">{level.level.summary}</p>
          {open && (
            <ul className="mt-3 space-y-1">
              {level.level.outcomes.map((outcome) => (
                <li key={outcome} className="text-ink-soft flex gap-2 text-[13px] leading-snug">
                  <span className="text-done shrink-0" aria-hidden>✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          )}
          {open && level.level.id === 'build-and-ship' && <StackChoice track={FIRST_WEB_ROLE} />}
          <button
            type="button"
            aria-expanded={open}
            onClick={() => onToggle(!open)}
            className="text-now focus-visible:outline-attention -ml-1 mt-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-[13.5px] focus-visible:outline-2"
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              aria-hidden
            >
              <path
                d="M3.5 6l4.5 4.5L12.5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {open ? 'Recolher o nível' : `Ver as ${level.stops.length} estações`}
          </button>
        </div>
      </div>

      {open && (
        <>
          <ol className="mt-4 space-y-7">
            {level.stops.map((stop, index) => (
              <Station
                key={stop.id}
                stop={stop}
                sway={SWAY[(index + 1) % SWAY.length]}
                walked={start + index < reach}
                here={stop.id === hereId}
                unlocks={builds.unlockedBy.get(stop.id) ?? []}
                technologyId={technologyId}
                suffix={suffix}
              />
            ))}
          </ol>

          <div className="relative mt-7 flex items-start gap-4" style={rowStyle(0, 28)}>
            <span
              data-road-point
              data-walked={start + level.stops.length <= reach}
              className="border-ink bg-paper flex h-7 w-7 shrink-0 items-center justify-center rounded-[3px] border-2"
              aria-hidden
            >
              <FlagIcon />
            </span>
            <div className="bg-paper min-w-0 max-w-[62ch] pr-2">
              <h3 className="text-ink text-[13.5px] font-medium">Ao fim do nível {level.number}, você constrói</h3>
              <ul className="mt-2 space-y-3">
                {levelBuilds.map((item) => (
                  <LevelBuild key={item.build.id} item={item} personal={personal} suffix={suffix} />
                ))}
              </ul>
            </div>
          </div>

          {level.books.length > 0 && <Books books={level.books} />}
        </>
      )}
    </li>
  );
}

function LevelBuild({ item, personal, suffix }: { item: BuildView; personal: boolean; suffix: string }) {
  return (
    <li id={`construcao-${item.build.id}`} className="flex scroll-mt-20 items-start gap-3">
      <BuildGlyph kind={item.build.kind} size={36} className="text-ink shrink-0" />
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <Link
            href={`/construir/${item.build.id}${suffix}`}
            className="tap text-ink focus-visible:outline-attention text-[14.5px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
          >
            {item.build.title}
          </Link>
          {personal && <BuildMark status={item.status} missing={item.missingNames[0]?.name} />}
        </p>
        <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{item.build.result}</p>
      </div>
    </li>
  );
}

function Station({
  stop,
  sway,
  walked,
  here,
  unlocks,
  technologyId,
  suffix,
}: {
  stop: PathStop;
  sway: number;
  walked: boolean;
  here: boolean;
  unlocks: readonly BuildView[];
  technologyId?: string;
  suffix: string;
}) {
  const kind = stop.advice?.kind;
  const dim = kind === 'met' || kind === 'not-now';
  const checked = useCriteria()?.[criteriaKey(stop.id, stop.targetLevel)]?.checked.length ?? 0;
  return (
    <li id={stop.id} className="relative flex scroll-mt-20 items-start gap-3" style={rowStyle(sway, 18)}>
      <span data-road-point data-walked={walked} className="mt-[5px] shrink-0">
        <StationDot kind={kind} />
      </span>
      <div className="bg-paper min-w-0 max-w-[62ch] pr-2">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <Link
            href={`/competencias/${stop.id}${suffix}`}
            aria-current={here ? 'step' : undefined}
            className={`tap focus-visible:outline-attention font-serif text-[18px] leading-snug underline decoration-transparent underline-offset-4 hover:decoration-[var(--ink)] focus-visible:outline-2 ${
              dim ? 'text-ink-soft' : 'text-ink'
            }`}
          >
            {stop.name}
          </Link>
          {kind && <AdviceMark kind={kind} />}
          {here && (
            <span className="hand text-now whitespace-nowrap text-[13.5px]">← você está aqui</span>
          )}
        </div>
        {stop.advice && !stop.advice.redundant && (
          <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{stop.advice.reason}</p>
        )}
        {unlocks.length > 0 && (
          <p className="hand text-now mt-1 text-[13.5px] leading-snug">
            ← destrava{' '}
            <Link
              href={`/construir/${unlocks[0].build.id}${suffix}`}
              className="focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current focus-visible:outline-2"
            >
              {unlocks[0].build.title.toLowerCase()}
            </Link>
            {unlocks.length > 1 && ` e mais ${unlocks.length - 1}`}
          </p>
        )}
        {checked > 0 && (
          <p className="text-done mt-0.5 text-[12.5px]">
            ✓ {checked} de {stop.criteriaCount} critérios de saída
          </p>
        )}

        {/* Na estrada, o material que abre a estação numa ficha e a prática garantida numa linha
            (ADR-0015). Quem já sabe não precisa deles; o resto, inclusive o "não agora", vê
            conteúdo concreto — esconder recurso seria cadeado disfarçado (ADR-0009). Guardar e
            concluir ficam na página da estação. */}
        {kind !== 'met' && stop.start && (
          <div className="mt-2">
            <ResourceLine
              resource={stop.start}
              compact
              yourStack={Boolean(technologyId) && stop.start.technology === technologyId}
            />
          </div>
        )}
        {kind !== 'met' && stop.practice && (
          <p className="text-ink-soft mt-1.5 text-[12.5px] leading-snug">
            pratique com:{' '}
            <a
              href={stop.practice.url}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => stop.practice && markStarted(stop.practice.id)}
              className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
            >
              {stop.practice.title}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </p>
        )}
        <Link
          href={`/competencias/${stop.id}${suffix}`}
          className="text-now focus-visible:outline-attention -ml-1 mt-0.5 inline-flex min-h-11 items-center px-1 text-[13px] focus-visible:outline-2"
        >
          ver os {stop.resourceCount} recursos →
        </Link>
      </div>
    </li>
  );
}

/** Livros ficam fora da estrada: ramo opcional para quem quer ir além, como um desvio. Fechado
 *  por padrão: aberto, o do nível 1 ocupava mais de uma tela do celular. */
function Books({ books }: { books: readonly Resource[] }) {
  return (
    <details className="border-rule relative mt-6 ml-[calc(var(--axis)+24px)] max-w-[62ch] rounded-sm border border-dashed bg-paper px-4">
      <summary className="hand text-ink-soft focus-visible:outline-attention flex min-h-11 cursor-pointer items-center text-[15px] focus-visible:outline-2">
        para ir além · {books.length} {books.length === 1 ? 'livro' : 'livros'}
      </summary>
      <ul className="space-y-4 pb-4 pt-1">
        {books.map((book) => (
          <li key={book.id}>
            <ResourceLine resource={book} />
          </li>
        ))}
      </ul>
    </details>
  );
}

function Destination({
  levels,
  competencies,
  walked,
}: {
  levels: number;
  competencies: number;
  walked: boolean;
}) {
  return (
    <li className="relative flex items-start gap-4" style={rowStyle(0, 28)}>
      <span
        data-road-point
        data-walked={walked}
        className="border-ink bg-paper h-7 w-7 shrink-0 rounded-full border-2 border-dashed"
        aria-hidden
      />
      <div className="bg-paper min-w-0 max-w-[62ch] pr-2">
        <h2 className="font-serif text-ink text-[19px] leading-tight">Primeira vaga</h2>
        <p className="text-ink-soft mt-1 text-[13px] leading-snug">
          Os {levels} níveis cobrem as {competencies} competências que a trilha pede.
        </p>
      </div>
    </li>
  );
}

function Detours({
  outside,
}: {
  outside: readonly { readonly id: string; readonly name: string; readonly reason: string }[];
}) {
  if (outside.length === 0) return null;
  return (
    <section className="border-rule mt-12 rounded-sm border border-dashed px-4 py-4">
      <h2 className="hand text-ink-soft text-[16px]">fora da trilha · pode ignorar</h2>
      <p className="text-ink-soft mt-1 max-w-[62ch] text-[12.5px] leading-snug">
        A primeira vaga não pede. Ficam fora da estrada para você saber que existem e por que
        podem esperar.
      </p>
      <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {outside.map((item) => (
          <li key={item.id}>
            <p className="text-ink text-[13.5px] leading-snug">{item.name}</p>
            <p className="text-ink-soft text-[12px] leading-snug">{item.reason}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Aside({
  path,
  suffix,
  hasProfile,
  onOpenLevel,
}: {
  path: PathView;
  suffix: string;
  hasProfile: boolean;
  onOpenLevel: (id: string) => void;
}) {
  return (
    <aside aria-label="Seu próximo passo" className="lg:sticky lg:top-16 lg:col-start-2 lg:row-start-1 lg:self-start">
      <NextStep path={path} suffix={suffix} hasProfile={hasProfile} onOpenLevel={onOpenLevel} />

      <nav aria-label="Níveis da trilha" className="mt-7 hidden lg:block">
        <h2 className="text-ink-soft text-[12.5px] font-medium">Níveis</h2>
        <ol className="mt-2 space-y-2.5">
          {path.levels.map((level) => {
            const met = level.stops.filter((stop) => stop.advice?.kind === 'met').length;
            const here = level.level.id === path.hereLevelId;
            return (
              <li key={level.level.id}>
                <a
                  href={`#nivel-${level.level.id}`}
                  onClick={() => onOpenLevel(level.level.id)}
                  aria-current={here ? 'step' : undefined}
                  className="group focus-visible:outline-attention block rounded-sm py-0.5 focus-visible:outline-2"
                >
                  <span className="flex flex-wrap items-baseline gap-x-2 text-[13.5px]">
                    <span className="font-serif text-ink-faint tabular-nums">{level.number}</span>
                    <span className="text-ink group-hover:underline group-hover:underline-offset-2">
                      {level.level.title}
                    </span>
                    {here && (
                      <span className="hand text-now whitespace-nowrap text-[12.5px]">você está aqui</span>
                    )}
                  </span>
                  {hasProfile && (
                    <span className="mt-1 ml-[18px] flex items-center gap-2">
                      <span className="bg-rule relative h-[3px] flex-1 overflow-hidden rounded-full">
                        <span
                          className="absolute inset-y-0 left-0 rounded-full bg-[var(--state-done)]"
                          style={{ width: `${(met / level.stops.length) * 100}%` }}
                        />
                      </span>
                      <span className="text-ink-soft text-[11.5px] tabular-nums">
                        {met} de {level.stops.length}
                      </span>
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-6 hidden lg:block">
        <ResearchInvite suffix={suffix} />
      </div>
    </aside>
  );
}

const PRIMARY =
  'focus-visible:outline-attention mt-4 flex min-h-12 w-full items-center justify-center rounded-sm bg-[var(--ink)] px-4 text-center text-[14.5px] font-medium text-[var(--paper)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2';

/**
 * A primeira coisa da trilha: o que fazer agora, com um botão de verdade. É o único bloco com
 * fundo na página, na tinta de "agora": a pessoa no ônibus abre o site e vê para onde ir sem
 * rolar. Sem respostas, o próximo passo é responder; com elas, a estação que o motor recomenda.
 */
function NextStep({
  path,
  suffix,
  hasProfile,
  onOpenLevel,
}: {
  path: PathView;
  suffix: string;
  hasProfile: boolean;
  onOpenLevel: (id: string) => void;
}) {
  const box = 'bg-tint-now rounded-sm px-4 py-4';
  if (!hasProfile) {
    const ptBr = CATALOG.resources.filter((resource) => resource.ptBrStatus === 'complete').length;
    return (
      <section aria-labelledby="proximo-passo" className={box}>
        <h2 id="proximo-passo" className="hand text-now text-[16px]">
          por onde começar
        </h2>
        <p className="text-ink mt-1 text-[14.5px] leading-relaxed">
          Responda 6 perguntas e a estrada marca o que você pode pular e o que vale agora.
        </p>
        <Link href="/avaliacao" className={PRIMARY}>
          Responder as 6 perguntas
        </Link>
        <p className="text-ink-soft mt-2.5 text-[12.5px] leading-snug">
          Uns 2 minutos, sem cadastro. {CATALOG.resources.length} materiais conferidos um a um, {ptBr} em
          português.
        </p>
      </section>
    );
  }

  const [first, ...others] = path.recommended;
  const hereLevel = path.hereLevelId;
  return (
    <section aria-labelledby="proximo-passo" className={box}>
      <h2 id="proximo-passo" className="hand text-now text-[16px]">
        para você agora
      </h2>
      {first ? (
        <>
          <p className="font-serif text-ink mt-1 text-[22px] leading-tight text-balance">{first.name}</p>
          <p className="text-ink-soft mt-1 text-[13px] leading-snug">{first.advice?.reason}</p>
          <Link href={`/competencias/${first.id}${suffix}`} className={PRIMARY}>
            Abrir a estação
          </Link>
          {others.length > 0 && (
            <>
              <h3 className="text-ink-soft mt-5 text-[12.5px] font-medium">Também vale agora</h3>
              {/* Só o nome: o motivo de cada uma está na estação e na estrada, e repetido aqui
                  empurrava a estrada para a segunda tela. */}
              <ul className="mt-1">
                {others.map((stop) => (
                  <li key={stop.id}>
                    <Link
                      href={`/competencias/${stop.id}${suffix}`}
                      className="text-ink focus-visible:outline-attention inline-flex min-h-11 items-center text-[14.5px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                    >
                      {stop.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p className="text-ink mt-1 text-[14px] leading-relaxed">
          Pelas suas respostas, você já está no nível que a vaga pede em tudo. Confira pelos critérios
          de saída de cada competência.
        </p>
      )}
      <p className="mt-3 flex flex-wrap gap-x-5">
        {path.hereId && hereLevel && (
          <a
            href={`#${path.hereId}`}
            onClick={() => onOpenLevel(hereLevel)}
            className="text-now focus-visible:outline-attention inline-flex min-h-11 items-center text-[13px] underline underline-offset-2 focus-visible:outline-2"
          >
            Ver onde estou na estrada
          </a>
        )}
        <Link
          href="/avaliacao"
          className="text-ink-soft hover:text-ink focus-visible:outline-attention inline-flex min-h-11 items-center text-[13px] underline underline-offset-2 focus-visible:outline-2"
        >
          Refazer as 6 perguntas
        </Link>
      </p>
    </section>
  );
}

/** A legenda das marcas, junto da estrada que ela explica. */
function HowToRead() {
  return (
    <details className="mt-2">
      <summary className="text-ink-soft focus-visible:outline-attention inline-flex min-h-11 cursor-pointer items-center text-[13px] font-medium focus-visible:outline-2">
        Como ler a trilha
      </summary>
      <ul className="mt-1 space-y-2 pb-2 text-[12.5px] leading-snug">
        <Legend kind="met" text="você já sabe; a estrada em tinta é o que ficou para trás" />
        <Legend kind="recommended" text="recomendado agora, no máximo três, com o motivo" />
        <Legend kind="missing-base" text="falta base: abre, mas rende mais depois de outra" />
        <Legend kind="not-now" text="não agora: pode esperar, e diz por quê" />
        <li className="text-ink-soft flex items-center gap-2.5">
          <span className="border-ink flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border-2">
            <FlagIcon />
          </span>
          o que você constrói ao fim de cada nível
        </li>
      </ul>
    </details>
  );
}

function ResearchInvite({ suffix }: { suffix: string }) {
  return (
    <p className="text-ink-soft text-[12.5px] leading-snug">
      Testando o Career Gap?{' '}
      <Link
        href={`/pesquisa${suffix}`}
        className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
      >
        Conte como foi
      </Link>
      : uns 5 minutos de perguntas, que viram dado no TCC.
    </p>
  );
}

function Legend({ kind, text }: { kind: AdviceKind; text: string }) {
  return (
    <li className="text-ink-soft flex items-center gap-2.5">
      <span className="shrink-0">
        <StationDot kind={kind} />
      </span>
      {text}
    </li>
  );
}
