'use client';

import Link from 'next/link';
import { CATALOG } from '@/catalog';
import type { ToolCategory, ToolGate, ToolSetupKind } from '@/domain/model';
import { assessTools } from '@/domain/tools';
import { useCurrentProfile } from '@/lib/current-profile';
import { COST_LABEL, LEVEL_SHORT, PT_BR_LABEL } from '@/lib/reason-text';

/** "2026-10-15" vira "out. de 2026": a data serve para dizer se a informação é recente. */
const formatMonth = (isoDate: string) =>
  new Date(`${isoDate}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
import { AdviceMark } from '@/components/ui/advice-mark';
import { CopyCommand } from '@/components/ui/copy-command';
import { Tag } from '@/components/ui/tag';

/** O que a pessoa precisa fazer para ter a ferramenta, em duas palavras. */
const SETUP_LABEL: Record<ToolSetupKind, string> = {
  'built-in': 'já vem no computador',
  account: 'conta gratuita',
  install: 'programa para instalar',
  'project-dependency': 'dependência do projeto',
  'repository-file': 'arquivo no repositório',
  'claude-plugin': 'plugin do Claude Code',
};

const CATEGORY_LABEL: Record<ToolCategory, string> = {
  editor: 'editor',
  'version-control': 'versionamento',
  browser: 'navegador',
  http: 'HTTP',
  quality: 'qualidade',
  ai: 'IA',
  delivery: 'entrega',
};

const gateText = (gate: ToolGate) =>
  `${CATALOG.competencies.get(gate.competency)?.name ?? gate.competency} (${LEVEL_SHORT[gate.atLevel]})`;

/**
 * As ferramentas de quem desenvolve em 2026. Todas abertas: o portão de competência virou
 * conselho. A ferramenta de IA continua marcada como "falta base" para quem ainda não depura
 * (Shen e Tamkin, 2026) — mas o link funciona.
 */
export function ToolsTab() {
  const { profile } = useCurrentProfile();
  const items = assessTools(CATALOG.tools, profile ?? undefined)
    .map((item) => ({ ...item, gates: profile ? item.missing : item.tool.unlockedBy }))
    .sort((a, b) => a.gates.length - b.gates.length);

  return (
    <section className="mt-5">
      <p className="text-ink-soft text-[13px] leading-relaxed">
        Cada uma no momento em que deixa de ser muleta e passa a ser alavanca, e cada uma diz como
        se passa a tê-la: se já vem no computador, se é conta, programa, dependência do projeto ou
        plugin do Claude Code. Nada aqui é obrigatório.
        {' '}
        <Link href="/kit" className="text-now underline underline-offset-2">
          As de IA se instalam juntas, com um comando.
        </Link>
        {profile === null && (
          <>
            {' '}
            <Link href="/avaliacao" className="text-now underline underline-offset-2">
              Diga o que você já sabe
            </Link>{' '}
            e esta lista marca o que já serve para você.
          </>
        )}
      </p>
      <ul className="mt-4 space-y-6">
        {items.map(({ tool, gates }) => (
          <li key={tool.id}>
            {profile && (
              <p className="mb-0.5">
                {gates.length === 0 ? (
                  <span className="hand text-done text-[13.5px]">✓ já serve para você</span>
                ) : (
                  <AdviceMark kind="missing-base" />
                )}
              </p>
            )}
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink focus-visible:outline-attention text-[15px] underline decoration-[var(--rule)] underline-offset-2 hover:decoration-[var(--ink)] focus-visible:outline-2"
            >
              {tool.name}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            <span className="text-ink-faint ml-2 text-[12px]">{CATEGORY_LABEL[tool.category]}</span>
            <p className="text-ink mt-1 text-[13.5px] leading-snug">{tool.use}</p>
            <p className="text-ink-soft mt-1 text-[13px] leading-relaxed">{tool.why}</p>
            <p className="text-ink-soft mt-1 text-[12.5px] leading-snug">
              {gates.length === 0
                ? profile
                  ? 'Pode adotar agora.'
                  : 'Desde o primeiro dia.'
                : `Faz mais sentido depois de: ${gates.map(gateText).join(' · ')}`}
            </p>
            <div className="mt-2 border-l border-[var(--rule)] pl-3">
              <p className="text-ink text-[12.5px]">
                <span className="text-ink-soft">Como ter · </span>
                {SETUP_LABEL[tool.setup.kind]}
              </p>
              <p className="text-ink-soft mt-0.5 text-[12.5px] leading-snug">{tool.setup.note}</p>
              {tool.setup.command && (
                <div className="mt-1.5">
                  <CopyCommand command={tool.setup.command} compact />
                </div>
              )}
            </div>
            <span className="mt-1.5 flex flex-wrap gap-1.5">
              <Tag warn={tool.ptBrStatus === 'none'}>docs {PT_BR_LABEL[tool.ptBrStatus]}</Tag>
              <Tag warn={tool.cost === 'paid'}>{tool.costNote ?? COST_LABEL[tool.cost]}</Tag>
              {tool.stability === 'volatile' && <Tag warn>muda rápido · conferido em {formatMonth(tool.verifiedAt)}</Tag>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
