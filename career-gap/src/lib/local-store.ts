'use client';

import { useMemo, useSyncExternalStore } from 'react';

/**
 * Valor JSON guardado no navegador.
 *
 * O motor é TypeScript puro e roda no cliente sem adaptação — é o que permite o produto
 * inteiro funcionar antes do banco existir. Quando o Postgres entrar, só a origem dos dados
 * muda; nada do domínio precisa ser tocado.
 */
export interface LocalStore<T> {
  save(value: T): void;
  load(): T | undefined;
  clear(): void;
  /** `undefined` enquanto renderiza no servidor; `null` quando nada foi salvo. */
  useValue(): T | null | undefined;
}

export function createLocalStore<T>(key: string): LocalStore<T> {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    // Outra aba alterando o mesmo valor também precisa refletir aqui.
    window.addEventListener('storage', listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', listener);
    };
  };

  /** A snapshot precisa ser estável: devolver objeto novo a cada chamada faria o React entrar
   *  em laço infinito. Por isso a snapshot é a string crua, e o parse fica no memo. */
  const readRaw = (): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  return {
    save(value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        notify();
      } catch {
        // Navegação privada ou armazenamento bloqueado: o fluxo continua na memória da sessão.
      }
    },
    load() {
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : undefined;
      } catch {
        return undefined;
      }
    },
    clear() {
      try {
        window.localStorage.removeItem(key);
        notify();
      } catch {
        /* idem */
      }
    },
    /**
     * Lê sem `useEffect`. `localStorage` é estado externo ao React, e ler em efeito produz
     * render em cascata e um flash de conteúdo vazio. `useSyncExternalStore` existe para este
     * caso e ainda resolve o SSR: no servidor não há navegador, então a snapshot é indefinida.
     */
    useValue() {
      const raw = useSyncExternalStore(
        subscribe,
        readRaw,
        () => undefined as unknown as string | null,
      );
      return useMemo(() => {
        if (raw === undefined) return undefined;
        if (raw === null) return null;
        try {
          return JSON.parse(raw) as T;
        } catch {
          return null;
        }
      }, [raw]);
    },
  };
}
