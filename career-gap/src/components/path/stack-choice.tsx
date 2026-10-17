'use client';

import Link from 'next/link';
import type { CareerTrack, UserProfile } from '@/domain/model';
import { saveTechnology, useStoredDraft } from '@/lib/profile-storage';

/**
 * A escolha da linguagem do servidor, no começo do nível em que ela passa a importar.
 *
 * O caminho é independente de stack (ADR-0014): competências, ordem e lacunas não mudam. A
 * escolha só faz os materiais de cada estação preferirem a linguagem, com o motivo dito. Nada é
 * trancado: dá para trocar quando quiser, e "ainda não sei" é resposta válida.
 */
export function StackChoice({
  track,
  profile,
  demo,
  suffix,
}: {
  track: CareerTrack;
  profile: UserProfile | null;
  demo: boolean;
  suffix: string;
}) {
  const draft = useStoredDraft();
  const chosen = demo ? profile?.technologyId : draft?.technologyId;
  const canChoose = profile !== null && !demo;

  return (
    <section aria-labelledby="sua-stack" className="border-rule mt-4 border-t pt-3">
      <h3 id="sua-stack" className="hand text-now text-[16px]">
        daqui em diante, a linguagem do servidor é escolha sua
      </h3>
      <p className="text-ink mt-1.5 text-[13.5px] leading-relaxed">
        O caminho é <strong className="font-medium">independente de stack</strong>: as competências,
        a ordem e as lacunas são as mesmas em qualquer linguagem. Até aqui a stack era a própria web
        (HTML, CSS e JavaScript). Daqui em diante você escolhe a do servidor, e os materiais de cada
        estação passam a preferir a sua escolha, dizendo por quê. A lógica é a base; a linguagem é
        ferramenta, e quem aprende uma aprende a outra.
      </p>

      {canChoose ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {track.stacks.map((stack) => {
            const selected = chosen === stack.technology;
            return (
              <button
                key={stack.technology}
                type="button"
                onClick={() => saveTechnology(selected ? undefined : stack.technology)}
                aria-pressed={selected}
                className={`focus-visible:outline-attention min-w-0 flex-1 rounded-sm border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 sm:max-w-[32ch] ${
                  selected ? 'border-now bg-tint-now' : 'border-rule hover:border-ink-faint'
                }`}
              >
                <span className="text-ink block text-[14px] font-medium">
                  {stack.name}
                  {selected && <span className="hand text-now ml-2 text-[13px]">✓ sua escolha</span>}
                </span>
                <span className="text-ink-soft mt-0.5 block text-[12.5px] leading-snug">{stack.why}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => saveTechnology(undefined)}
            aria-pressed={!chosen}
            className={`focus-visible:outline-attention rounded-sm border px-3 py-2.5 text-left text-[13.5px] focus-visible:outline-2 sm:max-w-[22ch] ${
              !chosen ? 'border-now bg-tint-now text-ink' : 'border-rule text-ink-soft hover:border-ink-faint'
            }`}
          >
            Ainda não sei
            <span className="text-ink-soft mt-0.5 block text-[12.5px] leading-snug">
              Os materiais seguem na ordem de sempre.
            </span>
          </button>
        </div>
      ) : (
        <p className="text-ink-soft mt-2 text-[13px] leading-relaxed">
          {demo ? (
            <>
              No perfil de exemplo a escolha não é guardada
              {profile?.technologyId && (
                <>
                  ; este perfil segue{' '}
                  {track.stacks.find((stack) => stack.technology === profile.technologyId)?.name ?? profile.technologyId}
                </>
              )}
              .
            </>
          ) : (
            <>
              <Link href={`/avaliacao${suffix}`} className="text-now underline underline-offset-2">
                Responda as 6 perguntas
              </Link>{' '}
              e a escolha fica guardada com o seu perfil. As opções: {track.stacks.map((stack) => stack.name).join(' ou ')}.
            </>
          )}
        </p>
      )}
    </section>
  );
}
