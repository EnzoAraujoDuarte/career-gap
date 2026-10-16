# Código

Como escrever e mudar código em qualquer projeto, em qualquer linguagem. Quando o `AGENTS.md` do projeto disser diferente, o projeto manda.

## O que é um bom desenho

- COD-01: Nesta ordem, o código passa nos testes, deixa a intenção clara, não repete conhecimento e tem o menor número de peças. Quando duas dessas coisas brigam, a que vem antes ganha: nunca extraia, junte ou encurte código se isso esconder o que ele faz.

## Tamanho da mudança

- COD-02: Faça a menor mudança que resolve a tarefa. Toque só nas linhas que a tarefa pede e deixe o resto como está, inclusive formatação e ordem dos arquivos. Mudança pequena é revisada mais rápido e quebra menos.
- COD-03: Quando a estrutura atual torna a tarefa difícil de fazer com limpeza, primeiro reorganize o trecho que a tarefa toca, sem mudar comportamento e com os testes passando; depois faça a mudança. Se a reorganização ficar maior que a mudança, pare e proponha no chat como tarefa separada.
- COD-04: Conserte a causa, não o sintoma. Nunca silencie um erro, pule um teste ou crie um caso especial só para o problema sumir.
- COD-05: Mude código fora da tarefa só quando resolver um problema real que você consegue nomear: um bug, um risco de segurança ou de perda de dados, ou algo que vai quebrar um trabalho já planejado. Mostre a evidência: um caso que falha, um log, a tarefa que ele trava. Gosto, estilo, nome e "código mais limpo" nunca valem.
- COD-06: Antes de uma mudança da COD-05, conte no chat o que achou, por que importa e o que propõe. Faça só depois do sim. Se for grande ou não tiver a ver com os arquivos da tarefa, proponha como tarefa separada.
- COD-07: Apague o que a sua mudança deixou morto: código, imports, flags e arquivos sem uso. Nada de camada de compatibilidade nem de código comentado.
- COD-08: Antes de remover ou reescrever algo cujo propósito não está claro, descubra por que existe: leia o histórico do git e a tarefa ligada, ou pergunte. Código que parece inútil costuma tratar um caso que você ainda não viu.

## Simplicidade

- COD-09: Escolha a solução mais simples que funciona. Camada, padrão, abstração ou dependência nova só quando remove um problema que existe hoje, e diga qual é no PR.
- COD-10: Uma abstração merece existir quando esconde complexidade real atrás de uma interface simples. Não crie classes, serviços ou invólucros que só repassam chamadas, nem espalhe uma ideia por vários arquivos pequenos.
- COD-11: Construa só o que a tarefa precisa agora. Nada de opção, flag, parâmetro ou ponto de extensão para um futuro imaginado.
- COD-12: Reaproveite o que o projeto já tem. Procure uma função, um serviço, um componente ou uma biblioteca existente antes de escrever algo novo.
- COD-13: Valide nas fronteiras, que são entrada do usuário, APIs externas e arquivos, e confie nas chamadas internas. Não defenda contra casos que não podem acontecer.
- COD-14: Trate o erro onde dá para fazer algo a respeito, e deixe o resto subir. Nunca capture um erro para ignorá-lo ou para registrar e seguir como se nada tivesse acontecido.

## Repetição

- COD-15: Cada regra de negócio mora num lugar só. Se a mesma regra, conta ou mapeamento é necessária em dois pontos, compartilhe.
- COD-16: Código parecido não é repetição até a terceira ocorrência. Deixe dois blocos semelhantes como estão e extraia no terceiro, quando a forma comum ficar clara. Uma abstração errada custa mais que a repetição.

## Nomes

- COD-17: Dê nome pelo que a coisa faz ou guarda, na língua do negócio. `pedidosAtrasadosPorCliente`, não `dados`, `lista2` ou `trataCoisas`.
- COD-18: Função começa com verbo (`enviarCobranca`, `sincronizarAgenda`). Booleano se lê como pergunta de sim ou não (`estaFechado`, `temEndereco`). Não abrevie além do que o domínio já abrevia.
- COD-19: Se um nome precisa de comentário para ser entendido, troque o nome.
- COD-20: Siga a convenção de nomes do arquivo, do módulo e do framework em que está trabalhando.

## Comentários

- COD-21: O código diz o quê e como. O comentário diz por quê, e só quando o porquê não é óbvio: uma regra de negócio que parece errada, um contorno para bug externo (com link), uma troca deliberada.
- COD-22: Nunca escreva comentário que repete o código ou narra a mudança ("adicionado", "corrigido", "antes era"). O git guarda a história.
- COD-23: Todo TODO aponta para uma tarefa registrada. Sem tarefa, faça agora ou não deixe o TODO.
