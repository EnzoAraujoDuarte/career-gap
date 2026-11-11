import Link from 'next/link';

/**
 * A carta de abertura: o que mudou com as IAs, e as três coisas que contam para quem entra agora.
 * Voz do mentor, dados próprios (docs/research/vagas-ia-2026.json), sem pôster motivacional.
 * `full` é a página /carta; o resumo abre a trilha.
 */

/** Dos repositórios frontendbr/vagas e backend-br/vagas, 12 meses contra os 12 anteriores,
 *  coletados em 2026-10-15, com as ressalvas de amostra. */
const DATA = {
  entryBefore: 75,
  entryAfter: 42,
  aiSeniorBefore: '14%',
  aiSeniorAfter: '45%',
} as const;

export function OpeningNote({ suffix }: { suffix: string }) {
  return (
    <section aria-labelledby="antes-de-comecar" className="border-rule max-w-[62ch] border-l pl-4">
      <h2 id="antes-de-comecar" className="hand text-now text-[16px]">
        antes de começar, uma palavra de quem trabalha com isso
      </h2>
      {/* No celular, só o convite: o trecho com os números do mercado ocupava a primeira tela de
          quem ainda nem começou. A carta inteira está a um toque. */}
      <Link
        href={`/carta${suffix}`}
        className="text-now focus-visible:outline-attention inline-flex min-h-11 items-center text-[14px] underline underline-offset-2 focus-visible:outline-2 sm:hidden"
      >
        Ler a carta · 2 minutos
      </Link>
      <p className="text-ink mt-1.5 hidden text-[14px] leading-relaxed sm:block">
        As IAs já escrevem código bom, e as vagas de entrada encolheram (estágio e júnior: de{' '}
        {DATA.entryBefore} para {DATA.entryAfter} num ano, nos repositórios da comunidade). O que
        conta agora é ter algo para mostrar e gente que conhece você. Este site existe para isso.{' '}
        <Link href={`/carta${suffix}`} className="text-now underline underline-offset-2">
          Ler a carta inteira
        </Link>
      </p>
    </section>
  );
}

export function OpeningLetter() {
  const paragraph = 'text-ink max-w-[65ch] text-[15.5px] leading-relaxed';
  return (
    <article className="mt-7 space-y-5">
      <p className={paragraph}>
        Eu trabalho como desenvolvedor numa empresa de fora do Brasil, e vou te dizer o que diria
        a um amigo que está começando agora.
      </p>
      <p className={paragraph}>
        <strong className="font-medium">O que mudou.</strong> Os assistentes de IA escrevem código
        bom. A parte repetitiva do trabalho, abrir o editor e digitar o óbvio, está acabando. Nos
        repositórios de vagas da comunidade brasileira, as vagas de estágio e júnior caíram de{' '}
        {DATA.entryBefore} para {DATA.entryAfter} num ano, e a menção a IA nas vagas de pleno e
        sênior foi de {DATA.aiSeniorBefore} para {DATA.aiSeniorAfter}. É uma amostra pequena e
        com viés para empresas de tecnologia, mas a direção é essa: quem entra hoje precisa chegar
        mais perto do pleno, e precisa chegar com prova.
      </p>
      <p className={paragraph}>
        <strong className="font-medium">Prova é coisa que dá para abrir.</strong> Um portfólio no seu
        currículo, com link, onde quem acessa vê o que você construiu: um projeto de back-end, um de
        front-end, um com design de nível profissional, um com IA. Site para um conhecido,
        trabalho de freelancer, projeto inventado: tudo vale, desde que esteja no ar e você saiba
        explicar cada decisão. Na entrevista, a frase que muda a conversa é simples: “posso te
        mostrar um pouco do que já construí?”.
      </p>
      <p className={paragraph}>
        <strong className="font-medium">Nunca parado, nunca sozinho.</strong> Quem dá certo nesta
        área não espera a vaga para começar: está sempre construindo alguma coisa, mostra o que
        fez, conhece gente em eventos e comunidades, mantém o LinkedIn e o currículo em dia e
        acompanha o mercado. Isso não é extra; é metade do trabalho de entrar.
      </p>
      <p className={paragraph}>
        <strong className="font-medium">A base é lógica; a stack é ferramenta.</strong> Com lógica de
        programação sólida você aprende qualquer linguagem em que já tenha um mínimo de contato,
        porque cada stack é boa numa coisa e todas se parecem por baixo. Por isso este caminho é
        independente de stack: as competências e a ordem valem para qualquer linguagem, e a do
        servidor você escolhe quando chegar lá. Mas atenção: conseguir codar não te faz
        especialista. O que começa a valer é profundidade de engenharia, arquitetura e produto,
        junto com criatividade. Muita gente hoje passa o dia revisando código e decidindo o que
        construir, mais do que digitando.
      </p>
      <p className={paragraph}>
        <strong className="font-medium">E as soft skills contam dobrado.</strong> Interesse,
        ambição, persistência, assumir responsabilidade e arcar com ela, resolver o problema em vez
        de esperar que alguém resolva. Numa época em que a IA escreve o código, é isso que uma
        entrevista consegue ver em você.
      </p>
      <p className={paragraph}>
        <strong className="font-medium">Como este site ajuda.</strong> A trilha diz onde você está e
        o que vem depois. As construções são o portfólio, uma por vez, cada uma com uma frase pronta
        para o currículo. Os hábitos de carreira são o “nunca parado, nunca sozinho”. O kit é o que
        eu uso no trabalho. Comece pela primeira construção hoje; ela não exige saber nada ainda.
      </p>
      <p className="text-ink-soft max-w-[65ch] text-[13px] leading-relaxed">
        Dados: repositórios frontendbr/vagas e backend-br/vagas, doze meses contra os doze
        anteriores, coletados em 2026-10-15 por busca em texto. Amostra de comunidade, com viés para
        empresas de tecnologia e n pequeno em júnior; a menção a IA é teto, porque parte dos anúncios
        fala de recrutador que usa IA, não de exigência.
      </p>
      <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
        <Link href="/trilha" className="text-now underline underline-offset-2">
          Ir para a trilha
        </Link>
        <Link href="/minha-area" className="text-now underline underline-offset-2">
          Ver o meu portfólio
        </Link>
      </p>
    </article>
  );
}
