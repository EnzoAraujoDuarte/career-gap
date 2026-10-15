# Verificação de originalidade — PROJETO_TCC_CAREER_GAP

Última revisão: 2026-09-24 (versão enxuta, 15 páginas, só as sete frentes)

## Resultado

| medida | valor |
|---|---|
| sobreposição literal com o TCC de IA | **0,54 %** |
| dela, fora do texto institucional obrigatório | **0 %** |
| trechos distintivos com ocorrência exata na web | **0 de 16** |

Os 0,54 % são inteiramente a folha de rosto: *"Projeto do Trabalho de Conclusão de Curso
apresentado ao Centro Universitário do Espírito Santo – UNESC, no curso de Sistemas de
Informação, como requisito parcial para obtenção do título de Bacharel…"*. É texto exigido
pela instituição e não há como — nem por que — reescrevê-lo.

## Ferramentas de código aberto: o que foi testado

### copydetect — **reprovada para prosa**

Instalada (`pip install copydetect`) e testada. É uma ferramenta de plágio **de código**,
baseada em winnowing, com tokenização via Pygments.

- Com arquivos `.txt`, não produz nada: até uma **cópia idêntica** marca **0,00 %**.
- Renomeando para `.py`, a cópia idêntica marca corretamente 100 %, e este projeto contra o
  TCC de IA marcou **69,62 %** — número que parecia alarmante.
- **Controle negativo derrubou o resultado:** o mesmo corpus com a ordem das palavras
  invertida — onde não existe uma única frase em comum — marcou **65,15 %**.

O lexer de Python transforma toda palavra em português no mesmo tipo de token, então a
ferramenta compara *forma sintática*, não palavras. O número é falso positivo. O mesmo vale
para JPlag, MOSS e qualquer detector de plágio de código.

**Lição:** um resultado sem controle positivo e negativo não vale nada. Um zero pode ser
originalidade ou ferramenta quebrada; um número alto pode ser plágio ou artefato.

### `plagio/verificar.py` — em uso

Escrito para este projeto. Roda os dois controles em toda execução e recusa o resultado se
algum falhar.

```bash
.venv/bin/python plagio/verificar.py PROJETO_TCC_CAREER_GAP.docx plagio/corpus/*.docx
```

Mede duas coisas separadas, porque elas falham de formas diferentes:

- **n-gramas de 8 palavras** — trechos literalmente iguais, e imprime quais são. É a medida
  que importa para plágio.
- **TF-IDF** — proximidade de vocabulário. Deu 62,7 % contra o TCC de IA, e isso é **esperado**:
  dois textos acadêmicos em português, do mesmo autor, da mesma instituição. Não indica cópia.

Controles da última execução: positivo 100,00 %, negativo 0,00 % — ferramenta confiável.

## O que nenhuma ferramenta livre faz

**Nenhum detector de código aberto busca na internet.** Todos comparam contra um corpus que
você fornece. O que Turnitin, CopySpider e Compilatio vendem não é o algoritmo — é a base
fechada: repositórios institucionais, periódicos assinados e trabalhos já entregues por outros
alunos. Essa base não é replicável localmente.

Consequência prática: as ferramentas locais pegam **autoplágio** e cópia de fontes que você
tem em mãos. Não respondem "esta frase existe em algum lugar da internet". **Se a UNESC exige
o relatório oficial, ele continua obrigatório.**

Para uma segunda opinião independente, com interface gráfica e sem programação:

| ferramenta | o que é | onde |
|---|---|---|
| **WCopyfind** | Prof. Louis Bloomfield (Univ. of Virginia). Compara um documento contra centenas de outros; lê docx, pdf, rtf, html. Gratuita e livre. | plagiarism.bloomfieldmedia.com |
| **Ferret** | Univ. of Hertfordshire. Detecta trechos duplicados num conjunto de arquivos; distingue par a par e contra material-modelo. GPL. | github.com/ronisbr/ferret |

Ambas têm a mesma limitação de corpus. Use-as com o mesmo cuidado: rode uma cópia idêntica
e um texto embaralhado antes de confiar em qualquer número.

## Complemento: busca por frases exatas

Dezesseis trechos distintivos pesquisados entre aspas, cobrindo todas as seções. **Zero
retornos com a frase exata**; os buscadores devolveram apenas páginas de tema próximo.

Isso é o mais perto de uma checagem web que dá para fazer aqui, e é amostragem, não varredura.

Uma frase foi reescrita por precaução: ecoava o aforismo de Carl Sagan ("ausência de evidência
não é evidência de ausência"), que é citável e poderia ser marcado.

## Referências conferidas em fonte externa

| referência | conferido |
|---|---|
| Dell et al., CHI 2012 | p. 1321-1330 ✓ |
| Radermacher, Walia & Knudson, ICSE Companion 2014 | p. 291-300 ✓ |
| Zell & Krizan, 2014 | v. 9, p. 111-125 ✓ |
| Knijnenburg & Willemsen, 2015 | p. 309-352, 2. ed. Springer ✓ |
| Kosch et al., TOCHI | v. 29, n. 6, art. 56, p. 1-32 — corrigido |
| Hoover & Oshineye, *Apprenticeship Patterns* | O'Reilly Media, 2009, ISBN 9780596518387 ✓ |
| Sawyer (org.), *Cambridge Handbook of the Learning Sciences* | 2. ed., Cambridge University Press, 2014 ✓ |
| Kahneman, *Rápido e devagar* | Objetiva, 2012, trad. Cássio de Arantes Leite ✓ |

As três últimas foram conferidas duas vezes: nos metadados do próprio PDF e na página da
editora. *Apprenticeship Patterns* está sob licença Creative Commons desde 2010, por decisão
dos autores — é fonte de acesso livre e legítimo, compatível com a regra do projeto.

As outras dez não foram conferidas linha a linha — **confira antes da entrega**. As três
marcadas `[conferir]` em `docs/TCC-ORIENTACAO.md` ficaram fora do documento.

## Figuras

A única figura é captura de tela do próprio sistema, gerada do código deste repositório. É
obra própria. Os recursos visíveis aparecem só como título e fonte — a plataforma referencia,
nunca reproduz.
