'use client';

import { CATALOG } from '@/catalog';
import type { ToolCategory, ToolGate } from '@/domain/model';
import { assessTools } from '@/domain/tools';
import { useCurrentProfile } from '@/lib/current-profile';
import { COST_LABEL, LEVEL_SHORT, PT_BR_LABEL } from '@/lib/reason-text';
import { AdviceMark } from '@/components/ui/advice-mark';
import { Tag } from '@/components/ui/tag';

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
        Cada uma no momento em que deixa de ser muleta e passa a ser alavanca.
        {!profile && ' Diga o que você já sabe e esta lista marca o que já serve para você.'}
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
            <span className="mt-1.5 flex flex-wrap gap-1.5">
              <Tag warn={tool.ptBrStatus === 'none'}>docs {PT_BR_LABEL[tool.ptBrStatus]}</Tag>
              <Tag warn={tool.cost === 'paid'}>{tool.costNote ?? COST_LABEL[tool.cost]}</Tag>
              {tool.stability === 'volatile' && <Tag warn>muda rápido · conferido em {tool.verifiedAt}</Tag>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
