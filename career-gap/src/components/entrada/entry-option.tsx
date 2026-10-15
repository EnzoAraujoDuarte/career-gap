import type { ReactNode } from 'react';

export interface EntrySpec {
  readonly id: string;
  readonly title: string;
  readonly thesis: string;
  readonly tapsToValue: string;
  readonly pro: string;
  readonly con: string;
  readonly cost: string;
}

interface CanDo {
  readonly name: string;
  readonly canDo: string;
}

export function EntryOption({ spec, cans }: { spec: EntrySpec; cans: readonly CanDo[] }) {
  return (
    <section className="w-[330px] shrink-0">
      <h2 className="text-ink text-[16px] font-medium">{spec.title}</h2>
      <p className="text-ink-soft mt-1 min-h-[76px] text-[12.5px] leading-snug">{spec.thesis}</p>

      <p className="border-rule mt-2 border-y py-1.5 text-[12px]">
        <span className="text-ink-faint">até ver valor: </span>
        <strong className="text-ink font-medium">{spec.tapsToValue}</strong>
      </p>

      <Phone>{SCREENS[spec.id](cans)}</Phone>

      <dl className="mt-3 space-y-1 text-[12px] leading-snug">
        <Line label="+" tone="text-done" value={spec.pro} />
        <Line label="−" tone="text-critical" value={spec.con} />
        <Line label="custo" tone="text-ink-faint" value={spec.cost} />
      </dl>
    </section>
  );
}

function Line({ label, tone, value }: { label: string; tone: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className={`${tone} shrink-0`}>{label}</dt>
      <dd className="text-ink-soft">{value}</dd>
    </div>
  );
}

/** Moldura de celular, para comparar no formato em que o público vai usar. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="border-rule mt-3 h-[520px] overflow-hidden rounded-[18px] border-[6px] bg-[#fdfbf7]">
      <div className="h-full overflow-hidden px-4 py-5">{children}</div>
    </div>
  );
}

const SCREENS: Record<string, (cans: readonly CanDo[]) => ReactNode> = {
  apresentacao: () => (
    <div className="flex h-full flex-col justify-center">
      <p className="hand text-ink text-[30px] leading-none">Career Gap</p>
      <p className="text-ink mt-4 text-[15px] leading-snug">
        Diga onde você está e onde quer chegar.
        <br />
        Mostramos o que falta — e por onde começar.
      </p>
      <p className="text-ink-soft mt-3 text-[12px] leading-relaxed">
        Um roadmap comum lista tudo o que existe. Este parte do que você já sabe.
      </p>
      <span className="bg-ink text-paper mt-5 self-start rounded-sm px-4 py-2 text-[13px]">
        Montar meu caminho
      </span>
      <p className="text-ink-faint mt-2 text-[11.5px]">Leva 4 minutos. Sem cadastro.</p>
      <div className="border-rule mt-8 flex gap-5 border-t pt-4">
        <Stat value="25" label="competências" />
        <Stat value="125" label="recursos" />
      </div>
    </div>
  ),

  'mapa-aberto': () => (
    <div className="flex h-full flex-col">
      <p className="font-serif text-[9.5px] uppercase tracking-[0.2em] text-[#8a7f6d]">
        Primeira vaga em desenvolvimento web
      </p>
      <ol className="mt-4 flex-1 space-y-3.5">
        {['Fundamentos de programação', 'HTML semântico', 'Layout com CSS', 'JavaScript essencial', 'Fundamentos de HTTP', 'Controle de versão com Git'].map(
          (name) => (
            <li key={name} className="relative pl-5">
              <span className="absolute left-0 top-[5px] h-2.5 w-2.5 rounded-full border-2 border-[#c9bda6]" />
              <p className="text-ink text-[13px] leading-snug">{name}</p>
              <p className="text-ink-faint text-[11px]">3 recursos</p>
            </li>
          ),
        )}
      </ol>
      <div className="border-now -mx-4 -mb-5 border-t-2 bg-[#eaf0f8] px-4 py-3">
        <p className="text-ink text-[12.5px] leading-snug">
          Diga o que você já sabe e eu escondo o que não serve para você.
        </p>
        <span className="bg-ink text-paper mt-2 inline-block rounded-sm px-3 py-1.5 text-[12px]">
          Personalizar
        </span>
      </div>
    </div>
  ),

  'uma-pergunta': (cans) => (
    <div className="flex h-full flex-col">
      <div className="bg-rule h-1 overflow-hidden rounded-full">
        <div className="bg-done h-full w-[8%]" />
      </div>
      <p className="text-ink-faint mt-2 text-[11.5px]">1 de 15</p>

      <p className="hand text-ink mt-6 text-[17px] leading-tight">{cans[0]?.name}</p>
      <p className="text-ink-soft mt-2 text-[13px] leading-snug">Você consegue fazer isto hoje?</p>

      <div className="mt-4 space-y-2">
        <Choice muted>Ainda não</Choice>
        <Choice>{cans[0]?.canDo}</Choice>
      </div>

      <div className="border-rule mt-auto border-t pt-3">
        <p className="text-ink-faint text-[11.5px]">seu mapa até agora</p>
        <div className="mt-1.5 flex gap-1">
          {Array.from({ length: 15 }).map((_, index) => (
            <span
              key={index}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: index === 0 ? '#4a7c59' : '#ded7c9' }}
            />
          ))}
        </div>
      </div>
    </div>
  ),

  entrega: () => (
    <div className="flex h-full flex-col">
      <p className="font-serif text-ink mt-3 text-[21px] leading-tight">
        O que você quer conseguir fazer?
      </p>
      <p className="text-ink-soft mt-2 text-[12.5px] leading-snug">
        Escolha uma. Dá para mudar depois.
      </p>
      <div className="mt-4 space-y-2">
        {[
          ['Publicar meu primeiro site', 'HTML, CSS e um endereço no ar'],
          ['Consumir uma API', 'buscar dados e mostrar na tela'],
          ['Conseguir um estágio', 'o caminho completo até se candidatar'],
          ['Ainda não sei', 'me mostre o caminho inteiro'],
        ].map(([title, hint]) => (
          <div key={title} className="border-rule rounded-sm border p-2.5">
            <p className="text-ink text-[13px] leading-tight">{title}</p>
            <p className="text-ink-faint mt-0.5 text-[11.5px]">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  mentor: () => (
    <div className="flex h-full flex-col">
      <p className="hand text-ink mt-4 text-[19px] leading-tight">
        Me conta o que você já fez.
      </p>
      <p className="text-ink-soft mt-2 text-[12.5px] leading-relaxed">
        Pode escrever do seu jeito. Curso que fez, projeto que montou, linguagem que mexeu —
        qualquer coisa serve.
      </p>
      <div className="border-rule mt-4 rounded-sm border bg-white/60 p-3">
        <p className="text-ink-soft text-[12.5px] leading-relaxed">
          fiz o curso do guanabara de html e css, montei uma pagina pro meu tcc e to tentando
          aprender javascript agora
        </p>
      </div>
      <p className="text-ink-faint mt-3 text-[11.5px] leading-snug">
        Depois eu mostro o que entendi e você corrige o que estiver errado.
      </p>
      <span className="bg-ink text-paper mt-4 self-start rounded-sm px-4 py-2 text-[13px]">
        Continuar
      </span>
    </div>
  ),
};

function Choice({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <div className="border-rule flex items-start gap-2 rounded-sm border px-2.5 py-2">
      <span className="border-ink-faint mt-[3px] h-3 w-3 shrink-0 rounded-full border" />
      <span className={`text-[12.5px] leading-snug ${muted ? 'text-ink-faint' : 'text-ink'}`}>
        {children}
      </span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="hand text-ink text-[19px] leading-none">{value}</p>
      <p className="text-ink-faint mt-0.5 text-[11px]">{label}</p>
    </div>
  );
}
