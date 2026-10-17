import type { Criticality, Level, ReasonCode, PtBrStatus, ResourceCost } from '@/domain/model';
import type { ResourcePickReason } from '@/domain/resources';

/**
 * Tradução de código estruturado para texto.
 *
 * O domínio emite códigos; a interface escolhe as palavras. Nunca o contrário — é isso
 * que permite explicar uma recomendação sem depender de prosa gerada (ADR-0004).
 */
export const REASON_TEXT: Record<ReasonCode, string> = {
  CORE_GAP_FOR_TARGET: 'É essencial para o objetivo que você escolheu.',
  SUPPORTS_TARGET: 'Apoia o objetivo, sem ser condição para ele.',
  UNLOCKS_OTHER_COMPETENCIES: 'Destrava outras etapas do seu mapa.',
  LARGE_GAP: 'A distância até o nível esperado é grande: não se resolve numa tarde.',
  BLOCKED_BY_PREREQUISITE: 'Depende de algo que ainda não está de pé.',
  NEEDS_VERIFICATION: 'Você declarou isso, mas ainda não verificamos.',
  PREMATURE_SPECIALIZATION: 'Especialização cedo demais para o seu momento.',
  LOW_IMPACT_FOR_TARGET: 'Impacto pequeno para o objetivo atual.',
  OUT_OF_TRACK_SCOPE: 'Não faz parte do que este objetivo exige.',
  TARGET_ALREADY_MET: 'Você já está no nível esperado.',
};

/** Ordem de informatividade: a razão mais específica primeiro. "É essencial" repetido
 *  em todo item não informa nada; "destrava outras etapas" ou "está travado" sim. */
const REASON_PRIORITY: readonly ReasonCode[] = [
  'BLOCKED_BY_PREREQUISITE',
  'NEEDS_VERIFICATION',
  'UNLOCKS_OTHER_COMPETENCIES',
  'LARGE_GAP',
  'CORE_GAP_FOR_TARGET',
  'SUPPORTS_TARGET',
];

export function primaryReason(codes: readonly ReasonCode[]): ReasonCode | undefined {
  return REASON_PRIORITY.find((code) => codes.includes(code)) ?? codes[0];
}

export const CRITICALITY_TEXT: Record<Criticality, string> = {
  core: 'essencial',
  supporting: 'apoio',
  optional: 'opcional',
};

export const LEVEL_SHORT: Record<Level, string> = {
  L0: 'não sei ainda',
  L1: 'com apoio',
  L2: 'sozinho',
  L3: 'no sistema',
  L4: 'na organização',
};

/** O mesmo nível em frase, para o motivo de uma recomendação: "Hoje você ainda não faz isso;
 *  a vaga pede que faça sozinho." A seta com rótulo ("Hoje: não sei ainda → a vaga pede:
 *  sozinho") era fiel ao motor, mas soava como saída de máquina. */
export const LEVEL_NOW: Record<Level, string> = {
  L0: 'ainda não faz isso',
  L1: 'faz com apoio',
  L2: 'já faz sozinho',
  L3: 'atua no nível do sistema',
  L4: 'atua no nível da organização',
};
export const LEVEL_ASKED: Record<Level, string> = {
  L0: 'conheça o básico',
  L1: 'faça com apoio',
  L2: 'faça sozinho',
  L3: 'atue no nível do sistema',
  L4: 'atue no nível da organização',
};

/** Por que ESTE recurso e não outro. Código estruturado, nunca prosa (ADR-0004). */
export const PICK_REASON_TEXT: Record<ResourcePickReason, string> = {
  PT_BR: 'em português',
  PT_BR_PARTIAL: 'parcialmente em português',
  FREE: 'gratuito',
  NO_SIGNUP: 'sem cadastro',
  STARTING_POINT: 'o ponto de partida mais acessível',
  ONLY_OPTION: 'único material verificado para este passo',
  YOUR_STACK: 'na linguagem que você escolheu',
};

export const PT_BR_LABEL: Record<PtBrStatus, string> = {
  complete: 'pt-BR',
  partial: 'pt-BR parcial',
  none: 'inglês',
};

export const COST_LABEL: Record<ResourceCost, string> = {
  free: 'grátis',
  'free-content-paid-certificate': 'grátis, certificado pago',
  paid: 'pago',
};

/** Mostrada quando o passo só tem material em inglês. A barreira de idioma é real, e
 *  esconder isso seria pior do que avisar. */
export const ENGLISH_ONLY_NOTE =
  'Não há material equivalente em português para este passo.';
