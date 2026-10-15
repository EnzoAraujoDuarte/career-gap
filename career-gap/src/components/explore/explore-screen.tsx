'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { AdviceKind } from '@/lib/advice';
import { useCurrentProfile, useCurrentRoadmapView, useProfileSuffix } from '@/lib/current-profile';
import {
  buildExplore,
  type ContentType,
  type ExploreFilters,
  type ExploreItem,
  type Facet,
} from '@/lib/explore-view';
import { PageShell } from '@/components/ecosystem/page-shell';
import { AdviceMark } from '@/components/ui/advice-mark';
import { ResourceLine } from '@/components/ui/resource-line';
import { HabitsTab } from './habits-tab';
import { ToolsTab } from './tools-tab';

const TABS = [
  { id: 'conteudos', label: 'Conteúdos', count: CATALOG.resources.length },
  { id: 'ferramentas', label: 'Ferramentas', count: CATALOG.tools.length },
  { id: 'habitos', label: 'Hábitos', count: CATALOG.habits.length },
] as const;

type TabId = (typeof TABS)[number]['id'];

/** Nomes curtos na URL: o link de um filtro precisa ser legível para ser compartilhado. */
const TYPE_PARAM: Record<string, ContentType> = {
  aprender: 'learn',
  praticar: 'practice',
  provar: 'prove',
  livros: 'book',
};
const ADVICE_PARAM: Record<string, AdviceKind> = {
  recomendado: 'recommended',
  'falta-base': 'missing-base',
  'nao-agora': 'not-now',
  'ja-sei': 'met',
};
const paramOf = <T extends string>(table: Record<string, T>, value: T) =>
  Object.keys(table).find((key) => table[key] === value) ?? value;

export function ExploreScreen() {
  const params = useSearchParams();
  const tab = (TABS.find((item) => item.id === params.get('aba'))?.id ?? 'conteudos') as TabId;

  return (
    <PageShell
      current="explorar"
      title="Explorar"
      intro="Tudo o que o Career Gap indica, aberto. Estude o que quiser; as marcas só dizem o que vale agora e o que pode esperar."
    >
      <nav aria-label="Seções do catálogo" className="mt-6 flex gap-x-5 border-b border-rule">
        {TABS.map((item) => (
          <TabLink key={item.id} id={item.id} active={item.id === tab}>
            {item.label} <span className="text-ink-faint">{item.count}</span>
          </TabLink>
        ))}
      </nav>
      {tab === 'conteudos' && <ContentsTab />}
      {tab === 'ferramentas' && <ToolsTab />}
      {tab === 'habitos' && <HabitsTab />}
    </PageShell>
  );
}

function TabLink({ id, active, children }: { id: TabId; active: boolean; children: React.ReactNode }) {
  const params = useSearchParams();
  const next = new URLSearchParams();
  const perfil = params.get('perfil');
  if (perfil) next.set('perfil', perfil);
  if (id !== 'conteudos') next.set('aba', id);
  const query = next.toString();
  return (
    <Link
      href={`/explorar${query ? `?${query}` : ''}`}
      aria-current={active ? 'page' : undefined}
      className={`focus-visible:outline-attention -mb-px border-b-2 py-2 text-[14px] focus-visible:outline-2 ${
        active ? 'border-[var(--ink)] text-ink' : 'border-transparent text-ink-soft hover:text-ink'
      }`}
    >
      {children}
    </Link>
  );
}

function useFilters(): [ExploreFilters, (patch: Record<string, string | undefined>) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo<ExploreFilters>(
    () => ({
      type: TYPE_PARAM[params.get('tipo') ?? ''],
      competency: params.get('competencia') ?? undefined,
      creator: params.get('criador') ?? undefined,
      advice: ADVICE_PARAM[params.get('direcao') ?? ''],
      ptBr: params.get('ptbr') === '1',
      free: params.get('gratis') === '1',
    }),
    [params],
  );
  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  };
  return [filters, update];
}

function ContentsTab() {
  const { profile } = useCurrentProfile();
  const view = useCurrentRoadmapView();
  const [filters, update] = useFilters();
  // A busca fica fora da URL enquanto se digita: trocar de rota a cada tecla é caro e
  // atrapalha o cursor. O filtro de verdade vem dos parâmetros.
  const [query, setQuery] = useState('');
  const explore = useMemo(
    () => buildExplore(CATALOG, FIRST_WEB_ROLE, view ?? undefined, { ...filters, query }),
    [view, query, filters],
  );
  const active =
    filters.type || filters.competency || filters.creator || filters.advice || filters.ptBr || filters.free || query;

  return (
    <section className="mt-5">
      <label className="block">
        <span className="sr-only">Buscar por título, criador ou competência</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título, criador ou competência"
          className="w-full rounded-sm border border-[var(--rule)] bg-paper px-3 py-2 text-[14px] text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-[var(--state-attention)]"
        />
      </label>

      {profile && explore.facets.advice.length > 0 && (
        <ChipRow
          label="Direção"
          facets={explore.facets.advice}
          selected={filters.advice}
          onSelect={(value) => update({ direcao: value && paramOf(ADVICE_PARAM, value) })}
        />
      )}
      <ChipRow
        label="Tipo"
        facets={explore.facets.type}
        selected={filters.type}
        onSelect={(value) => update({ tipo: value && paramOf(TYPE_PARAM, value) })}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle on={filters.ptBr} onChange={(on) => update({ ptbr: on ? '1' : undefined })}>
          Só em português <span className="text-ink-soft">{explore.facets.ptBr}</span>
        </Toggle>
        <Toggle on={filters.free} onChange={(on) => update({ gratis: on ? '1' : undefined })}>
          Só grátis <span className="text-ink-soft">{explore.facets.free}</span>
        </Toggle>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Select
          label="Competência"
          all="Todas"
          facets={explore.facets.competency}
          selected={filters.competency}
          onSelect={(value) => update({ competencia: value })}
        />
        <Select
          label="Criador"
          all="Todos"
          facets={explore.facets.creator}
          selected={filters.creator}
          onSelect={(value) => update({ criador: value })}
        />
      </div>

      <div className="mt-5 flex items-baseline justify-between border-b border-rule pb-2">
        <p className="text-ink-soft text-[13px]" aria-live="polite">
          {explore.items.length} de {explore.total} conteúdos
        </p>
        {active && (
          <button
            onClick={() => {
              setQuery('');
              update({ tipo: undefined, competencia: undefined, criador: undefined, direcao: undefined, ptbr: undefined, gratis: undefined });
            }}
            className="text-now focus-visible:outline-attention text-[13px] focus-visible:outline-2"
          >
            limpar filtros
          </button>
        )}
      </div>

      {explore.items.length === 0 ? (
        <p className="text-ink-soft mt-6 text-[14px]">
          Nada com esses filtros. Tire um deles — a contagem ao lado de cada opção mostra quantos aparecem.
        </p>
      ) : (
        <ul className="mt-4 space-y-6">
          {explore.items.map((item) => (
            <Item key={item.resource.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Item({ item }: { item: ExploreItem }) {
  return (
    <li>
      {item.advice && (
        <p className="mb-0.5">
          <AdviceMark kind={item.advice.kind} />
        </p>
      )}
      <ResourceLine resource={item.resource} startHere={item.startHere} detailed />
      <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">
        treina:{' '}
        {item.competencies.map((competency, index) => (
          <span key={competency.id}>
            {index > 0 && ', '}
            <CompetencyLink id={competency.id}>{competency.name}</CompetencyLink>
          </span>
        ))}
      </p>
    </li>
  );
}

function CompetencyLink({ id, children }: { id: string; children: React.ReactNode }) {
  const suffix = useProfileSuffix();
  return (
    <Link
      href={`/competencias/${id}${suffix}`}
      className="underline decoration-[var(--rule)] underline-offset-2 hover:text-ink hover:decoration-[var(--ink)]"
    >
      {children}
    </Link>
  );
}

function ChipRow<T extends string>({
  label,
  facets,
  selected,
  onSelect,
}: {
  label: string;
  facets: readonly Facet<T>[];
  selected?: T;
  onSelect: (value: T | undefined) => void;
}) {
  return (
    <div className="mt-3">
      <p className="text-ink-soft text-[12px]">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {facets.map((facet) => {
          const on = facet.value === selected;
          return (
            <button
              key={facet.value}
              aria-pressed={on}
              disabled={!on && facet.count === 0}
              onClick={() => onSelect(on ? undefined : facet.value)}
              className={`focus-visible:outline-attention rounded-sm border px-2.5 py-1 text-[13px] focus-visible:outline-2 disabled:opacity-40 ${
                on ? 'border-now bg-tint-now text-ink' : 'border-rule text-ink hover:border-ink-faint'
              }`}
            >
              {facet.label} <span className="text-ink-soft">{facet.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
  children,
}: {
  on?: boolean;
  onChange: (on: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-pressed={!!on}
      onClick={() => onChange(!on)}
      className={`focus-visible:outline-attention rounded-sm border px-2.5 py-1 text-[13px] focus-visible:outline-2 ${
        on ? 'border-now bg-tint-now text-ink' : 'border-rule text-ink hover:border-ink-faint'
      }`}
    >
      {on ? '✓ ' : ''}
      {children}
    </button>
  );
}

function Select({
  label,
  all,
  facets,
  selected,
  onSelect,
}: {
  label: string;
  all: string;
  facets: readonly Facet<string>[];
  selected?: string;
  onSelect: (value: string | undefined) => void;
}) {
  return (
    <label className="block">
      <span className="text-ink-soft text-[12px]">{label}</span>
      <select
        value={selected ?? ''}
        onChange={(event) => onSelect(event.target.value || undefined)}
        className="mt-1 w-full rounded-sm border border-[var(--rule)] bg-paper px-2 py-1.5 text-[13.5px] text-ink focus-visible:outline-2 focus-visible:outline-[var(--state-attention)]"
      >
        <option value="">{all}</option>
        {facets.map((facet) => (
          <option key={facet.value} value={facet.value} disabled={facet.count === 0 && facet.value !== selected}>
            {facet.label} ({facet.count})
          </option>
        ))}
      </select>
    </label>
  );
}
