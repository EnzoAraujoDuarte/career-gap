import type { Metadata } from 'next';
import { CATALOG } from '@/catalog';
import { FIRST_WEB_ROLE } from '@/catalog/tracks';
import { EntryOption, type EntrySpec } from '@/components/entrada/entry-option';

/** Registro do método, como /estilos: fora da navegação e da busca. */
export const metadata: Metadata = {
  title: 'Modelos de primeira tela · Career Gap',
  robots: { index: false, follow: false },
};

/**
 * Comparação de modelos de primeira tela.
 *
 * Renderizada em molduras de celular porque é lá que ~80% do público vai entrar. O eixo de
 * comparação é "quantos toques até ver algo útil" — o diagnóstico foi que o custo vem antes
 * do valor, então é isso que precisa ser medido lado a lado.
 */
export default function EntradaPage() {
  const cans = FIRST_WEB_ROLE.requirements
    .filter((requirement) => requirement.criticality === 'core')
    .slice(0, 3)
    .map((requirement) => {
      const competency = CATALOG.competencies.get(requirement.competency)!;
      return { name: competency.name, canDo: competency.levels.L1?.canDo ?? '' };
    });

  const specs: EntrySpec[] = [
    {
      id: 'apresentacao',
      title: 'A · Apresentação',
      thesis:
        'A tela de hoje. Promessa, botão, números do catálogo. O usuário decide se entra antes de ver qualquer coisa.',
      tapsToValue: '1 toque + 25 respostas',
      pro: 'Explica a proposta antes de pedir esforço',
      con: 'O valor fica atrás de um pedágio de 4 minutos',
      cost: 'já existe',
    },
    {
      id: 'mapa-aberto',
      title: 'B · Mapa aberto',
      thesis:
        'Cai direto no caminho genérico, navegável. Uma barra fixa convida a personalizar: "diga o que você já sabe e eu escondo o que não serve".',
      tapsToValue: '0 toques',
      pro: 'Valor imediato; personalizar vira ação sobre algo que já está na tela',
      con: 'À primeira vista parece o roadmap.sh — o diferencial só aparece depois de agir',
      cost: 'baixo, a tela já existe em /catalogo',
    },
    {
      id: 'uma-pergunta',
      title: 'C · Uma pergunta por vez',
      thesis:
        'Sem landing e sem formulário. A primeira tela já é a primeira pergunta, uma de cada vez, e o mapa se monta embaixo conforme você responde.',
      tapsToValue: '1 toque',
      pro: 'Mata a sensação de formulário; progresso visível desde a primeira resposta',
      con: 'Mais telas, mais pontos de desistência',
      cost: 'médio, refaz o onboarding',
    },
    {
      id: 'entrega',
      title: 'D · Comece pela entrega',
      thesis:
        'Escolha algo concreto que você quer conseguir fazer. A escolha recorta o caminho: você responde 6 perguntas em vez de 25.',
      tapsToValue: '1 toque + 6 respostas',
      pro: 'Fala a língua de quem está começando; entrada 4x menor',
      con: 'Exige mapear entrega → competências, e fragmenta o track',
      cost: 'médio',
    },
    {
      id: 'mentor',
      title: 'E · Conversa com o mentor',
      thesis:
        'Um campo de texto: "me conta o que você já fez". A IA extrai os sinais, mostra o que entendeu, você corrige.',
      tapsToValue: '1 resposta em texto livre',
      pro: 'É o único que honra a metáfora do mentor; usa a IA já aprovada e nunca construída',
      con: 'IA no caminho crítico da entrada: mais lenta, precisa de alternativa quando falhar',
      cost: 'alto',
    },
  ];

  return (
    <main className="bg-paper min-h-dvh px-5 py-10">
      <div className="mx-auto max-w-[1180px]">
        <header className="border-rule mb-9 border-b pb-6">
          <h1 className="text-ink text-[26px] font-medium leading-tight">
            Cinco modelos de primeira tela
          </h1>
          <p className="text-ink-soft mt-2 max-w-[74ch] text-[14px] leading-relaxed">
            Em moldura de celular, que é por onde a maior parte do público vai entrar. O eixo
            que importa é <strong className="text-ink font-medium">quantos toques até ver algo
            útil</strong> — o problema diagnosticado foi que hoje o custo vem antes do valor.
          </p>
        </header>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {specs.map((spec) => (
            <EntryOption key={spec.id} spec={spec} cans={cans} />
          ))}
        </div>
      </div>
    </main>
  );
}
