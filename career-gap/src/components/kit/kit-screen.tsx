'use client';

import Link from 'next/link';
import { CATALOG, FIRST_WEB_ROLE } from '@/catalog';
import type { Tool, UserProfile } from '@/domain/model';
import { assessTools } from '@/domain/tools';
import { useCurrentProfile, useProfileSuffix } from '@/lib/current-profile';
import { Loading, PageShell, SectionLabel } from '@/components/ecosystem/page-shell';
import { CopyCommand } from '@/components/ui/copy-command';

/**
 * A página do kit de desenvolvimento profissional: um comando, a pessoa marca o que quer, e
 * cada ferramenta explicada em uma linha, com o momento em que passa a render.
 *
 * O instalador vive no repositório do kit e só roda `claude plugin …`; aqui mostramos o
 * comando e o que ele oferece, lendo do catálogo para a explicação e o portão nunca divergirem
 * do Explorar (ADR-0009: tudo aparece, o portão só anota).
 */
const INSTALL_COMMAND =
  'bash <(curl -fsSL https://raw.githubusercontent.com/EnzoAraujoDuarte/kit-career-gap/main/install.sh)';

/** O que o instalador oferece, na ordem em que pergunta. Ids do catálogo de ferramentas. */
const OFFERED: readonly { id: string; installs: string }[] = [
  { id: 'kit-career-gap', installs: 'o plugin essencial, com as regras, as skills pr, depurar, decisao e passagem, o agente revisor e o Context7' },
  { id: 'superpowers', installs: 'o plugin superpowers do marketplace oficial' },
  { id: 'impeccable', installs: 'o marketplace e o plugin impeccable' },
  { id: 'agent-skills', installs: 'frontend-design e skill-creator, do marketplace oficial' },
];

export function KitScreen() {
  const { profile } = useCurrentProfile();
  const suffix = useProfileSuffix();
  const tools = OFFERED.map((item) => ({
    ...item,
    tool: CATALOG.tools.find((tool) => tool.id === item.id),
  })).filter((item): item is typeof item & { tool: Tool } => Boolean(item.tool));

  return (
    <PageShell
      current="explorar"
      title="O kit de desenvolvimento profissional"
      intro="Para quem já começou a criar alguma coisa: as ferramentas, as skills e os sites que o autor deste site usa no trabalho, numa empresa fora do Brasil. Um comando, você marca o que quer, e nada é instalado sem você pedir."
    >
      {profile === undefined ? (
        <Loading />
      ) : (
        <>
          <section className="mt-7">
            <h2 className="font-serif text-ink text-[20px] leading-tight">Um comando no terminal</h2>
            <p className="text-ink-soft mt-1 max-w-[62ch] text-[13.5px] leading-relaxed">
              Cole no terminal e aperte Enter. Ele lista o que existe, pergunta os números que você
              quer e roda só os comandos do Claude Code correspondentes. Sem senha, sem mexer nos
              seus arquivos. No Windows, rode no WSL ou no Git Bash.
            </p>
            <div className="mt-3">
              <CopyCommand command={INSTALL_COMMAND} />
            </div>
            <p className="text-ink-soft mt-2 text-[12.5px] leading-snug">
              Precisa do{' '}
              <a
                href="https://code.claude.com/docs/en/quickstart"
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)]"
              >
                Claude Code
                <span className="sr-only"> (abre em nova aba)</span>
              </a>{' '}
              instalado, que exige uma assinatura Claude (Pro ou acima) ou créditos de API; se não
              estiver, o instalador para e diz o comando oficial. Quer ver o que ele faria sem instalar
              nada? Acrescente <code className="text-ink">--simular</code> no fim. O código do instalador
              é aberto, no{' '}
              <a
                href="https://github.com/EnzoAraujoDuarte/kit-career-gap/blob/main/install.sh"
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)]"
              >
                repositório do kit
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
              .
            </p>
          </section>

          <Offered items={tools} profile={profile} suffix={suffix} />

          <Sites />
        </>
      )}
    </PageShell>
  );
}

function Offered({
  items,
  profile,
  suffix,
}: {
  items: readonly { id: string; installs: string; tool: Tool }[];
  profile: UserProfile | null;
  suffix: string;
}) {
  const assessed = new Map(
    assessTools(
      items.map((item) => item.tool),
      profile ?? undefined,
    ).map((item) => [item.tool.id, item.missing]),
  );
  const nameOf = (competency: string) => CATALOG.competencies.get(competency)?.name ?? competency;

  return (
    <section>
      <SectionLabel>O que ele oferece</SectionLabel>
      <p className="text-ink-soft mt-1 max-w-[62ch] text-[13px] leading-relaxed">
        Cada item em uma linha, para você escolher sem visitar site por site. O “rende depois de”
        vem do mesmo motor da trilha: é conselho, não cadeado.
      </p>
      <ol className="mt-4 space-y-5">
        {items.map((item, index) => {
          const missing = profile ? (assessed.get(item.id) ?? []) : [];
          return (
            <li key={item.id} className="flex gap-4">
              <span className="font-serif text-ink-faint w-5 shrink-0 text-[18px] leading-tight tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <a
                    href={item.tool.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ink focus-visible:outline-attention text-[16px] font-medium underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                  >
                    {item.tool.name}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                  {profile && missing.length === 0 && (
                    <span className="hand text-done text-[13.5px]">✓ já serve para você</span>
                  )}
                </p>
                <p className="text-ink mt-0.5 text-[14px] leading-relaxed">{item.tool.use}</p>
                <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">Instala {item.installs}.</p>
                {item.tool.setup.command && item.id !== 'kit-career-gap' && (
                  <div className="mt-1.5">
                    <CopyCommand command={item.tool.setup.command} compact />
                  </div>
                )}
                <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">
                  {profile && missing.length > 0 ? (
                    <>
                      Rende depois de{' '}
                      {missing.map((gate, i) => (
                        <span key={gate.competency}>
                          {i > 0 && ' e '}
                          <Link
                            href={`/competencias/${gate.competency}${suffix}`}
                            className="text-ink focus-visible:outline-attention underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
                          >
                            {nameOf(gate.competency)}
                          </Link>
                        </span>
                      ))}
                      .
                    </>
                  ) : (
                    item.tool.why
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-ink-soft mt-5 text-[13px]">
        As outras ferramentas do dia a dia, com o mesmo portão, estão em{' '}
        <Link href={`/explorar?aba=ferramentas${suffix ? `&${suffix.slice(1)}` : ''}`} className="text-now underline underline-offset-2">
          Explorar · Ferramentas
        </Link>
        .
      </p>
    </section>
  );
}

/** Os dois sites para calibrar o olho, com o argumento do autor, não só o link. */
function Sites() {
  const awwwards = CATALOG.resources.find((resource) => resource.sourceName === 'Awwwards');
  const mobbin = CATALOG.resources.find((resource) => resource.sourceName === 'Mobbin');
  const gates = FIRST_WEB_ROLE.requirements.filter((item) => item.competency === 'css-layout');
  return (
    <section>
      <SectionLabel>Para calibrar o olho</SectionLabel>
      <p className="text-ink-soft mt-1 max-w-[62ch] text-[13px] leading-relaxed">
        Quem já faz uma página precisa saber como é uma página muito boa. Dois lugares resolvem isso.
        {gates.length > 0 && ' Rendem depois de CSS: estilo e layout.'}
      </p>
      <div className="mt-5 grid gap-8 sm:grid-cols-2">
        <article className="flex gap-4">
          <LaurelGlyph />
          <div className="min-w-0">
            <h3 className="font-serif text-ink text-[20px] leading-tight">
              <a
                href={awwwards?.url ?? 'https://www.awwwards.com/websites/'}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-visible:outline-attention underline decoration-transparent underline-offset-4 hover:decoration-[var(--ink)] focus-visible:outline-2"
              >
                Awwwards
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </h3>
            <p className="text-ink mt-2 text-[14px] leading-relaxed">
              Você já viu o site do Lando Norris? Ou os sites das temporadas da Shopify, os Editions?
              Os sites mais premiados do planeta ficam reunidos num lugar só: o Awwwards. Abra um,
              inspecione no DevTools e veja como o layout, a tipografia e o movimento foram feitos.
            </p>
          </div>
        </article>
        <article className="flex gap-4">
          <ScreensGlyph />
          <div className="min-w-0">
            <h3 className="font-serif text-ink text-[20px] leading-tight">
              <a
                href={mobbin?.url ?? 'https://mobbin.com/'}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-visible:outline-attention underline decoration-transparent underline-offset-4 hover:decoration-[var(--ink)] focus-visible:outline-2"
              >
                Mobbin
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </h3>
            <p className="text-ink mt-2 text-[14px] leading-relaxed">
              No Mobbin você encontra designs de produtos reais, e não só dos premiados: sites
              empresariais, institucionais, aplicativos, tela por tela, organizados por padrão: login,
              busca, formulário, estado vazio. Quando não souber como um componente costuma se
              comportar, a referência está lá. Plano gratuito com limite.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Um louro, a traço: o prêmio. */
function LaurelGlyph() {
  return (
    <svg width="56" height="50" viewBox="0 0 56 50" className="text-ink mt-1 shrink-0" aria-hidden>
      <path d="M28 8v30" {...STROKE} />
      <path d="M28 44c-8 0-15-5-18-13 6 0 12 4 15 9M28 44c8 0 15-5 18-13-6 0-12 4-15 9" {...STROKE} />
      <path d="M26 30c-6-1-11-6-12-13 5 1 9 5 11 10M30 30c6-1 11-6 12-13-5 1-9 5-11 10" {...STROKE} />
      <path d="M27 20c-4-1-7-5-7-10 4 1 6 4 7 8M29 20c4-1 7-5 7-10-4 1-6 4-7 8" {...STROKE} />
      <circle cx="28" cy="6" r="2.2" {...STROKE} />
    </svg>
  );
}

/** Telas lado a lado, a traço: a biblioteca de padrões. */
function ScreensGlyph() {
  return (
    <svg width="56" height="50" viewBox="0 0 56 50" className="text-ink mt-1 shrink-0" aria-hidden>
      <rect x="4" y="8" width="14" height="30" rx="2.5" {...STROKE} />
      <rect x="21" y="8" width="14" height="30" rx="2.5" {...STROKE} />
      <rect x="38" y="8" width="14" height="30" rx="2.5" {...STROKE} />
      <path d="M8 16h6M8 21h4M25 16h6M25 21h6M25 26h4M42 16h6M42 21h3" {...STROKE} />
      <rect x="25" y="30" width="6" height="4" rx="1" {...STROKE} />
      <circle cx="45" cy="30" r="2.5" {...STROKE} />
      <path d="M11 44h34" {...STROKE} strokeDasharray="2 3" />
    </svg>
  );
}
