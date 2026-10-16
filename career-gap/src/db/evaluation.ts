import { asc, eq } from 'drizzle-orm';
import type { EvaluationAnswers } from '@/lib/evaluation';
import type { Db } from './client';
import { evaluationResponse } from './schema';

/**
 * Leitura e gravação do questionário. Recebe o `userId` já autenticado e a resposta já
 * validada (`lib/evaluation.ts`).
 */

/** O que a pessoa via quando respondeu, calculado no servidor a partir do estado dela. */
export interface EvaluationContext {
  readonly hasProfile: boolean;
  readonly levels: Readonly<Record<string, string>>;
  readonly emphasisId?: string;
  readonly hereId?: string;
  readonly recommended: readonly string[];
  readonly counts?: { readonly met: number; readonly open: number; readonly notNow: number };
  readonly built: number;
  readonly completedResources: number;
}

export interface StoredEvaluation extends Omit<EvaluationAnswers, 'consent'> {
  readonly instrumentVersion: string;
  readonly catalogVersion: string;
  readonly consentAt: string;
  readonly submittedAt: string;
  readonly context: EvaluationContext;
}

const toStored = (row: typeof evaluationResponse.$inferSelect): StoredEvaluation => ({
  instrumentVersion: row.instrumentVersion,
  catalogVersion: row.catalogVersion,
  consentAt: row.consentAt.toISOString(),
  submittedAt: row.submittedAt.toISOString(),
  participant: row.participant,
  answers: row.answers,
  comments: row.comments,
  context: row.context as unknown as EvaluationContext,
});

export async function saveEvaluation(db: Db, userId: string, evaluation: StoredEvaluation): Promise<void> {
  const values = {
    instrumentVersion: evaluation.instrumentVersion,
    catalogVersion: evaluation.catalogVersion,
    consentAt: new Date(evaluation.consentAt),
    submittedAt: new Date(evaluation.submittedAt),
    participant: { ...evaluation.participant },
    answers: { ...evaluation.answers },
    comments: { ...evaluation.comments },
    context: evaluation.context as unknown as Record<string, unknown>,
  };
  await db
    .insert(evaluationResponse)
    .values({ userId, ...values })
    .onConflictDoUpdate({ target: evaluationResponse.userId, set: values });
}

export async function loadEvaluation(db: Db, userId: string): Promise<StoredEvaluation | undefined> {
  const [row] = await db.select().from(evaluationResponse).where(eq(evaluationResponse.userId, userId));
  return row && toStored(row);
}

/** Todas as respostas, na ordem de envio. Para a exportação (`scripts/respostas.ts`). */
export async function listEvaluations(db: Db): Promise<readonly StoredEvaluation[]> {
  const rows = await db.select().from(evaluationResponse).orderBy(asc(evaluationResponse.submittedAt));
  return rows.map(toStored);
}
