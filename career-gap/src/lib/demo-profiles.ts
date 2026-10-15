import type { UserCompetency, UserProfile } from '@/domain/model';

/**
 * Perfis-fixture.
 *
 * São o instrumento de validação do motor antes de existir qualquer interface: se o
 * roadmap não faz sentido aqui, nenhuma tela conserta (DISCOVERY.md §9, passo 2).
 * Cada perfil representa um caso realista do público-alvo.
 */

const state = (
  competency: string,
  level: UserCompetency['level'],
  evidence: UserCompetency['evidence'] = 'self-report',
): UserCompetency => ({ competency, level, evidence });

/** Nunca programou. Tudo é L0 por ausência de evidência. */
export const absoluteBeginner: UserProfile = {
  id: 'fixture-absolute-beginner',
  trackId: 'first-web-role',
  competencies: [],
};

/** Aprendeu sozinho pela interface: faz telas, mas não versiona nem testa. */
export const selfTaughtFrontend: UserProfile = {
  id: 'fixture-self-taught-frontend',
  trackId: 'first-web-role',
  emphasisId: 'frontend',
  competencies: [
    state('programming-fundamentals', 'L2'),
    state('html-semantics', 'L2'),
    state('css-layout', 'L2'),
    state('javascript-essentials', 'L2'),
    state('dom-and-browser', 'L2'),
    state('problem-decomposition', 'L1'),
    state('reading-documentation', 'L1'),
    state('version-control-git', 'L1'),
    state('command-line-basics', 'L1'),
  ],
};

/** Estudante de CS: base forte, plataforma web fraca. O inverso do anterior. */
export const csStudent: UserProfile = {
  id: 'fixture-cs-student',
  trackId: 'first-web-role',
  emphasisId: 'backend',
  competencies: [
    state('programming-fundamentals', 'L2', 'probe'),
    state('problem-decomposition', 'L2', 'probe'),
    state('algorithms-and-complexity', 'L1', 'probe'),
    state('relational-data-modeling', 'L1'),
    state('sql-basics', 'L1'),
    state('command-line-basics', 'L1'),
    state('debugging', 'L1'),
  ],
};

/** Saiu de bootcamp: cobertura ampla e rasa, quase toda autodeclarada. */
export const bootcampGraduate: UserProfile = {
  id: 'fixture-bootcamp-graduate',
  trackId: 'first-web-role',
  competencies: [
    state('programming-fundamentals', 'L2'),
    state('problem-decomposition', 'L1'),
    state('html-semantics', 'L2'),
    state('css-layout', 'L1'),
    state('javascript-essentials', 'L2'),
    state('dom-and-browser', 'L1'),
    state('http-fundamentals', 'L1'),
    state('version-control-git', 'L1'),
    state('command-line-basics', 'L1'),
    state('api-consumption', 'L1'),
    state('build-an-application', 'L1'),
    state('reading-documentation', 'L1'),
    state('code-readability', 'L1'),
    state('debugging', 'L1'),
  ],
};

/** Quase pronto: falta qualidade, publicação e comunicação. */
export const almostReady: UserProfile = {
  id: 'fixture-almost-ready',
  trackId: 'first-web-role',
  competencies: [
    state('programming-fundamentals', 'L2', 'probe'),
    state('problem-decomposition', 'L2', 'probe'),
    state('algorithms-and-complexity', 'L1', 'probe'),
    state('html-semantics', 'L2'),
    state('css-layout', 'L2'),
    state('javascript-essentials', 'L2', 'probe'),
    state('dom-and-browser', 'L2'),
    state('http-fundamentals', 'L2', 'probe'),
    state('web-accessibility-basics', 'L1'),
    state('command-line-basics', 'L1'),
    state('version-control-git', 'L2', 'artifact'),
    state('reading-documentation', 'L2'),
    state('code-readability', 'L1'),
    state('debugging', 'L2'),
    state('build-an-application', 'L2', 'artifact'),
    state('relational-data-modeling', 'L1'),
    state('sql-basics', 'L1'),
    state('api-consumption', 'L2'),
    state('api-development', 'L1'),
  ],
};

/** Autoavaliação inflada: declara o máximo em tudo, sem nenhuma verificação.
 *  Serve para checar que o sistema pede verificação em vez de rebaixar em silêncio. */
export const inflatedSelfReport: UserProfile = {
  id: 'fixture-inflated-self-report',
  trackId: 'first-web-role',
  competencies: [
    state('programming-fundamentals', 'L2'),
    state('javascript-essentials', 'L2'),
    state('html-semantics', 'L2'),
    state('http-fundamentals', 'L2'),
    state('version-control-git', 'L2'),
    state('debugging', 'L2'),
    state('command-line-basics', 'L1'),
    state('build-an-application', 'L2'),
  ],
};

export const DEMO_PROFILES: readonly UserProfile[] = [
  absoluteBeginner,
  selfTaughtFrontend,
  csStudent,
  bootcampGraduate,
  almostReady,
  inflatedSelfReport,
];

/** Alias histórico usado pelos testes e pelo script de inspeção. */
export const ALL_FIXTURES = DEMO_PROFILES;
