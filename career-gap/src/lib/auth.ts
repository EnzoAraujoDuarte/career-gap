import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { anonymous } from 'better-auth/plugins';
import { getDb, type Db } from '@/db/client';
import * as schema from '@/db/schema';
import { moveUserData } from '@/db/user-state';

/**
 * Login. A pessoa começa ANÔNIMA — a entrada continua sem cadastro — e pode entrar com Google
 * ou GitHub quando quiser levar o progresso para outro aparelho. Ao entrar, o que ela fez
 * anônima vai junto (`moveUserData`).
 *
 * Só Google e GitHub, e só os que têm credencial no ambiente: GitHub sozinho excluiria o
 * iniciante absoluto, que ainda não tem conta.
 */

export const SOCIAL_PROVIDERS = ['google', 'github'] as const;
export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

type Env = Readonly<Record<string, string | undefined>>;

const credentialsOf = (provider: SocialProvider, env: Env) => {
  const prefix = provider.toUpperCase();
  const clientId = env[`${prefix}_CLIENT_ID`];
  const clientSecret = env[`${prefix}_CLIENT_SECRET`];
  return clientId && clientSecret ? { clientId, clientSecret } : undefined;
};

/** Nomes dos provedores configurados — é tudo o que o navegador precisa saber. */
export const configuredProviders = (env: Env = process.env): SocialProvider[] =>
  SOCIAL_PROVIDERS.filter((provider) => credentialsOf(provider, env));

export function buildAuth(db: Db, env: Env = process.env) {
  return betterAuth({
    database: drizzleAdapter(db, { provider: 'pg', schema }),
    socialProviders: Object.fromEntries(
      configuredProviders(env).map((provider) => [provider, credentialsOf(provider, env)!]),
    ),
    plugins: [
      anonymous({
        onLinkAccount: ({ anonymousUser, newUser }) =>
          moveUserData(db, anonymousUser.user.id, newUser.user.id),
      }),
      // Precisa ser o último: grava os cookies de sessão a partir de server actions.
      nextCookies(),
    ],
  });
}

export type Auth = ReturnType<typeof buildAuth>;

const globalForAuth = globalThis as { careerGapAuth?: Auth };

/** `undefined` enquanto não há banco: sem banco não há sessão, e tudo fica no navegador. */
export function getAuth(): Auth | undefined {
  const db = getDb();
  if (!db) return undefined;
  globalForAuth.careerGapAuth ??= buildAuth(db);
  return globalForAuth.careerGapAuth;
}
