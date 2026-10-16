import { describe, expect, it } from 'vitest';
import { CATALOG, PEOPLE } from '@/catalog';
import { validateCatalog } from '@/catalog/validate';
import { missingGates } from '@/domain/tools';
import { ALL_FIXTURES } from './fixtures';

const beginner = ALL_FIXTURES.find((profile) => profile.id === 'fixture-absolute-beginner')!;

describe('quem vale seguir', () => {
  it('é curadoria: poucos nomes, página oficial https e competência de verdade, Akita entre eles', () => {
    expect(PEOPLE.length).toBeGreaterThanOrEqual(8);
    expect(PEOPLE.length).toBeLessThanOrEqual(15);
    expect(PEOPLE.map((person) => person.id)).toContain('fabio-akita');
    for (const person of PEOPLE) {
      expect(person.url, person.id).toMatch(/^https:\/\//);
      for (const competency of person.competencies) expect(CATALOG.competencies.has(competency), `${person.id}: ${competency}`).toBe(true);
    }
  });

  it('dá ao iniciante absoluto quem serve no primeiro dia, e deixa o resto para depois com motivo', () => {
    const ready = PEOPLE.filter((person) => missingGates(person.unlockedBy, beginner).length === 0);
    const later = PEOPLE.filter((person) => missingGates(person.unlockedBy, beginner).length > 0);
    expect(ready.length).toBeGreaterThanOrEqual(4);
    expect(later.length).toBeGreaterThanOrEqual(3);
    for (const person of later) expect(person.unlockedBy.length, person.id).toBeGreaterThan(0);
  });

  it('o validador recusa página repetida, http e competência inventada', () => {
    const [first, second, ...rest] = PEOPLE;
    const problems = (people: typeof PEOPLE) =>
      validateCatalog({ ...CATALOG, people }).map((problem) => problem.rule);
    expect(problems([{ ...first, url: second.url }, second, ...rest])).toContain('person-url');
    expect(problems([{ ...first, url: 'http://exemplo.test' }, second, ...rest])).toContain('person-url');
    expect(problems([{ ...first, competencies: ['inventada'] }, second, ...rest])).toContain('person-competency');
    expect(problems(PEOPLE)).not.toContain('person-url');
  });
});
