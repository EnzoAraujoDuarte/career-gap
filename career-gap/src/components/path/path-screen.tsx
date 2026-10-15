'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { buildPathView, type PathLevelView, type PathStop } from '@/lib/path-view';
import { formatDuration } from '@/lib/resource-duration';
import { buildRoadmapView } from '@/lib/roadmap-view';
import { EcosystemNav } from '@/components/ecosystem/ecosystem-nav';
import { Loading } from '@/components/ecosystem/page-shell';
import { AdviceMark } from '@/components/ui/advice-mark';
import { ResourceLine } from '@/components/ui/resource-line';

/** Ritmo de referência para traduzir horas em semanas. É o conselho do Curso em Vídeo, e é
 *  só informação: ninguém é cobrado por ele. */
const MINUTES_PER_WEEK = 90 * 5;

/**
 * A trilha, no formato do Laracasts: níveis, conteúdo concreto, ramos opcionais. A ordem é
 * sugestão; tudo abre. O que é pessoal são as marcas.
 */
export function PathScreen() {
  const { profile } = useCurrentProfile();
  const suffix = useProfileSuffix();
  const track = (profile && CATALOG.tracks.get(profile.trackId)) || FIRST_WEB_ROLE;
  const path = useMemo(
    () =>
      buildPathView(
        CATALOG,
        track,
        profile ? buildRoadmapView(generateRoadmap(profile, CATALOG), CATALOG) : undefined,
      ),
    [profile, track],
  );

  return (
    <main className="min-h-dvh bg-paper px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <EcosystemNav current="trilha" />

        <header className="mt-7">
          <p className="font-serif text-[12.5px] tracking-[0.12em] text-ink-soft">TRILHA</p>
          <h1 className="font-serif text-ink mt-1 text-[26px] leading-tight">{track.name}</h1>
          <p className="text-ink-soft mt-2 text-[14px] leading-relaxed">
            A trilha é a mesma para todos e nada nela é trancado: estude o que quiser, na ordem
            que quiser. As marcas são suas — o que você já sabe, o que vale agora e o que pode
            esperar, sempre com o motivo.
          </p>
        </header>

        {profile === undefined ? (
          <Loading />
        ) : profile === null ? (
          <section className="mt-6 border-l-2 border-[var(--state-now)] pl-3">
            <p className="text-ink text-[14px] leading-relaxed">
              Diga o que você já sabe e a trilha marca o que pular e o que vale agora.
            </p>
            <Link
              href="/avaliacao"
              className="text-now focus-visible:outline-attention mt-1.5 inline-block py-1 text-[14px] underline underline-offset-2 focus-visible:outline-2"
            >
              Marcar o que já sei
            </Link>
          </section>
        ) : (
          path.recommended.length > 0 && (
            <section className="mt-6">
              <p className="hand text-now text-[15px]">para você agora</p>
              <ol className="mt-2 space-y-4">
                {path.recommended.map((stop) => (
                  <li key={stop.id}>
                    <Link
                      href={`/competencias/${stop.id}${suffix}`}
                      className="text-ink focus-visible:outline-attention text-[15px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                    >
                      {stop.name}
                    </Link>
                    <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{stop.advice?.reason}</p>
                    {stop.start && (
                      <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">
                        comece por: <span className="text-ink">{stop.start.title}</span> ·{' '}
                        {stop.start.sourceName}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )
        )}

        {path.levels.map((level) => (
          <Level
            key={level.level.id}
            level={level}
            here={level.level.id === path.hereLevelId}
            suffix={suffix}
          />
        ))}

        <section className="mt-12 border-t border-dashed border-rule pt-5">
          <p className="hand text-ink-soft text-[16px]">fora da trilha · pode ignorar</p>
          <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">
            A primeira vaga não pede. Aparecem aqui para você saber que existem e por que podem
            esperar.
          </p>
          <ul className="mt-3 space-y-2.5">
            {path.outside.map((item) => (
              <li key={item.id}>
                <p className="text-ink text-[13.5px] leading-snug">{item.name}</p>
                <p className="text-ink-soft text-[12px] leading-snug">{item.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Level({ level, here, suffix }: { level: PathLevelView; here: boolean; suffix: string }) {
  const weeks = Math.max(1, Math.round(level.minutes / MINUTES_PER_WEEK));
  return (
    <section className="mt-12" aria-labelledby={`nivel-${level.level.id}`}>
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-ink-faint text-[34px] leading-none" aria-hidden>
          {level.number}
        </span>
        <div>
          <p className="font-serif text-[12px] tracking-[0.12em] text-ink-soft">
            NÍVEL {level.number}
            {here && <span className="hand text-now ml-2 text-[14px] tracking-normal">← você está aqui</span>}
          </p>
          <h2 id={`nivel-${level.level.id}`} className="font-serif text-ink text-[22px] leading-tight">
            {level.level.title}
          </h2>
        </div>
      </div>
      <p className="text-ink-soft mt-2 text-[12.5px]">
        {level.stops.length} competências · {formatDuration(level.minutes)} no caminho mínimo ·
        umas {weeks} semanas a 1h30 por dia
      </p>
      <p className="text-ink mt-3 text-[14px] leading-relaxed">{level.level.summary}</p>

      <h3 className="font-serif mt-4 text-[12.5px] tracking-[0.1em] text-ink-soft">Você vai aprender</h3>
      <ul className="mt-1.5 space-y-1">
        {level.level.outcomes.map((outcome) => (
          <li key={outcome} className="text-ink flex gap-2 text-[13.5px] leading-snug">
            <span className="text-done" aria-hidden>✓</span>
            {outcome}
          </li>
        ))}
      </ul>

      <ol className="mt-6">
        {level.stops.map((stop) => (
          <Stop key={stop.id} stop={stop} suffix={suffix} />
        ))}
      </ol>

      {level.books.length > 0 && (
        <div className="mt-2 rounded-sm bg-paper-edge px-3 py-3">
          <h3 className="font-serif text-[12.5px] tracking-[0.1em] text-ink-soft">
            Ramos opcionais · livros
          </h3>
          <ul className="mt-2 space-y-3">
            {level.books.map((book) => (
              <li key={book.id}>
                <ResourceLine resource={book} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Stop({ stop, suffix }: { stop: PathStop; suffix: string }) {
  const dim = stop.advice?.kind === 'met' || stop.advice?.kind === 'not-now';
  return (
    <li className="relative pb-7 pl-7">
      <span className="absolute bottom-0 left-[6px] top-2.5 w-px bg-[var(--rule)]" aria-hidden />
      <span
        className={`absolute left-0 top-[6px] h-[13px] w-[13px] rounded-full border-2 ${
          stop.advice?.kind === 'recommended'
            ? 'border-[var(--state-now)] bg-[var(--state-now)]'
            : stop.advice?.kind === 'met'
              ? 'border-[var(--state-done)] bg-[var(--state-done)]'
              : 'border-[var(--ink-soft)] bg-paper'
        }`}
        aria-hidden
      />
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <Link
          href={`/competencias/${stop.id}${suffix}`}
          className={`focus-visible:outline-attention font-serif text-[18px] leading-snug underline decoration-transparent underline-offset-4 hover:decoration-[var(--ink)] focus-visible:outline-2 ${
            dim ? 'text-ink-soft' : 'text-ink'
          }`}
        >
          {stop.name}
        </Link>
        {stop.advice && <AdviceMark kind={stop.advice.kind} />}
      </div>
      {stop.advice && stop.advice.kind !== 'recommended' && (
        <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{stop.advice.reason}</p>
      )}

      {stop.start && (
        <div className="mt-2.5">
          <ResourceLine resource={stop.start} />
        </div>
      )}
      {stop.practice && (
        <p className="text-ink-soft mt-2.5 text-[12.5px] leading-snug">
          pratique com:{' '}
          <a
            href={stop.practice.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)]"
          >
            {stop.practice.title}
          </a>
        </p>
      )}
      <Link
        href={`/competencias/${stop.id}${suffix}`}
        className="text-now focus-visible:outline-attention mt-2 inline-block py-1 text-[13px] focus-visible:outline-2"
      >
        ver os {stop.resourceCount} recursos →
      </Link>
    </li>
  );
}
