'use client';

import Link from 'next/link';
import type { BuildView, BuildsView } from '@/lib/builds-view';
import { formatDuration } from '@/lib/resource-duration';
import { BuildGlyph } from '@/components/ui/build-glyph';
import { BuildMark } from './build-mark';

/**
 * O que a pessoa já consegue construir, antes de qualquer lista do que estudar.
 *
 * É a resposta ao primeiro acesso: começar a criar não espera saber tudo. Sem perfil, mostra a
 * porta de entrada, que não exige nada; com perfil, o que está pronto e o que fica a um passo.
 * A contagem "ao seu alcance" é progresso real, vindo do motor, não um número de boas-vindas.
 */
export function BuildsNow({ view, hasProfile, suffix }: { view: BuildsView; hasProfile: boolean; suffix: string }) {
  if (!hasProfile) return <FirstAccess doorway={view.doorway} suffix={suffix} />;

  const reachable = [...view.built, ...view.ready];
  return (
    <section aria-labelledby="construir-agora" className="mt-9">
      <h2 id="construir-agora" className="hand text-done text-[17px]">
        você já consegue construir
      </h2>
      <p className="text-ink-soft mt-1 text-[13px] leading-snug">
        <span className="text-ink">{reachable.length}</span> de {view.all.length} construções ao seu alcance
        {view.oneAway.length > 0 && (
          <>
            {' · '}mais {view.oneAway.length} a um passo
          </>
        )}
      </p>
      <ul className={SHELF}>
        {reachable.map((item) => (
          <BuildItem key={item.build.id} item={item} suffix={suffix} />
        ))}
      </ul>

      {view.oneAway.length > 0 && (
        <>
          <h2 className="hand text-attention mt-8 text-[17px]">a um passo</h2>
          <p className="text-ink-soft mt-1 text-[13px] leading-snug">
            Falta uma competência para cada uma. Estude-a e a construção fica pronta para você.
          </p>
          <ul className={SHELF}>
            {view.oneAway.map((item) => (
              <BuildItem key={item.build.id} item={item} suffix={suffix} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** No celular, uma prateleira que corre para o lado, um cartão por construção, com o próximo
 *  cortado na borda para dizer que há mais; a partir de 640px, a grade de sempre. Uma lista de
 *  oito construções empilhadas empurrava a estrada duas telas para baixo. */
const SHELF =
  'shelf -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5 sm:overflow-visible sm:px-0';

function BuildItem({ item, suffix }: { item: BuildView; suffix: string }) {
  const missing = item.missingNames[0];
  return (
    <li className="border-rule flex w-[82%] shrink-0 snap-start items-start gap-3.5 rounded-sm border p-3.5 sm:w-auto sm:border-0 sm:p-0">
      <BuildGlyph kind={item.build.kind} size={44} className="text-ink mt-0.5 shrink-0" />
      <div className="min-w-0">
        <Link
          href={`/construir/${item.build.id}${suffix}`}
          className="tap font-serif text-ink focus-visible:outline-attention text-[17px] leading-snug underline decoration-transparent underline-offset-4 hover:decoration-[var(--ink)] focus-visible:outline-2"
        >
          {item.build.title}
        </Link>
        <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{item.build.result}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2.5 text-[12.5px]">
          <span className="text-ink-soft">{formatDuration(item.build.estimatedMinutes)}</span>
          {item.status === 'one-away' && missing ? (
            <span className="hand text-attention text-[13.5px]">
              ↑ falta só{' '}
              <Link
                href={`/competencias/${missing.id}${suffix}`}
                className="focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-current focus-visible:outline-2"
              >
                {missing.name}
              </Link>
            </span>
          ) : (
            <BuildMark status={item.status} />
          )}
        </p>
      </div>
    </li>
  );
}

function FirstAccess({ doorway, suffix }: { doorway: BuildView; suffix: string }) {
  return (
    <section aria-labelledby="comece-hoje" className="mt-9">
      <h2 id="comece-hoje" className="hand text-now text-[17px]">
        dá para começar hoje, sem saber nada ainda
      </h2>
      <div className="border-rule mt-3 flex items-start gap-4 border-y py-5 sm:gap-5">
        <BuildGlyph kind={doorway.build.kind} size={88} className="text-ink h-14 w-14 shrink-0 sm:h-[88px] sm:w-[88px]" />
        <div className="min-w-0 max-w-[52ch]">
          <h3 className="font-serif text-ink text-[24px] leading-tight text-balance">{doorway.build.title}</h3>
          <p className="text-ink mt-2 text-[14.5px] leading-relaxed">{doorway.build.result}</p>
          <p className="text-ink-soft mt-1.5 text-[13px]">
            {formatDuration(doorway.build.estimatedMinutes)} · não precisa saber nada antes · só um editor
            de texto gratuito e o navegador
          </p>
          <Link
            href={`/construir/${doorway.build.id}${suffix}`}
            // Contorno, não preenchido: o botão cheio da tela é o do próximo passo.
            className="border-ink text-ink hover:bg-paper-edge focus-visible:outline-attention mt-4 inline-flex min-h-11 items-center rounded-sm border px-4 text-[14.5px] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Ver o passo a passo →
          </Link>
        </div>
      </div>
    </section>
  );
}
