/**
 * Imprime o roadmap gerado para cada perfil-fixture.
 *
 * É o instrumento de validação do motor antes de existir interface, e também a origem
 * do "exemplo trabalhado" que o TCC precisa mostrar: entrada -> parcelas -> escore ->
 * regras acionadas -> posição final.
 *
 *   pnpm inspect:roadmaps            todos os perfis, resumido
 *   pnpm inspect:roadmaps --full     inclui o detalhamento do escore
 */
import { CATALOG } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { LEVEL_NAMES } from '@/domain/model';
import type { Roadmap, RoadmapItem } from '@/domain/model';
import { ALL_FIXTURES } from '@/lib/demo-profiles';

const FULL = process.argv.includes('--full');
const NOW = new Date('2026-09-10T12:00:00.000Z');

const nameOf = (id: string) => CATALOG.competencies.get(id)?.name ?? id;

function describeItem(item: RoadmapItem, indent = '   '): string {
  const marker = item.status === 'blocked' ? '·' : '→';
  const gap = `${item.gap.currentLevel}→${item.gap.targetLevel}`;
  const head =
    `${indent}${marker} ${String(item.rank).padStart(2)}. ${nameOf(item.competency)} ` +
    `[${gap}, ${item.gap.criticality}, escore ${item.score.toFixed(3)}]`;

  const lines = [head];
  if (item.status === 'blocked') {
    lines.push(`${indent}      travado por: ${item.blockedBy.map(nameOf).join(', ')}`);
  }
  if (FULL) {
    const b = item.breakdown;
    lines.push(
      `${indent}      gap ${b.gapSize.normalized}×${b.gapSize.weight}=${b.gapSize.contribution} ` +
        `| criticidade ${b.criticality.normalized}×${b.criticality.weight}=${b.criticality.contribution} ` +
        `| destrava ${b.unlockCount.raw} (${b.unlockCount.normalized})×${b.unlockCount.weight}=${b.unlockCount.contribution}`,
    );
    lines.push(`${indent}      razões: ${item.reasonCodes.join(', ')}`);
  }
  return lines.join('\n');
}

function report(roadmap: Roadmap, profileId: string): void {
  const waves = [...new Set(roadmap.items.map((item) => item.wave))].sort((a, b) => a - b);

  console.log(`\n${'='.repeat(78)}`);
  console.log(`PERFIL  ${profileId}${roadmap.emphasisId ? `   ênfase: ${roadmap.emphasisId}` : ''}`);
  console.log(
    `        ${roadmap.met.length} competências atingidas · ${roadmap.items.length} em aberto · ` +
      `${roadmap.excluded.length} adiadas`,
  );

  const next = roadmap.nextBestAction;
  if (next) {
    console.log(`\nFOCO AGORA  ${nameOf(next.competency)}`);
    console.log(
      `            ${LEVEL_NAMES[next.gap.currentLevel]} → ${LEVEL_NAMES[next.gap.targetLevel]}`,
    );
    console.log(`            ${next.reasonCodes.join(', ')}`);
  }

  for (const wave of waves) {
    const items = roadmap.items.filter((item) => item.wave === wave);
    console.log(`\n   ONDA ${wave} ${wave === 0 ? '(alcançável agora)' : '(depois das anteriores)'}`);
    for (const item of items) console.log(describeItem(item));
  }

  if (roadmap.verificationNeeded.length > 0) {
    console.log('\n   VERIFICAR (autodeclarado e destrava outras)');
    for (const id of roadmap.verificationNeeded) console.log(`     ? ${nameOf(id)}`);
  }

  console.log('\n   NOT NOW');
  for (const excluded of roadmap.excluded) {
    console.log(`     × ${nameOf(excluded.competency)} — ${excluded.reasonCode}`);
    console.log(`       ${excluded.explanation}`);
  }
}

for (const profile of ALL_FIXTURES) {
  report(generateRoadmap(profile, CATALOG, { now: NOW }), profile.id);
}
console.log(`\n${'='.repeat(78)}\ncatálogo ${CATALOG.version}\n`);
