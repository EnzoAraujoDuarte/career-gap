'use client';

import { pushUserState } from '@/server/user-state-actions';
import type { UserStatePatch } from './user-state';

/**
 * Envio ao Postgres de cada escrita feita no navegador.
 *
 * O navegador é sempre a primeira gravação: a tela responde na hora e o produto funciona sem
 * banco. Se a subida falhar, nada se perde — o dado mais novo continua no navegador, e a próxima
 * sincronização o envia de novo, porque o `updatedAt` dele é maior que o do banco.
 */

let enabled = false;
let onFailure: () => void = () => {};

/** Liga o envio depois que a sessão existe; `retry` é chamado quando uma subida falha. */
export function enableRemote(retry: () => void): void {
  enabled = true;
  onFailure = retry;
}

export function disableRemote(): void {
  enabled = false;
}

export function pushRemote(patch: UserStatePatch): void {
  if (!enabled) return;
  pushUserState(patch).catch(() => onFailure());
}
