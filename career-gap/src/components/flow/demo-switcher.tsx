'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEMO_PROFILES } from '@/lib/demo-profiles';

/**
 * Andaime de demonstração: troca entre perfis sintéticos para comparar roadmaps lado a lado.
 *
 * Fica no rodapé e visualmente subordinado — é ferramenta de quem apresenta o sistema, não
 * parte do produto. Sai quando a avaliação com usuários terminar.
 */
export function DemoSwitcher({ currentId }: { currentId?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <footer className="border-rule bg-paper-edge flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-4 py-1.5 sm:px-5">
      <label className="text-ink-faint flex items-center gap-2 text-[12px]">
        <span className="uppercase tracking-wide">Demonstração</span>
        <select
          value={currentId ?? ''}
          onChange={(event) =>
            router.push(event.target.value ? `${pathname}?perfil=${event.target.value}` : pathname)
          }
          className="border-rule bg-paper text-ink-soft focus-visible:outline-attention rounded-sm border px-1.5 py-0.5 text-[12px] focus-visible:outline-2"
        >
          <option value="">meu perfil</option>
          {DEMO_PROFILES.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.id.replace('fixture-', '')}
              {profile.emphasisId ? ` · ${profile.emphasisId}` : ''}
            </option>
          ))}
        </select>
      </label>

      <Link
        href="/catalogo"
        className="text-ink-faint hover:text-ink focus-visible:outline-attention text-[12px] underline underline-offset-2 focus-visible:outline-2"
      >
        catálogo completo (condição A)
      </Link>
      <Link
        href="/avaliacao"
        className="text-ink-faint hover:text-ink focus-visible:outline-attention text-[12px] underline underline-offset-2 focus-visible:outline-2"
      >
        refazer avaliação
      </Link>
    </footer>
  );
}
