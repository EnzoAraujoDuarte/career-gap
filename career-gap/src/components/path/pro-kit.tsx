'use client';

import Link from 'next/link';
import { CATALOG } from '@/catalog';
import type { Resource, Tool, UserProfile } from '@/domain/model';
import { assessTools } from '@/domain/tools';
import { AdviceMark } from '@/components/ui/advice-mark';

/**
 * O kit de desenvolvimento profissional, à mostra logo no começo: as ferramentas, as skills e
 * os sites que o autor usa no trabalho, para quem já começou a criar alguma coisa.
 *
 * É a mesma lógica do Kit inteiro: tudo aparece, e o portão de competência só anota quando a
 * ferramenta vira alavanca em vez de muleta (ADR-0009). A seleção é editorial; a avaliação vem
 * do motor.
 */
const TOOL_IDS = ['kit-career-gap', 'context7', 'ai-memory', 'impeccable', 'superpowers', 'agent-skills'] as const;
const SITE_IDS = ['awwwards-sites-premiados-por-design-e-desenvolvimento-front-end', 'mobbin-biblioteca-de-padroes-de-interface-de-produtos-reais'] as const;

const TOOLS = TOOL_IDS.map((id) => CATALOG.tools.find((tool) => tool.id === id)).filter((tool): tool is Tool => Boolean(tool));
const SITES = SITE_IDS.map((id) => CATALOG.resources.find((resource) => resource.id === id)).filter(
  (resource): resource is Resource => Boolean(resource),
);

export function ProKit({ profile, suffix }: { profile: UserProfile | null; suffix: string }) {
  const assessed = new Map(
    assessTools(TOOLS, profile ?? undefined).map((item) => [item.tool.id, profile ? item.missing : []]),
  );
  const nameOf = (competency: string) => CATALOG.competencies.get(competency)?.name ?? competency;

  return (
    <section aria-labelledby="kit-profissional" className="border-rule mt-12 border-t pt-7">
      <h2 id="kit-profissional" className="font-serif text-ink text-[22px] leading-tight">
        O kit de desenvolvimento profissional
      </h2>
      <p className="text-ink-soft mt-1 max-w-[62ch] text-[13.5px] leading-relaxed">
        Para quem já começou a criar alguma coisa: as ferramentas, as skills e os sites que o autor
        usa no trabalho, com o momento em que cada uma passa a render. Nada aqui é trancado.
      </p>

      <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {TOOLS.map((tool) => {
          const missing = assessed.get(tool.id) ?? [];
          return (
            <li key={tool.id} className="min-w-0">
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink focus-visible:outline-attention text-[15px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                >
                  {tool.name}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                {profile &&
                  (missing.length === 0 ? (
                    <span className="hand text-done text-[13.5px]">✓ já serve para você</span>
                  ) : (
                    <AdviceMark kind="missing-base" />
                  ))}
              </p>
              <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{tool.use}</p>
              {profile && missing.length > 0 && (
                <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">
                  rende depois de{' '}
                  {missing.map((gate, index) => (
                    <span key={gate.competency}>
                      {index > 0 && ' e '}
                      <Link
                        href={`/competencias/${gate.competency}${suffix}`}
                        className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                      >
                        {nameOf(gate.competency)}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-ink-soft mt-6 text-[13px] leading-relaxed">
        <span className="text-ink">Para calibrar o olho:</span>{' '}
        {SITES.map((site, index) => (
          <span key={site.id}>
            {index > 0 && ' e '}
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
            >
              {site.sourceName}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </span>
        ))}
        , o que o front-end de nível alto faz e como os produtos de verdade resolvem cada tela.
      </p>
      <p className="mt-4">
        <Link
          href={`/kit${suffix}`}
          className="focus-visible:outline-attention inline-flex min-h-11 items-center rounded-sm bg-[var(--ink)] px-4 text-[14px] text-[var(--paper)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Instalar o kit com um comando →
        </Link>
      </p>
    </section>
  );
}
