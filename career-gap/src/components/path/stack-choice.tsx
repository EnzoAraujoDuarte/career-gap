import type { CareerTrack } from '@/domain/model';

/**
 * A nota sobre a linguagem do servidor, no começo do nível em que ela passa a importar.
 *
 * O caminho é independente de stack (ADR-0014): competências, ordem e lacunas não mudam. Já
 * houve aqui um seletor com as linguagens que têm material no catálogo; saiu porque dois cartões
 * lado a lado liam como "estas são as duas linguagens aceitas", o contrário do que o texto diz.
 * A preferência antiga continua guardada no perfil, mas o site não a usa enquanto não houver onde
 * vê-la e trocá-la (ADR-0014, nota de 2026-10-17). Quando o catálogo cobrir mais linguagens, a
 * escolha pode voltar num lugar neutro, com resposta livre.
 */
export function StackChoice({ track }: { track: CareerTrack }) {
  const withMaterial = track.stacks.map((stack) => stack.name);
  return (
    <section aria-labelledby="sua-stack" className="border-rule mt-4 border-t pt-3">
      <h3 id="sua-stack" className="hand text-now text-[16px]">
        daqui em diante, a linguagem do servidor é escolha sua
      </h3>
      <p className="text-ink mt-1.5 text-[13.5px] leading-relaxed">
        O caminho é <strong className="font-medium">independente de stack</strong>: as competências,
        a ordem e as lacunas são as mesmas em qualquer linguagem. Até aqui a stack era a própria web
        (HTML, CSS e JavaScript). Daqui em diante você escolhe a do servidor: a que o mercado da sua
        cidade pede, ou a que você já tocou. A lógica é a base; a linguagem é ferramenta, e quem
        aprende uma aprende a outra.
      </p>
      <p className="text-ink-soft mt-2 text-[13px] leading-relaxed">
        {withMaterial.length > 0 && (
          <>
            Os materiais verificados daqui estão em {withMaterial.join(' e ')}.{' '}
          </>
        )}
        Go, Ruby, Rust, C#, PHP e Python servem igual: as estações são as mesmas, e você troca o
        material pelo da sua linguagem.
      </p>
    </section>
  );
}
