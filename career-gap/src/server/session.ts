import { headers } from 'next/headers';
import { getDb } from '@/db/client';
import { getAuth } from '@/lib/auth';

/**
 * O banco e a pessoa da sessão, ou `undefined` sem banco ou sem sessão. O `userId` sai SEMPRE
 * da sessão, nunca do navegador: é o que impede uma pessoa de gravar em nome de outra.
 */
export async function currentUser() {
  const db = getDb();
  const auth = getAuth();
  if (!db || !auth) return undefined;
  const session = await auth.api.getSession({ headers: await headers() });
  return session ? { db, userId: session.user.id } : undefined;
}
