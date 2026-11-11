import { existsSync } from 'node:fs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { Db } from '@/db/client';
import { listEvaluations } from '@/db/evaluation';
import * as schema from '@/db/schema';
import { CHOICE_QUESTIONS, LIKERT_ITEMS, OPEN_QUESTIONS, susScore } from '@/lib/evaluation';

/**
 * Exporta as respostas do questionário em CSV, sem o id de ninguém: cada pessoa vira P01, P02…
 * na ordem de envio. O escore SUS sai calculado.
 *
 * Uso, de dentro de career-gap/:  pnpm db:respostas > respostas.csv
 * Separador ponto e vírgula e decimal com vírgula, que é o que o Excel em português abre direto.
 * O resumo (quantas respostas, SUS médio) vai para a saída de erro, fora do CSV.
 * Vale para o branch do Neon que o .env.local aponta (dev, por padrão).
 */

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL ausente no .env.local');

const pool = new Pool({ connectionString: url });
const db = drizzle({ client: pool, schema }) as unknown as Db;

const cell = (value: unknown): string => {
  const text = value === undefined || value === null ? '' : String(value);
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const decimal = (value: number | undefined) => (value === undefined ? '' : String(value).replace('.', ','));
const line = (values: readonly unknown[]) => values.map(cell).join(';');

async function main() {
  const responses = await listEvaluations(db);
  const header = [
    'participante',
    'enviado_em',
    'instrumento',
    'catalogo',
    'tem_perfil',
    'enfase',
    'voce_esta_aqui',
    'recomendados',
    'niveis',
    'ja_no_nivel',
    'em_aberto',
    'nao_agora',
    'construcoes_feitas',
    'recursos_concluidos',
    ...CHOICE_QUESTIONS.map((question) => question.id),
    'sus',
    ...LIKERT_ITEMS.map((item) => item.id),
    ...OPEN_QUESTIONS.map((question) => question.id),
  ];
  console.log(line(header));

  const scores: number[] = [];
  responses.forEach((response, index) => {
    const score = susScore(response.answers);
    if (score !== undefined) scores.push(score);
    const { context } = response;
    console.log(
      line([
        `P${String(index + 1).padStart(2, '0')}`,
        response.submittedAt,
        response.instrumentVersion,
        response.catalogVersion,
        context.hasProfile ? 'sim' : 'não',
        context.emphasisId ?? '',
        context.hereId ?? '',
        context.recommended.join('|'),
        Object.entries(context.levels)
          .map(([competency, level]) => `${competency}=${level}`)
          .join('|'),
        context.counts?.met ?? '',
        context.counts?.open ?? '',
        context.counts?.notNow ?? '',
        context.built,
        context.completedResources,
        ...CHOICE_QUESTIONS.map((question) => response.participant[question.id] ?? ''),
        decimal(score),
        ...LIKERT_ITEMS.map((item) => response.answers[item.id] ?? ''),
        ...OPEN_QUESTIONS.map((question) => response.comments[question.id] ?? ''),
      ]),
    );
  });

  const mean = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : undefined;
  console.error(
    `branch ${process.env.NEON_BRANCH ?? '?'}: ${responses.length} resposta(s)` +
      (mean === undefined ? '' : `, SUS médio ${decimal(Math.round(mean * 10) / 10)}`),
  );
}

main().finally(() => pool.end());
