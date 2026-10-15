'use client';

import { useState } from 'react';
import type { CareerTrack } from '@/domain/model';
import type { Catalog } from '@/domain/roadmap';
import { selectResourcesFor } from '@/domain/resources';
import { badgeFor } from '@/lib/tech-badge';
import type { ViewNode } from '@/lib/roadmap-view';
import { habitsFor } from '@/lib/roadmap-view';
import { FlowStation } from './flow-station';

/**
 * Renderiza o track inteiro como estações, sem estado do usuário.
 *
 * Monta `ViewNode` diretamente dos requisitos: nível atual é sempre L0 (não há perfil nesta
 * condição) e o alvo é o do track — o mesmo nível usado na condição personalizada, o que
 * garante que o CONJUNTO de recursos por competência seja idêntico nos dois lados.
 */
export function CatalogFlow({ track, catalog }: { track: CareerTrack; catalog: Catalog }) {
  const [expanded, setExpanded] = useState<string | undefined>(undefined);

  const nodes: ViewNode[] = track.requirements.map((requirement) => {
    const competency = catalog.competencies.get(requirement.competency);
    const resources = selectResourcesFor(
      requirement.competency,
      requirement.targetLevel,
      catalog.resources,
    );
    return {
      id: requirement.competency,
      name: competency?.name ?? requirement.competency,
      status: 'available',
      currentLevel: 'L0',
      targetLevel: requirement.targetLevel,
      criticality: requirement.criticality,
      reasonCodes: [],
      blockedBy: [],
      needsVerification: false,
      summary: competency?.summary ?? '',
      resources,
      techBadge: badgeFor(resources, competency?.name ?? requirement.competency),
      exitCriteria: competency?.levels[requirement.targetLevel]?.exitCriteria ?? [],
      habits: habitsFor(catalog, requirement.competency),
    };
  });

  return (
    <ol className="mt-7">
      {nodes.map((node) => (
        <FlowStation
          key={node.id}
          node={node}
          expanded={expanded === node.id}
          onToggle={() => setExpanded(expanded === node.id ? undefined : node.id)}
        />
      ))}
    </ol>
  );
}
