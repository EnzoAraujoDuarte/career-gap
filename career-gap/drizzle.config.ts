import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

// O Next lê `.env.local` sozinho; o drizzle-kit não.
if (existsSync('.env.local')) process.loadEnvFile('.env.local');

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  // Migração pela conexão direta: o Neon recomenda não passar DDL pelo pooler.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '' },
});
