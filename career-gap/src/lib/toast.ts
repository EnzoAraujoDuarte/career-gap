'use client';

import { useSyncExternalStore } from 'react';

/**
 * Um aviso por vez, no rodapé, com uma ação opcional ("Desfazer"). Concluir uma estação muda a
 * trilha inteira de lugar; o aviso diz o que aconteceu e deixa voltar atrás com um toque, em vez
 * de pedir confirmação antes.
 */
export interface Toast {
  readonly id: number;
  readonly text: string;
  readonly action?: { readonly label: string; readonly run: () => void };
}

const VISIBLE_MS = 6000;
let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function showToast(toast: Omit<Toast, 'id'>): void {
  current = { ...toast, id: Date.now() };
  clearTimeout(timer);
  timer = setTimeout(dismissToast, VISIBLE_MS);
  emit();
}

export function dismissToast(): void {
  clearTimeout(timer);
  current = null;
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useToast = (): Toast | null => useSyncExternalStore(subscribe, () => current, () => null);
