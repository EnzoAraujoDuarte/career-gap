'use client';

import { createContext, use, useEffect, useState } from 'react';
import type { SocialProvider } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { onFirstWrite } from '@/lib/remote-push';
import { hasLocalState, syncNow } from '@/lib/remote-sync';

/**
 * `off`: sem banco — tudo no navegador, como sempre foi.
 * `idle`: banco ligado, mas esta visita ainda não guardou nada; a sessão nasce na primeira gravação.
 * `connecting` → `on`: sessão criada (anônima, se preciso) e estado sincronizado.
 * `error`: o banco está configurado mas não respondeu; o produto segue no navegador.
 */
export type PersistenceStatus = 'off' | 'idle' | 'connecting' | 'on' | 'error';

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
    const connectNow = () => {
      if (!cancelled) setStatus('connecting');
      connectOnce()
        .then(() => !cancelled && setStatus('on'))
        .catch(() => !cancelled && setStatus('error'));
    };
    shouldConnectNow()
      .then((now) => {
        if (cancelled) return;
        if (now) connectNow();
        else {
          setStatus('idle');
          onFirstWrite(connectNow);
        }
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return <PersistenceContext value={{ status, providers }}>{children}</PersistenceContext>;
}

/**
 * Conectar já só quando há sessão ou algo a guardar. Visita que só olha — inclusive robôs, que
 * criaram 16 usuários anônimos no primeiro dia no ar — não vira linha no banco.
 */
async function shouldConnectNow(): Promise<boolean> {
  if (hasLocalState()) return true;
  const session = await authClient.getSession();
  return Boolean(session.data);
}

/**
 * Uma conexão por página. Em desenvolvimento o React roda o efeito duas vezes; sem isso, as duas
 * execuções criavam dois usuários anônimos e gravavam o perfil duas vezes (visto no Neon).
 */
let connection: Promise<void> | undefined;

function connectOnce(): Promise<void> {
  connection ??= connect().catch((error: unknown) => {
    connection = undefined;
    throw error;
  });
  return connection;
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
