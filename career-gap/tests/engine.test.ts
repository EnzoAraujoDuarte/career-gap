import { describe, expect, it } from 'vitest';
import { CATALOG, CATALOG_VERSION, FIRST_WEB_ROLE } from '@/catalog';
import { generateRoadmap } from '@/domain/roadmap';
import { PrerequisiteGraph } from '@/domain/graph';
import { levelIndex } from '@/domain/model';
import type { Level } from '@/domain/model';
import type { Roadmap, RoadmapItem } from '@/domain/model';
import {
  ALL_FIXTURES,
  absoluteBeginner,
  almostReady,
  csStudent,
  inflatedSelfReport,
  selfTaughtFrontend,
} from './fixtures';

const FIXED_NOW = new Date('2026-09-10T12:00:00.000Z');
const run = (profile: Parameters<typeof generateRoadmap>[0]): Roadmap =>
  generateRoadmap(profile, CATALOG, { now: FIXED_NOW });

const idsOf = (items: readonly RoadmapItem[]) => items.map((item) => item.competency);

describe('elegibilidade — etapa 1', () => {
  it('nunca marca como disponível um item com pré-requisito pendente', () => {
    const graph = new PrerequisiteGraph(CATALOG.prerequisites);

    for (const profile of ALL_FIXTURES) {
      const roadmap = run(profile);
      const levels = new Map(profile.competencies.map((c) => [c.competency, c.level]));
      const levelOf = (id: string): Level => levels.get(id) ?? 'L0';

      for (const item of roadmap.items) {
        const unmet = graph.unmetPrerequisites(item.competency, levelOf);
        expect(item.status, `${profile.id} / ${item.competency}`).toBe(
          unmet.length > 0 ? 'blocked' : 'available',
        );
        if (item.status === 'blocked') expect(item.blockedBy.length).toBeGreaterThan(0);
      }
    }
  });

  it('coloca um item sempre em onda posterior à dos seus bloqueadores', () => {
    const roadmap = run(absoluteBeginner);
    const waveOf = new Map(roadmap.items.map((item) => [item.competency, item.wave]));

    for (const item of roadmap.items) {
      for (const blocker of item.blockedBy) {
        const blockerWave = waveOf.get(blocker);
        if (blockerWave === undefined) continue;
        expect(item.wave, `${item.competency} depois de ${blocker}`).toBeGreaterThan(blockerWave);
      }
    }
  });

  it('recomenda fundamento, não algo travado, para quem começa do zero', () => {
    const roadmap = run(absoluteBeginner);

    expect(roadmap.nextBestAction).toBeDefined();
    expect(roadmap.nextBestAction?.status).toBe('available');
    expect(roadmap.nextBestAction?.wave).toBe(0);
    expect(roadmap.nextBestAction?.blockedBy).toEqual([]);
    // Construir aplicação e publicar dependem de base; não podem abrir o roadmap.
    expect(roadmap.nextBestAction?.competency).not.toBe('build-an-application');
    expect(roadmap.nextBestAction?.competency).not.toBe('deployment-basics');
  });
});

describe('ranking — etapa 2', () => {
  it('soma as parcelas exatamente no total do escore', () => {
    for (const item of run(bootcamp()).items) {
      const { gapSize, criticality, unlockCount, total } = item.breakdown;
      const sum = gapSize.contribution + criticality.contribution + unlockCount.contribution;
      expect(Math.abs(sum - total)).toBeLessThan(1e-9);
    }
  });

  it('ordena por onda e depois por escore, de forma estável', () => {
    const items = run(absoluteBeginner).items;
    for (let i = 1; i < items.length; i += 1) {
      const previous = items[i - 1];
      const current = items[i];
      expect(previous.wave).toBeLessThanOrEqual(current.wave);
      if (previous.wave === current.wave) {
        expect(previous.score).toBeGreaterThanOrEqual(current.score);
      }
      expect(current.rank).toBe(i + 1);
    }
  });

  it('produz resultado idêntico para o mesmo perfil', () => {
    expect(JSON.stringify(run(csStudent))).toBe(JSON.stringify(run(csStudent)));
  });
});

describe('política editorial — etapa 3', () => {
  it('adia tecnologia volátil enquanto há fundamento core pendente', () => {
    const roadmap = run(absoluteBeginner);
    const excluded = roadmap.excluded.find(
      (item) => item.competency === 'ai-assisted-development-basics',
    );

    expect(excluded?.reasonCode).toBe('PREMATURE_SPECIALIZATION');
    expect(idsOf(roadmap.items)).not.toContain('ai-assisted-development-basics');
  });

  it('diz explicitamente o que ignorar agora, com motivo', () => {
    const roadmap = run(absoluteBeginner);
    const outOfScope = roadmap.excluded.filter(
      (item) => item.reasonCode === 'OUT_OF_TRACK_SCOPE',
    );

    expect(outOfScope.length).toBeGreaterThan(0);
    expect(outOfScope.map((item) => item.competency)).toContain('container-orchestration');
    for (const item of roadmap.excluded) {
      expect(item.explanation.length).toBeGreaterThan(20);
    }
  });

  it('nunca promove um item: exclusão e recomendação são conjuntos disjuntos', () => {
    for (const profile of ALL_FIXTURES) {
      const roadmap = run(profile);
      const recommended = new Set(idsOf(roadmap.items));
      for (const excluded of roadmap.excluded) {
        expect(recommended.has(excluded.competency)).toBe(false);
      }
    }
  });
});

describe('gaps e evidência', () => {
  it('exclui do roadmap o que já atingiu o alvo', () => {
    const roadmap = run(almostReady);

    expect(roadmap.met).toContain('build-an-application');
    expect(idsOf(roadmap.items)).not.toContain('build-an-application');
    // O que falta a esse perfil é qualidade e comunicação, não fundamento.
    expect(idsOf(roadmap.items)).toContain('automated-testing-basics');
    expect(idsOf(roadmap.items)).toContain('technical-communication');
  });

  it('pede verificação em vez de rebaixar autoavaliação em competência que trava outras', () => {
    const roadmap = run(inflatedSelfReport);

    expect(roadmap.verificationNeeded.length).toBeGreaterThan(0);
    // O nível declarado é preservado: o sistema pede prova, não desconta em silêncio.
    for (const item of roadmap.items) {
      const declared = inflatedSelfReport.competencies.find(
        (c) => c.competency === item.competency,
      );
      if (declared) expect(item.gap.currentLevel).toBe(declared.level);
    }
  });

  it('sinaliza para verificação também o que foi declarado como já atingido', () => {
    const roadmap = run(inflatedSelfReport);

    // programming-fundamentals destrava oito competências. Se a declaração de L2 for
    // falsa, ela some do roadmap e ainda libera indevidamente tudo o que vem depois —
    // por isso precisa aparecer mesmo estando em `met`.
    expect(roadmap.met).toContain('programming-fundamentals');
    expect(roadmap.verificationNeeded).toContain('programming-fundamentals');
  });

  it('não pede verificação de quem já trouxe evidência objetiva', () => {
    const roadmap = run(almostReady);
    // Estas vieram de probe/artifact, não de autoavaliação.
    expect(roadmap.verificationNeeded).not.toContain('programming-fundamentals');
    expect(roadmap.verificationNeeded).not.toContain('build-an-application');
  });

  it('trata ausência de informação como L0, não como capacidade', () => {
    const roadmap = run(absoluteBeginner);
    expect(roadmap.met).toEqual([]);
    for (const item of roadmap.items) expect(item.gap.currentLevel).toBe('L0');
  });
});

describe('ênfases', () => {
  it('reposiciona dados e API entre frontend e backend sobre o mesmo catálogo', () => {
    const frontend = run({ ...csStudent, emphasisId: 'frontend' });
    const backend = run({ ...csStudent, emphasisId: 'backend' });

    const rankOf = (roadmap: Roadmap, id: string) =>
      roadmap.items.find((item) => item.competency === id)?.rank ?? Number.MAX_SAFE_INTEGER;

    expect(rankOf(backend, 'api-development')).toBeLessThan(rankOf(frontend, 'api-development'));
    expect(rankOf(frontend, 'dom-and-browser')).toBeLessThan(rankOf(backend, 'dom-and-browser'));
  });

  it('não permite que a ênfase adicione ou remova competências do track', () => {
    const base = new Set(FIRST_WEB_ROLE.requirements.map((item) => item.competency));
    for (const emphasis of FIRST_WEB_ROLE.emphases) {
      for (const adjustment of emphasis.adjustments) {
        expect(base.has(adjustment.competency)).toBe(true);
      }
    }
  });

  it('eleva o alvo de SQL na ênfase de backend', () => {
    const backend = run(csStudent);
    const sql = backend.items.find((item) => item.competency === 'sql-basics');
    expect(sql?.gap.targetLevel).toBe('L2');
    expect(levelIndex(sql?.gap.targetLevel ?? 'L0')).toBeGreaterThan(levelIndex('L1'));
  });
});

describe('rastreabilidade', () => {
  it('grava versão do catálogo e snapshot da entrada em todo roadmap', () => {
    const roadmap = run(selfTaughtFrontend);

    expect(roadmap.catalogVersion).toBe(CATALOG_VERSION);
    expect(roadmap.generatedAt).toBe(FIXED_NOW.toISOString());
    expect(roadmap.inputSnapshot).toEqual(selfTaughtFrontend);
  });

  it('acompanha cada item de códigos de razão estruturados', () => {
    for (const item of run(selfTaughtFrontend).items) {
      expect(item.reasonCodes.length).toBeGreaterThan(0);
    }
  });
});

function bootcamp() {
  return ALL_FIXTURES.find((profile) => profile.id === 'fixture-bootcamp-graduate')!;
}

describe('composição do NOT NOW', () => {
  it('sempre reserva espaço para temas fora do objetivo, mesmo com muitas regras acionadas', () => {
    for (const profile of ALL_FIXTURES) {
      const roadmap = run(profile);
      const horizon = roadmap.excluded.filter(
        (item) => item.reasonCode === 'OUT_OF_TRACK_SCOPE',
      );
      expect(horizon.length, profile.id).toBeGreaterThanOrEqual(2);
      expect(roadmap.excluded.length).toBeLessThanOrEqual(6);
    }
  });
});
