'use client';

import Link from 'next/link';
import { CATALOG } from '@/catalog';
import type { HabitTheme } from '@/domain/model';
import { useProfileSuffix } from '@/lib/current-profile';
import { SectionLabel } from '@/components/ecosystem/page-shell';

/** Ordem de leitura: postura primeiro, porque vale antes de qualquer competência. */
const THEMES: readonly { theme: HabitTheme; title: string; intro: string }[] = [
  { theme: 'attitude', title: 'Postura profissional', intro: 'Vale para o percurso inteiro, desde o primeiro dia.' },
  { theme: 'learn', title: 'Aprender', intro: 'Como estudar para o conhecimento ficar — inclusive com IA.' },
  { theme: 'verify', title: 'Verificar antes de acreditar', intro: 'No próprio código, no código gerado e no erro.' },
  { theme: 'craft', title: 'Cuidar do código', intro: 'O que separa código que funciona de código que dá para manter.' },
  { theme: 'deliver', title: 'Entregar', intro: 'Pedaços pequenos, histórico guardado, integração frequente.' },
  { theme: 'collaborate', title: 'Colaborar e comunicar', intro: 'Revisão, retorno e conversa sobre o código.' },
  { theme: 'career', title: 'Ser visto e seguir aprendendo', intro: 'Quem contrata precisa achar você, e o que você sabe hoje envelhece.' },
];

/**
 * Obras que fundamentam os hábitos. Sem link de propósito: o catálogo só aponta para a página do
 * detentor dos direitos (ADR-0005), e cópias em PDF circulando por aí não são isso. O ISBN basta
 * para comprar, pedir na biblioteca da faculdade ou achar a edição certa.
 */
const CANON: readonly { title: string; authors: string; edition: string; isbn: string; note: string }[] = [
  {
    title: 'O programador pragmático: de aprendiz a mestre',
    authors: 'Andrew Hunt e David Thomas',
    edition: 'Bookman, 2010 — tradução da 1ª edição',
    isbn: '978-85-7780-734-5',
    note: 'De onde vêm as dicas citadas nos hábitos. A numeração é a desta edição.',
  },
  {
    title: 'Programação extrema (XP) explicada: acolha as mudanças',
    authors: 'Kent Beck',
    edition: 'Bookman, 2004 — tradução da 1ª edição',
    isbn: '978-85-363-0387-1',
    note: 'As práticas e os valores de XP citados nos hábitos. Esgotada; procure em sebo ou biblioteca.',
  },
  {
    title: 'Apprenticeship Patterns: guidance for the aspiring software craftsman',
    authors: 'Dave Hoover e Adewale Oshineye',
    edition: "O'Reilly, 2009 — em inglês",
    isbn: '978-0-596-51838-7',
    note: 'De onde vêm os hábitos de carreira: aprender em público e com outras pessoas. Os autores liberaram o texto sob Creative Commons em 2010.',
  },
];

/** Como profissionais trabalham — de O Programador Pragmático, de XP e da pesquisa sobre IA. */
export function HabitsTab() {
  const suffix = useProfileSuffix();
  return (
    <section className="mt-5">
      <p className="text-ink-soft text-[13px] leading-relaxed">
        Os hábitos ligados a uma competência também aparecem na página dela.
      </p>
      {THEMES.map(({ theme, title, intro }) => {
        const habits = CATALOG.habits.filter((habit) => habit.theme === theme);
        if (habits.length === 0) return null;
        return (
          <section key={theme}>
            <SectionLabel>{title}</SectionLabel>
            <p className="text-ink-soft mt-1 text-[13px]">{intro}</p>
            <ul className="mt-3 space-y-4">
              {habits.map((habit) => (
                <li key={habit.id}>
                  <span className="text-ink block text-[14.5px] leading-snug">{habit.title}</span>
                  <span className="text-ink-soft mt-0.5 block text-[13px] leading-relaxed">{habit.detail}</span>
                  <span className="text-ink-faint mt-0.5 block text-[12px]">
                    {habit.credit}
                    {habit.competencies.map((id) => (
                      <span key={id}>
                        {' · '}
                        <Link
                          href={`/competencias/${id}${suffix}`}
                          className="underline decoration-[var(--rule)] underline-offset-2 hover:text-ink"
                        >
                          {CATALOG.competencies.get(id)?.name ?? id}
                        </Link>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <SectionLabel>De onde vêm os hábitos</SectionLabel>
      <p className="text-ink-soft mt-1 text-[13px]">
        Sem link: aqui não se aponta para cópia. O ISBN basta para comprar ou pedir na biblioteca.
      </p>
      <ul className="mt-3 space-y-4">
        {CANON.map((work) => (
          <li key={work.isbn}>
            <span className="text-ink block text-[14.5px] leading-snug">{work.title}</span>
            <span className="text-ink-soft block text-[12.5px]">
              {work.authors} · {work.edition} · ISBN {work.isbn}
            </span>
            <span className="text-ink-soft mt-0.5 block text-[13px] leading-relaxed">{work.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
