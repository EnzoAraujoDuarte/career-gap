'use client';

import { createContext, use, useEffect, useState } from 'react';
import type { SocialProvider } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { syncNow } from '@/lib/remote-sync';

/**
 * `off`: sem banco — tudo no navegador, como sempre foi.
 * `connecting` → `on`: banco ligado, sessão criada (anônima, se preciso) e estado sincronizado.
 * `error`: o banco está configurado mas não respondeu; o produto segue no navegador.
 */
export type PersistenceStatus = 'off' | 'connecting' | 'on' | 'error';

interface Persistence {
  readonly status: PersistenceStatus;
  readonly providers: readonly SocialProvider[];
}

const PersistenceContext = createContext<Persistence>({ status: 'off', providers: [] });

export const usePersistence = (): Persistence => use(PersistenceContext);

export function PersistenceProvider({
  enabled,
  providers,
  children,
}: {
  enabled: boolean;
  providers: readonly SocialProvider[];
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<PersistenceStatus>(enabled ? 'connecting' : 'off');

  // Sincronizar com um sistema externo é exatamente o caso de uso de efeito.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    connect()
      .then(() => !cancelled && setStatus('on'))
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return <PersistenceContext value={{ status, providers }}>{children}</PersistenceContext>;
}

/** Sem sessão, cria uma anônima: a pessoa não precisa de cadastro para ter o progresso salvo. */
async function connect(): Promise<void> {
  const session = await authClient.getSession();
  if (!session.data) {
    const anonymous = await authClient.signIn.anonymous();
    if (anonymous.error) throw new Error(anonymous.error.message);
  }
  if (!(await syncNow())) throw new Error('sessão não reconhecida pelo servidor');
}
