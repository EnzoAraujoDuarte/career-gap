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
 * A barra ocupa a largura da página e tem a mesma moldura (1040px) em todas as telas: antes ela
 * vivia dentro da coluna de cada página, e a trilha (1040px) e as outras (640px) a punham em
 * lugares diferentes. Fica presa ao topo porque, no celular, a trilha passa de dez telas.
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
      <header className="border-rule bg-paper sticky top-0 z-30 border-b">
        <nav aria-label="Espaços" className="mx-auto max-w-[1040px] px-2 sm:px-4">
          <ul className="flex text-[14px]">
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
                    className={`focus-visible:outline-attention relative inline-flex min-h-12 items-center px-2 focus-visible:outline-2 focus-visible:-outline-offset-4 ${
                      active
                        ? 'text-ink after:absolute after:inset-x-2 after:bottom-2 after:h-0.5 after:bg-[var(--ink)]'
                        : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {space.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
    </>
  );
}
