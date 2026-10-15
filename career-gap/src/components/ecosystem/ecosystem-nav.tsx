'use client';

import Link from 'next/link';
import { useProfileSuffix } from '@/lib/current-profile';

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

  return (
    <nav aria-label="Espaços" className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
      <ul className="flex gap-x-4 whitespace-nowrap py-1 text-[13.5px]">
        {SPACES.map((space) => {
          const active = space.id === current;
          return (
            <li key={space.id}>
              <Link
                href={space.href + suffix}
                aria-current={active ? 'page' : undefined}
                className={`focus-visible:outline-attention -my-1 inline-block py-1 focus-visible:outline-2 ${
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
  );
}
