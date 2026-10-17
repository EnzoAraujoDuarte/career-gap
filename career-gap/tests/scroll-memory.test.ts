import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { aimReturnAt, forgetReturns, rememberOnDetailLink } from '@/lib/scroll-memory';

/** sessionStorage mínimo: os itens são propriedades próprias, como no navegador. */
function fakeSessionStorage(): Storage {
  const storage = {} as Record<string, string>;
  Object.defineProperties(storage, {
    getItem: { value: (key: string) => (key in storage ? storage[key] : null) },
    setItem: { value: (key: string, value: string) => void (storage[key] = String(value)) },
    removeItem: { value: (key: string) => void delete storage[key] },
  });
  return storage as unknown as Storage;
}

const saved = (key: string) => JSON.parse(sessionStorage.getItem(`career-gap:volta:${key}`) ?? 'null');
const clickOn = (href: string) => ({ target: { closest: () => ({ getAttribute: () => href }) } }) as unknown as React.MouseEvent;

describe('voltar para onde a pessoa estava', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-17T12:00:00Z'));
    vi.stubGlobal('sessionStorage', fakeSessionStorage());
    vi.stubGlobal('window', { scrollY: 4289 });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('guarda a posição ao abrir uma página de detalhe, e só nesse caso', () => {
    const remember = rememberOnDetailLink('trilha', ['/competencias/', '/construir/']);
    remember(clickOn('/avaliacao'));
    expect(saved('trilha')).toBeNull();
    remember(clickOn('/competencias/css-layout?perfil=x'));
    expect(saved('trilha')).toMatchObject({ y: 4289 });
  });

  it('o "← Trilha" não passa por cima da posição guardada; sem ela, mira a estação', () => {
    rememberOnDetailLink('trilha', ['/construir/'])(clickOn('/construir/pagina-de-um-negocio'));
    aimReturnAt('trilha', 'css-layout');
    expect(saved('trilha')).toMatchObject({ y: 4289 });

    sessionStorage.removeItem('career-gap:volta:trilha');
    aimReturnAt('trilha', 'css-layout');
    expect(saved('trilha')).toMatchObject({ anchor: 'css-layout' });
  });

  it('posição de mais de meia hora não conta como volta', () => {
    rememberOnDetailLink('trilha', ['/competencias/'])(clickOn('/competencias/debugging'));
    vi.setSystemTime(new Date('2026-10-17T12:31:00Z'));
    aimReturnAt('trilha', 'debugging');
    expect(saved('trilha')).toMatchObject({ anchor: 'debugging' });
  });

  it('o menu de cima esquece as voltas e não mexe no resto da sessão', () => {
    sessionStorage.setItem('outra-coisa', '1');
    rememberOnDetailLink('trilha', ['/competencias/'])(clickOn('/competencias/debugging'));
    aimReturnAt('minha-area', 'x');
    forgetReturns();
    expect(saved('trilha')).toBeNull();
    expect(saved('minha-area')).toBeNull();
    expect(sessionStorage.getItem('outra-coisa')).toBe('1');
  });
});
