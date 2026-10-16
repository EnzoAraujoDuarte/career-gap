'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { DEMO_LABEL } from '@/lib/demo-profiles';

/**
 * Três lugares, como no Laracasts: a trilha, o catálogo aberto e o que é seu. Todos leem o
 * mesmo estado de competências, então a navegação carrega o perfil de demonstração junto —
 * sem isso, trocar de lugar trocaria de pessoa.
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
        <p className="border-rule bg-tint-now text-ink -mx-4 mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b px-4 py-2 text-[13px] sm:-mx-6 sm:px-6">
          <span>
            Perfil de exemplo: <strong className="font-medium">{DEMO_LABEL[demoId] ?? demoId}</strong>.
            As marcas são dele, não suas.
          </span>
          <a href={pathname} className="text-now underline underline-offset-2">
            Voltar ao meu perfil
          </a>
        </p>
      )}
      <nav aria-label="Espaços" className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <ul className="flex gap-x-4 whitespace-nowrap py-1 text-[13.5px]">
          {SPACES.map((space) => {
            const active = space.id === current;
            return (
              <li key={space.id}>
                <Link
                  href={space.href + suffix}
                  // "page" só no próprio espaço; numa página de dentro dele (uma competência, o
                  // ajuste do perfil) o espaço é o lugar atual, não a página.
                  aria-current={active ? (pathname === space.href ? 'page' : 'true') : undefined}
                  className={`focus-visible:outline-attention -my-2 inline-block py-2 focus-visible:outline-2 ${
                    active
                      ? 'text-ink underline decoration-2 underline-offset-[6px]'
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
    </>
  );
}
