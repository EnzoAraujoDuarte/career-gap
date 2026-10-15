import { boolean, index, jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Esquema do Postgres (docs/PLANO-FASE4.md §5).
 *
 * O CATÁLOGO NÃO ESTÁ AQUI. Ele é código, validado por teste e versionado (`CATALOG_VERSION`);
 * o banco guarda só o estado de cada pessoa, referenciando ids do catálogo como texto. Por isso
 * não há chave estrangeira para competência ou recurso — a validação acontece na entrada
 * (`lib/user-state.ts`), e cada gravação de perfil registra a versão do catálogo que valia.
 */

/** Instante absoluto. As comparações de "mais recente" da sincronização dependem disso. */
const instant = (name: string) => timestamp(name, { withTimezone: true });

const createdAt = () => timestamp('created_at').defaultNow().notNull();
const updatedAt = () =>
  timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull();

// ---------------------------------------------------------------------------
// Tabelas do Better Auth, no formato padrão dele, mais `is_anonymous` do plugin anônimo.
// ---------------------------------------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  isAnonymous: boolean('is_anonymous'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index('session_user_id_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index('account_user_id_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

// ---------------------------------------------------------------------------
// Estado de cada pessoa no Career Gap. Apagar o usuário apaga tudo em cascata (LGPD).
// ---------------------------------------------------------------------------

/** Perfil e metas. Os dois `*_updated_at` decidem quem ganha na sincronização. */
export const learner = pgTable('learner', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  trackId: text('track_id'),
  emphasisId: text('emphasis_id'),
  catalogVersion: text('catalog_version'),
  profileUpdatedAt: instant('profile_updated_at'),
  purpose: text('purpose'),
  careerGoal: text('career_goal'),
  targetMonth: text('target_month'),
  goalsUpdatedAt: instant('goals_updated_at'),
  createdAt: instant('created_at').defaultNow().notNull(),
});

/** Nível declarado por competência. `evidence` diz de onde veio — hoje, sempre autoavaliação. */
export const competencyLevel = pgTable(
  'competency_level',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    competencyId: text('competency_id').notNull(),
    level: text('level').notNull(),
    evidence: text('evidence').default('self-report').notNull(),
    updatedAt: instant('updated_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.competencyId] })],
);

/** Minha lista, continuar e concluídos — o "Watchlist / Jump Back In / Completed" do Laracasts. */
export const resourceProgress = pgTable(
  'resource_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    resourceId: text('resource_id').notNull(),
    savedAt: instant('saved_at'),
    startedAt: instant('started_at'),
    completedAt: instant('completed_at'),
    updatedAt: instant('updated_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.resourceId] })],
);

/** Critérios de saída marcados — o "você terminou quando" de cada competência, por nível. */
export const criteriaCheck = pgTable(
  'criteria_check',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    competencyId: text('competency_id').notNull(),
    level: text('level').notNull(),
    checked: jsonb('checked').$type<number[]>().notNull(),
    updatedAt: instant('updated_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.competencyId, table.level] })],
);

/**
 * Entrada e saída do motor a cada mudança de perfil. É a trilha de auditoria do TCC: permite
 * explicar por que algo foi recomendado a alguém, com a versão do catálogo daquele dia.
 */
export const roadmapSnapshot = pgTable(
  'roadmap_snapshot',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    catalogVersion: text('catalog_version').notNull(),
    input: jsonb('input').notNull(),
    output: jsonb('output').notNull(),
    createdAt: instant('created_at').defaultNow().notNull(),
  },
  (table) => [index('roadmap_snapshot_user_id_idx').on(table.userId)],
);
