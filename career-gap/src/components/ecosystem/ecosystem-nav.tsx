'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { DEMO_LABEL } from '@/lib/demo-profiles';
import { forgetReturns } from '@/lib/scroll-memory';

/**
 * Três lugares, como no Laracasts: a trilha, o catálogo aberto e o que é seu. Todos leem o
 * mesmo estado de competências, então a navegação carrega o perfil de demonstração junto —
 * sem isso, trocar de lugar trocaria de pessoa.
 *
 * No computador, a barra fica presa ao topo, na mesma moldura (1040px) em todas as telas. No
 * celular, ela desce para o rodapé, como as abas de um app: fica ao alcance do polegar e sempre à
 * vista, então a pessoa nunca perde em que lugar está (HIG Tab bars; Material Navigation bar).
 */
const SPACES = [
  { id: 'trilha', href: '/trilha', label: 'Trilha' },
  { id: 'explorar', href: '/explorar', label: 'Explorar' },
  { id: 'minha-area', href: '/minha-area', label: 'Minha área' },
] as const;

export type SpaceId = (typeof SPACES)[number]['id'];

export function EcosystemNav({ current }: { current?: SpaceId }) {
  const suffix = useProfileSuffix();
  const pathname = usePathname();
  const { demoId } = useCurrentProfile();

  return (
    <>
      {demoId && (
        // O perfil de exemplo viaja em todos os links; sem este aviso, a pessoa acharia que as
        // marcas e a lista são dela. Link comum: sair do exemplo precisa recarregar a página.
        <p className="border-rule bg-tint-now text-ink border-b text-[13px]">
          <span className="mx-auto flex max-w-[1040px] flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2 sm:px-6">
            <span>
              Perfil de exemplo: <strong className="font-medium">{DEMO_LABEL[demoId] ?? demoId}</strong>.
              As marcas são dele, não suas.
            </span>
            <a href={pathname} className="text-now -my-2 inline-block py-2 underline underline-offset-2">
              Voltar ao meu perfil
            </a>
          </span>
        </p>
      )}
      <nav
        aria-label="Espaços"
        className="tab-bar border-rule bg-paper fixed inset-x-0 bottom-0 z-30 border-t pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] sm:sticky sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-b sm:p-0"
      >
        <ul className="mx-auto grid max-w-[1040px] grid-cols-3 sm:flex sm:px-4">
          {SPACES.map((space) => {
            const active = space.id === current;
            return (
              <li key={space.id}>
                <Link
                  href={space.href + suffix}
                  onClick={forgetReturns}
                  // "page" só no próprio espaço; numa página de dentro dele (uma competência, o
                  // ajuste do perfil) o espaço é o lugar atual, não a página.
                  aria-current={active ? (pathname === space.href ? 'page' : 'true') : undefined}
                  className={`focus-visible:outline-attention relative flex min-h-14 flex-col items-center justify-center gap-0.5 focus-visible:outline-2 focus-visible:-outline-offset-4 sm:min-h-12 sm:flex-row sm:px-2 ${
                    active
                      ? 'text-ink max-sm:before:absolute max-sm:before:inset-x-8 max-sm:before:top-0 max-sm:before:h-0.5 max-sm:before:bg-[var(--ink)] sm:after:absolute sm:after:inset-x-2 sm:after:bottom-2 sm:after:h-0.5 sm:after:bg-[var(--ink)]'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <SpaceIcon id={space.id} active={active} />
                  <span className={`text-[0.8125rem] sm:text-[14px] ${active ? 'font-medium sm:font-normal' : ''}`}>
                    {space.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

/** Ícones das abas, no traço de caneta das construções (BuildGlyph). Só no celular: no
 *  computador a palavra basta. A trilha é uma rota com partida e chegada, e a Minha área é o
 *  marcador que guarda um material na lista. */
function SpaceIcon({ id, active }: { id: SpaceId; active: boolean }) {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: active ? 2 : 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" className="sm:hidden" aria-hidden>
      {id === 'trilha' && (
        <>
          <circle cx={6} cy={19} r={2.25} {...stroke} />
          <path d="M8.25 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.75" {...stroke} />
          <circle cx={18} cy={5} r={2.25} {...stroke} fill={active ? 'currentColor' : 'none'} />
        </>
      )}
      {id === 'explorar' && (
        <>
          <circle cx={10.5} cy={10.5} r={6.25} {...stroke} />
          <path d="M15.25 15.25l5.25 5.25" {...stroke} />
        </>
      )}
      {id === 'minha-area' && (
        <path d="M6.5 3.25h11v17.5l-5.5-4.25-5.5 4.25z" {...stroke} fill={active ? 'currentColor' : 'none'} />
      )}
    </svg>
  );
}
