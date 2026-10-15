const {
  Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, LineRuleType,
  Tab, TabStopType, LeaderType, ImageRun,
  Table, TableRow, TableCell, WidthType, BorderStyle,
} = require('docx');
const fs = require('fs');

const FONTE = 'Arial';
const T = 24;        // 12 pt — corpo
const T_CAPA = 28;   // 14 pt — capa e folha de rosto
const T_MENOR = 20;  // 10 pt — quadros, figuras e legendas
const L15 = { line: 360, lineRule: LineRuleType.AUTO, after: 0, before: 0 };
const L10 = { line: 240, lineRule: LineRuleType.AUTO, after: 0, before: 0 };
const RECUO = 567;   // 1 cm
const LARGURA_TEXTO = 9071; // twips entre as margens

const run = (text, o = {}) => new TextRun({ text, font: FONTE, size: o.size ?? T, bold: o.bold });

const p = (text) => new Paragraph({
  spacing: L15, indent: { left: 0, firstLine: RECUO },
  alignment: AlignmentType.JUSTIFIED, children: [run(text)],
});

const h1 = (text) => new Paragraph({
  pageBreakBefore: true, outlineLevel: 0,
  spacing: { line: 360, lineRule: LineRuleType.AUTO, after: 360, before: 0 },
  indent: { left: 0, firstLine: 0 }, alignment: AlignmentType.LEFT,
  children: [run(text, { bold: true })],
});

const h2 = (text) => new Paragraph({
  outlineLevel: 1,
  spacing: { line: 360, lineRule: LineRuleType.AUTO, after: 360, before: 360 },
  indent: { left: 0, firstLine: 0 }, alignment: AlignmentType.LEFT,
  children: [run(text)],
});

const alinea = (text) => new Paragraph({
  spacing: L15, indent: { left: RECUO, firstLine: 0 },
  alignment: AlignmentType.JUSTIFIED, children: [run(text)],
});

const legenda = (text, o = {}) => new Paragraph({
  spacing: L10, indent: { left: 0, firstLine: 0 }, alignment: AlignmentType.LEFT,
  keepNext: o.keepNext, children: [run(text, { size: T_MENOR })],
});

const centro = (text, o = {}) => new Paragraph({
  spacing: L15, alignment: AlignmentType.CENTER, indent: { left: 0, firstLine: 0 },
  children: [run(text, { size: o.size ?? T, bold: o.bold })],
});

const vazio = (size) => new Paragraph({ spacing: L15, children: [run('', { size })] });
const quebra = () => new Paragraph({ children: [new PageBreak()] });

const itemComPagina = (texto, pagina, o = {}) => new Paragraph({
  spacing: L15, indent: { left: (o.nivel ?? 0) * 283, firstLine: 0 },
  tabStops: [{ type: TabStopType.RIGHT, position: LARGURA_TEXTO, leader: LeaderType.DOT }],
  children: [
    run(texto, { bold: o.negrito }),
    new TextRun({ font: FONTE, size: T, children: [new Tab()] }),
    run(String(pagina), { bold: o.negrito }),
  ],
});

// ---------------------------------------------------------------- figuras
const LARGURA_FIGURA = 580; // px a 96 dpi ≈ 15,3 cm

/** Legenda acima, imagem centralizada, fonte abaixo — conforme a NBR 14724. */
const figura = (numero, titulo, arquivo) => {
  const bytes = fs.readFileSync(`figuras/${arquivo}`);
  const largura = bytes.readUInt32BE(16);
  const altura = bytes.readUInt32BE(20);
  return [
    legenda(`Figura ${numero} – ${titulo}`, { keepNext: true }),
    new Paragraph({
      spacing: L10, indent: { left: 0, firstLine: 0 }, alignment: AlignmentType.CENTER,
      keepNext: true, keepLines: true,
      children: [new ImageRun({
        type: 'png', data: bytes,
        transformation: { width: LARGURA_FIGURA, height: Math.round(LARGURA_FIGURA * altura / largura) },
      })],
    }),
    legenda('Fonte: elaborado pelo autor (2026).'),
    vazio(),
  ];
};

// ---------------------------------------------------------------- quadros
const BORDA = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const BORDAS = { top: BORDA, bottom: BORDA, left: BORDA, right: BORDA };

const celula = (texto, { largura, negrito = false, alinhamento = AlignmentType.LEFT, folga = 80 }) =>
  new TableCell({
    width: { size: largura, type: WidthType.DXA },
    margins: { top: 40, bottom: 40, left: folga, right: folga },
    children: [new Paragraph({
      spacing: L10, indent: { left: 0, firstLine: 0 }, alignment: alinhamento,
      children: [run(texto, { size: T_MENOR, bold: negrito })],
    })],
  });

const quadro = (colunas, linhas, { cabecalho = true } = {}) => new Table({
  columnWidths: colunas,
  width: { size: colunas.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  borders: BORDAS,
  rows: linhas.map((celulas, i) => new TableRow({
    children: celulas.map((c, j) => celula(typeof c === 'string' ? c : c.t, {
      largura: colunas[j],
      negrito: (cabecalho && i === 0) || (typeof c === 'object' && c.n),
      alinhamento: typeof c === 'object' && c.a ? c.a : AlignmentType.LEFT,
      folga: typeof c === 'object' && c.folga ? c.folga : 80,
    })),
  })),
});

const TITULO = 'DESENVOLVIMENTO E AVALIAÇÃO DE UMA PLATAFORMA PARA GERAÇÃO DE ROADMAPS PERSONALIZADOS DE EVOLUÇÃO PROFISSIONAL NA ÁREA DE DESENVOLVIMENTO DE SOFTWARE';

const REFERENCIAS = [
  'ACM; IEEE COMPUTER SOCIETY; AAAI. Computer Science Curricula 2023: curriculum guidelines for undergraduate degree programs in computer science. New York: ACM, 2023.',
  'DELL, Nicola et al. “Yours is better!”: participant response bias in HCI. In: CONFERENCE ON HUMAN FACTORS IN COMPUTING SYSTEMS, 2012, Austin. Proceedings [...]. New York: ACM, 2012. p. 1321-1330.',
  'DOIGNON, Jean-Paul; FALMAGNE, Jean-Claude. Spaces for the assessment of knowledge. International Journal of Man-Machine Studies, v. 23, n. 2, p. 175-196, 1985.',
  'FALMAGNE, Jean-Claude; DOIGNON, Jean-Paul. Learning spaces: interdisciplinary applied mathematics. Berlim: Springer, 2011.',
  'FELFERNIG, Alexander et al. Knowledge-based recommender systems: overview and research directions. Frontiers in Big Data, v. 7, 2024.',
  'HOOVER, Dave; OSHINEYE, Adewale. Apprenticeship patterns: guidance for the aspiring software craftsman. Sebastopol: O’Reilly Media, 2009.',
  'IEEE COMPUTER SOCIETY. Guide to the software engineering body of knowledge (SWEBOK guide): version 4.0. Los Alamitos: IEEE Computer Society, 2024.',
  'KAHNEMAN, Daniel. Rápido e devagar: duas formas de pensar. Tradução de Cássio de Arantes Leite. Rio de Janeiro: Objetiva, 2012.',
  'KIRSCHNER, Paul A.; SWELLER, John; CLARK, Richard E. Why minimal guidance during instruction does not work: an analysis of the failure of constructivist, discovery, problem-based, experiential, and inquiry-based teaching. Educational Psychologist, v. 41, n. 2, p. 75-86, 2006.',
  'KNIJNENBURG, Bart P.; WILLEMSEN, Martijn C. Evaluating recommender systems with user experiments. In: RICCI, Francesco; ROKACH, Lior; SHAPIRA, Bracha (org.). Recommender systems handbook. 2. ed. Nova York: Springer, 2015. p. 309-352.',
  'KOSCH, Thomas et al. The placebo effect of artificial intelligence in human-computer interaction. ACM Transactions on Computer-Human Interaction, v. 29, n. 6, art. 56, p. 1-32, 2023.',
  'PU, Pearl; CHEN, Li; HU, Rong. A user-centric evaluation framework for recommender systems. In: ACM CONFERENCE ON RECOMMENDER SYSTEMS, 5., 2011, Chicago. Proceedings [...]. New York: ACM, 2011. p. 157-164.',
  'RADERMACHER, Alex; WALIA, Gursimran. Gaps between industry expectations and the abilities of graduates. In: ACM TECHNICAL SYMPOSIUM ON COMPUTER SCIENCE EDUCATION, 44., 2013, Denver. Proceedings [...]. New York: ACM, 2013. p. 525-530.',
  'RADERMACHER, Alex; WALIA, Gursimran; KNUDSON, Dean. Investigating the skill gap between graduating students and industry expectations. In: INTERNATIONAL CONFERENCE ON SOFTWARE ENGINEERING, 36., 2014, Hyderabad. Companion proceedings [...]. New York: ACM, 2014. p. 291-300.',
  'SAWYER, R. Keith (org.). The Cambridge handbook of the learning sciences. 2. ed. Cambridge: Cambridge University Press, 2014.',
  'SENTANCE, Sue; WAITE, Jane; KALLIA, Maria. Teaching computer programming with PRIMM: a sociocultural perspective. Computer Science Education, v. 29, n. 2-3, p. 136-176, 2019.',
  'SFIA FOUNDATION. SFIA 9: the global skills and competency framework for the digital world. Londres: SFIA Foundation, 2024.',
  'ZELL, Ethan; KRIZAN, Zlatan. Do people have insight into their abilities? A metasynthesis. Perspectives on Psychological Science, v. 9, n. 2, p. 111-125, 2014.',
];

// Páginas conferidas contra o PDF renderizado (ver conferir.js).
const P = JSON.parse(fs.readFileSync('paginas.json', 'utf8'));

const doc = new Document({
  styles: { default: { document: { run: { font: FONTE, size: T } } } },
  sections: [{
    properties: { page: { margin: { top: 1701, right: 1134, bottom: 1134, left: 1701 } } },
    children: [
      // ============================ CAPA ============================
      centro('CENTRO UNIVERSITÁRIO DO ESPÍRITO SANTO – UNESC', { size: T_CAPA, bold: true }),
      centro('ENZO ARAUJO DUARTE', { size: T_CAPA, bold: true }),
      ...Array.from({ length: 8 }, () => vazio(T_CAPA)),
      centro(TITULO, { size: T_CAPA, bold: true }),
      ...Array.from({ length: 10 }, () => vazio(T_CAPA)),
      centro('COLATINA', { size: T_CAPA, bold: true }),
      centro('2026', { size: T_CAPA, bold: true }),
      quebra(),

      // ====================== FOLHA DE ROSTO ========================
      centro('ENZO ARAUJO DUARTE', { size: T_CAPA, bold: true }),
      ...Array.from({ length: 8 }, () => vazio(T_CAPA)),
      centro(TITULO, { size: T_CAPA, bold: true }),
      ...Array.from({ length: 4 }, () => vazio(T_CAPA)),
      new Paragraph({
        spacing: L10, indent: { left: 4536, firstLine: 0 }, alignment: AlignmentType.JUSTIFIED,
        children: [run('Projeto do Trabalho de Conclusão de Curso apresentado ao Centro Universitário do Espírito Santo – UNESC, no curso de Sistemas de Informação, como requisito parcial para obtenção do título de Bacharel em Sistemas de Informação.')],
      }),
      vazio(),
      new Paragraph({
        spacing: L10, indent: { left: 4536, firstLine: 0 }, alignment: AlignmentType.JUSTIFIED,
        children: [run('Orientador: Prof. Riciere Massariol.')],
      }),
      ...Array.from({ length: 5 }, () => vazio(T_CAPA)),
      centro('COLATINA', { size: T_CAPA, bold: true }),
      centro('2026', { size: T_CAPA, bold: true }),
      quebra(),

      // =========================== SUMÁRIO ==========================
      centro('SUMÁRIO', { bold: true }),
      vazio(),
      itemComPagina('INTRODUÇÃO', P.intro, { negrito: true }),
      itemComPagina('1 PROBLEMA DE PESQUISA E HIPÓTESES', P.s1, { negrito: true }),
      itemComPagina('1.1 DELIMITAÇÃO DO PÚBLICO-ALVO', P.s11, { nivel: 1 }),
      itemComPagina('2 OBJETIVOS', P.s2, { negrito: true }),
      itemComPagina('2.1 OBJETIVO GERAL', P.s21, { nivel: 1 }),
      itemComPagina('2.2 OBJETIVOS ESPECÍFICOS', P.s22, { nivel: 1 }),
      itemComPagina('3 PROCEDIMENTOS METODOLÓGICOS E ANÁLISE DE DADOS', P.s3, { negrito: true }),
      itemComPagina('3.1 IDENTIFICAÇÃO DAS LACUNAS DE CONHECIMENTO', P.s31, { nivel: 1 }),
      itemComPagina('3.2 GERAÇÃO DO ROADMAP', P.s32, { nivel: 1 }),
      itemComPagina('3.3 AVALIAÇÃO COM USUÁRIOS', P.s33, { nivel: 1 }),
      itemComPagina('4 REFERENCIAL TEÓRICO', P.s4, { negrito: true }),
      itemComPagina('4.1 A LACUNA ENTRE FORMAÇÃO E INDÚSTRIA DE SOFTWARE', P.s41, { nivel: 1 }),
      itemComPagina('4.2 COMPETÊNCIAS PROFISSIONAIS E MODELOS DE NÍVEL', P.s42, { nivel: 1 }),
      itemComPagina('4.3 ROADMAPS E SEQUENCIAMENTO DE APRENDIZAGEM', P.s43, { nivel: 1 }),
      itemComPagina('4.4 PERSONALIZAÇÃO E SISTEMAS DE RECOMENDAÇÃO', P.s44, { nivel: 1 }),
      itemComPagina('REFERÊNCIAS', P.ref, { negrito: true }),

      // ========================= INTRODUÇÃO =========================
      h1('INTRODUÇÃO'),
      p('A entrada na área de desenvolvimento de software envolve um volume de conteúdo que excede a capacidade de organização de quem está começando. Roadmaps públicos, listas de tecnologias e catálogos de cursos apresentam o que existe em determinada área, mas não indicam o que uma pessoa específica deveria estudar primeiro, considerando o que ela já sabe e o objetivo que pretende alcançar.'),
      p('Este trabalho propõe e avalia o Career Gap, uma plataforma que identifica lacunas entre o estado atual do usuário e as competências exigidas por um objetivo profissional, e gera a partir dessas lacunas um roadmap priorizado e explicável. A diferença em relação a um roadmap convencional está na seleção e na ordenação: o sistema exibe o que falta, na sequência em que faz sentido aprender, e indica o que pode ser adiado.'),
      p('A pesquisa é aplicada e exploratória, e combina o desenvolvimento de um artefato com avaliação empírica junto ao público-alvo. A avaliação compara, com os mesmos participantes, a apresentação não personalizada do catálogo de competências e o roadmap gerado a partir do estado individual, medindo relevância percebida, clareza do próximo passo e usabilidade.'),
      p('A contribuição não está em produzir conteúdo educacional novo, mas em organizar conteúdo existente segundo o estado e o objetivo de cada usuário. A lógica que seleciona e ordena as recomendações é determinística e auditável: cada posição no roadmap tem razão registrada e pode ser inspecionada, em vez de resultar de texto gerado por modelo de linguagem sem critério verificável.'),
      p('O trabalho está organizado em quatro seções. A primeira delimita o problema de pesquisa, o público-alvo e as hipóteses. A segunda estabelece os objetivos. A terceira descreve os procedimentos metodológicos, detalhando como as lacunas de conhecimento são identificadas, como o roadmap é gerado e como a plataforma será avaliada com usuários. A quarta reúne o referencial teórico que sustenta as decisões de construção e de avaliação.'),

      // ============================== 1 =============================
      h1('1 PROBLEMA DE PESQUISA E HIPÓTESES'),
      p('Os materiais de orientação de estudo disponíveis publicamente organizam o conhecimento por área, e não por pessoa. Apresentam a mesma sequência para todos os interessados, independentemente do que cada um já domina. O resultado é que o esforço de decidir por onde começar permanece integralmente com o estudante, justamente quem tem menos repertório para tomar essa decisão.'),
      p('A literatura sobre a transição entre formação e mercado registra deficiências recorrentes em recém-formados, com destaque para resolução de problemas e comunicação (RADERMACHER; WALIA, 2013; RADERMACHER; WALIA; KNUDSON, 2014). Esses achados sugerem que o problema não é a ausência de material disponível, mas a ausência de direcionamento sobre o que priorizar.'),
      p('Diante disso, formula-se o seguinte problema de pesquisa: como uma plataforma que identifica lacunas de conhecimento a partir do estado declarado do usuário pode gerar roadmaps de estudo percebidos como mais relevantes, mais bem ordenados e mais claros quanto ao próximo passo do que a apresentação não personalizada do mesmo catálogo de competências e recursos?'),
      p('A formulação incorpora três decisões de recorte, explicitadas a seguir por condicionarem o desenho da avaliação:'),
      alinea('a) a comparação é feita contra o próprio catálogo da plataforma, apresentado sem filtragem e sem ordenação, e não contra um roadmap público concorrente. Comparar com outro produto confundiria diferença de conteúdo com diferença de personalização, além de esbarrar em restrição de licença;'),
      alinea('b) o que se mede é percepção de utilidade e de coerência, não desempenho de carreira. Afirmar que a plataforma melhora a trajetória profissional exigiria estudo longitudinal, incompatível com o prazo do trabalho;'),
      alinea('c) a variável manipulada é a seleção e a ordenação por lacuna, e não personalização em sentido amplo. A precisão é necessária porque a plataforma personaliza também a explicação apresentada ao usuário.'),
      p('Formulam-se as seguintes hipóteses:'),
      alinea('a) a seleção de competências a partir das lacunas individuais reduz a quantidade de itens percebidos como irrelevantes, em comparação com a apresentação integral do catálogo;'),
      alinea('b) a ordenação baseada em pré-requisitos e prioridade aumenta a clareza percebida sobre qual deve ser o próximo passo;'),
      alinea('c) a apresentação explícita do que não deve ser priorizado no momento é percebida como útil, e não como omissão de conteúdo;'),
      alinea('d) a explicação estruturada do motivo de cada recomendação aumenta a confiança do usuário no resultado apresentado.'),

      h2('1.1 DELIMITAÇÃO DO PÚBLICO-ALVO'),
      p('A pesquisa dirige-se a estudantes e profissionais em início de carreira que buscam ingressar em desenvolvimento de software, com recorte em desenvolvimento web.'),
      p('A delimitação é operacional, e não apenas declarativa. A plataforma implementa um único objetivo de carreira, denominado primeira vaga em desenvolvimento web, com duas ênfases — frontend e backend — que funcionam como ajuste de peso sobre o mesmo catálogo de competências, nunca como catálogos paralelos. Em termos de capacidade, o público situa-se entre os níveis L0 e L2 da escala descrita na seção 3.1, o que exclui por construção os percursos de pleno, sênior, arquitetura e liderança técnica. Esses percursos permanecem registrados como evolução futura da plataforma, fora do escopo desta pesquisa.'),
      p('A escolha tem fundamento metodológico: a literatura sobre a distância entre formação e indústria concentra-se nesse recorte, o que permite ancorar o problema em trabalho existente e confrontar os achados com estudos anteriores.'),

      // ============================== 3 =============================
      h1('2 OBJETIVOS'),
      h2('2.1 OBJETIVO GERAL'),
      p('Desenvolver e avaliar uma plataforma capaz de identificar lacunas de conhecimento e gerar roadmaps personalizados de estudo para estudantes e profissionais em início de carreira na área de desenvolvimento de software.'),
      h2('2.2 OBJETIVOS ESPECÍFICOS'),
      p('Para alcançá-lo, estabelecem-se os seguintes objetivos específicos:'),
      alinea('a) construir um catálogo de competências para o ingresso em desenvolvimento web, com níveis descritos por capacidade observável, relações de pré-requisito verificáveis e recursos educacionais associados, registrando as fontes que fundamentam cada afirmação;'),
      alinea('b) implementar a estimativa do estado atual do usuário de modo a reconhecer as limitações conhecidas da autoavaliação;'),
      alinea('c) implementar o cálculo das lacunas e a geração do roadmap de forma determinística e auditável, explicando a razão de cada etapa e indicando o que pode ser adiado;'),
      alinea('d) avaliar, junto ao público-alvo, a relevância percebida, a clareza do próximo passo e a usabilidade da plataforma.'),

      // ============================== 5 =============================
      h1('3 PROCEDIMENTOS METODOLÓGICOS E ANÁLISE DE DADOS'),
      p('O artefato é tratado como objeto de pesquisa, e não apenas como produto: seus mecanismos internos são descritos a seguir de modo que possam ser verificados e reproduzidos por terceiros.'),

      h2('3.1 IDENTIFICAÇÃO DAS LACUNAS DE CONHECIMENTO'),
      p('O catálogo reúne trinta competências exigidas pelo objetivo profissional selecionado e vinte e duas relações de pré-requisito entre elas. Cada competência, cada nível-alvo e cada relação de pré-requisito registra as fontes que a sustentam, exigindo-se ao menos duas classes distintas de fonte entre padrões curriculares, frameworks de competência e referências canônicas. Adotam-se como padrões curriculares o Computer Science Curricula 2023 e o Guide to the Software Engineering Body of Knowledge, e como framework de competência o Skills Framework for the Information Age. A exigência é verificada automaticamente: a suíte de testes rejeita o catálogo quando uma afirmação cita duas fontes da mesma classe. A cada competência associam-se recursos educacionais verificados individualmente quanto a idioma, custo e situação de direitos, num total de cento e vinte e cinco, dos quais oitenta e três em português. O tipo de cada recurso é registrado — curso, vídeo, documentação, exercício e livro, entre outros —, e quinze deles são livros, mantidos no catálogo pelo tratamento sequenciado que oferecem e não como complemento opcional.'),
      p('Os níveis de competência são definidos por descritores de capacidade observável, redigidos em primeira pessoa, e não por percentuais. A escala é apresentada como ordinal e operacional, e não como teoria de estágios de desenvolvimento: em vez de pedir uma nota, o sistema pede que o usuário reconheça qual descrição corresponde ao que ele consegue fazer.'),
      p('A estimativa do estado atual combina três origens de evidência, com graus distintos de confiança: a autoavaliação por descritores, itens objetivos de verificação e respostas abertas avaliadas por rubrica. A opção por ancorar a autoavaliação em descritores de tarefa, e não em escalas numéricas, apoia-se na constatação de que a autoavaliação apresenta correlação apenas modesta com o desempenho medido (ZELL; KRIZAN, 2014) e de que itens descontextualizados são menos confiáveis que itens referidos a tarefas concretas.'),
      p('Como salvaguarda, o sistema não rebaixa silenciosamente o nível declarado: sinaliza a necessidade de verificação quando a confiança é baixa e a competência condiciona outras. O perfil inferido é exibido e confirmado pelo usuário antes de ser utilizado.'),
      p('A lacuna de cada competência é a diferença, em níveis, entre o estado estimado e o nível exigido pelo objetivo. A ausência de informação é tratada como nível mínimo, uma vez que o silêncio do usuário a respeito de uma competência não autoriza presumi-la adquirida.'),

      h2('3.2 GERAÇÃO DO ROADMAP'),
      p('A geração ocorre em três etapas separadas. Na primeira, de natureza estrutural, uma competência é considerada alcançável quando todos os seus pré-requisitos estão satisfeitos; caso contrário, é registrada como bloqueada, com indicação do que a impede. A relação de pré-requisito é admitida apenas quando a competência dependente é inviável sem a anterior, e não quando há mera preferência de ordem. Essa etapa instancia a noção de fronteira do estado de conhecimento, segundo a qual o conjunto do que pode ser aprendido a seguir é determinado pelo estado atual e pelas relações de precedência (FALMAGNE; DOIGNON, 2011).'),
      p('Na segunda etapa, as competências alcançáveis são ordenadas por uma soma ponderada de três componentes normalizados: o tamanho da lacuna, a criticidade da competência para o objetivo e a quantidade de competências que ela desbloqueia. Os pesos são publicados junto ao catálogo e o detalhamento do cálculo é armazenado com cada item, o que permite exibir a composição de qualquer recomendação. Optou-se por soma ponderada em lugar de produto de fatores, pois no produto um fator próximo de zero anula o resultado e oculta lacunas relevantes. A confiança da estimativa não integra o escore, uma vez que incerteza de medida não equivale a falta de importância.'),
      p('Na terceira etapa, regras editoriais nomeadas podem apenas rebaixar ou excluir itens, nunca promovê-los, e cada exclusão registra um código de razão legível. É por meio dessas regras que o sistema indica explicitamente o que não deve ser priorizado no momento. As três etapas estão cobertas por quarenta e oito testes automatizados, que verificam a ordem gerada para perfis de referência.'),
      p('A Figura 1 mostra o resultado das três etapas para um perfil que declara domínio de interface mas pouca prática de plataforma. O item colocado em primeiro lugar traz a razão da posição, os recursos na ordem em que devem ser consumidos e os critérios pelos quais o usuário reconhece que concluiu a etapa.'),
      ...figura(1, 'Roadmap gerado, com a justificativa da primeira etapa', 'fig4-roadmap.png'),
      p('A ordem, a prioridade e a composição do roadmap resultam integralmente dessas três etapas. Nenhuma delas é delegada a modelo de linguagem, e o sistema opera sem depender de serviço externo de inteligência artificial.'),

      h2('3.3 AVALIAÇÃO COM USUÁRIOS'),
      p('A avaliação adota desenho intra-sujeito com ordem contrabalançada. Cada participante interage com duas condições: a apresentação integral do catálogo do objetivo, sem filtragem por lacuna e sem ordenação, e o roadmap gerado a partir do seu próprio estado. As duas condições utilizam a mesma interface, os mesmos recursos associados a cada competência e o mesmo tratamento visual, variando apenas a seleção e a ordenação dos itens.'),
      p('Esse controle é necessário porque a atribuição de um sistema a inteligência artificial pode elevar a percepção de qualidade mesmo na ausência de adaptação real (KOSCH et al., 2023), e porque participantes tendem a favorecer o artefato que atribuem ao pesquisador (DELL et al., 2012). Por essa razão, os rótulos apresentados aos participantes são neutros.'),
      p('Os instrumentos são: um subconjunto do questionário ResQue, voltado à avaliação de sistemas de recomendação centrada no usuário, abrangendo acurácia percebida, transparência, controle, utilidade, confiança e satisfação (PU; CHEN; HU, 2011); a escala System Usability Scale, para usabilidade; dois itens de verificação da percepção de personalização; e medidas objetivas de tempo até a identificação do próximo passo e de quantidade de itens assinalados como irrelevantes em cada condição. Complementarmente, um painel de três a cinco desenvolvedores experientes avalia a coerência dos roadmaps gerados para perfis sintéticos.'),
      p('A amostra prevista é de vinte e quatro participantes, doze por sequência de ordem, com mínimo aceitável de vinte. Com esse tamanho, o efeito mínimo detectável situa-se em torno de 0,6 em termos de tamanho de efeito padronizado, razão pela qual o estudo é declarado exploratório previamente à coleta. Os dados quantitativos serão analisados por comparação entre as condições para cada participante, e as respostas abertas por análise de conteúdo.'),
      p('Declaram-se as seguintes limitações: mede-se percepção de utilidade e de coerência, e não ganho de carreira, o que exigiria estudo longitudinal; a estimativa de entrada é majoritariamente autodeclarada, de modo que um resultado nulo pode refletir erro de estimativa e não ausência de efeito; e o painel de especialistas avalia perfis sintéticos, e não os perfis reais dos participantes.'),

      // ============================== 9 =============================
      h1('4 REFERENCIAL TEÓRICO'),
      p('O referencial organiza-se em quatro eixos, correspondentes aos fundamentos necessários à construção e à avaliação do artefato.'),
      h2('4.1 A LACUNA ENTRE FORMAÇÃO E INDÚSTRIA DE SOFTWARE'),
      p('A distância entre a formação acadêmica e as exigências da indústria de software é objeto de investigação sistemática. Estudos que consultaram profissionais e empresas identificam deficiências recorrentes em egressos, com destaque para resolução de problemas e comunicação, além de práticas de construção e teste de software (RADERMACHER; WALIA, 2013; RADERMACHER; WALIA; KNUDSON, 2014). Do lado da prática profissional, Hoover e Oshineye (2009) catalogam padrões de comportamento para quem está no início da carreira em software e tratam a construção do próprio percurso como responsabilidade do aprendiz. Trata-se de literatura de prática, e não de pesquisa empírica, mas é útil por nomear dificuldades que os estudos quantitativos apenas medem. Esses achados fundamentam a delimitação do público-alvo e a inclusão, no catálogo, de competências que não são estritamente técnicas.'),
      h2('4.2 COMPETÊNCIAS PROFISSIONAIS E MODELOS DE NÍVEL'),
      p('A representação de competências e de níveis apoia-se em três conjuntos de referência: o Computer Science Curricula 2023, que organiza o conhecimento em áreas e unidades; o Guide to the Software Engineering Body of Knowledge, em sua quarta edição, que delimita as áreas de conhecimento da engenharia de software; e o Skills Framework for the Information Age, que descreve níveis de responsabilidade profissional. Para o formato dos descritores de capacidade, adota-se como referência a estrutura de autoavaliação por enunciados de capacidade do Quadro Europeu Comum de Referência para Línguas. Quanto aos limites da autoavaliação, considera-se a síntese de estudos que indica correlação modesta entre desempenho autoavaliado e medido (ZELL; KRIZAN, 2014), somada à descrição de Kahneman (2012) sobre a confiança sistemática que as pessoas depositam no próprio julgamento mesmo quando a evidência disponível é insuficiente. Daí a opção por tratar a autodeclaração como evidência de confiança limitada, e não como medida.'),
      h2('4.3 ROADMAPS E SEQUENCIAMENTO DE APRENDIZAGEM'),
      p('A formalização do que pode ser aprendido a seguir apoia-se na Teoria dos Espaços de Conhecimento, que representa o conhecimento como estados e relações de precedência entre itens, e define a fronteira de um estado como o conjunto de itens imediatamente acessíveis (DOIGNON; FALMAGNE, 1985; FALMAGNE; DOIGNON, 2011). Quanto à progressão pedagógica, consideram-se abordagens que estruturam a aprendizagem de programação em etapas de uso, modificação e criação, com evidência empírica de aplicação em ambiente escolar (SENTANCE; WAITE; KALLIA, 2019), e a discussão sobre os limites da instrução com orientação mínima para aprendizes iniciantes (KIRSCHNER; SWELLER; CLARK, 2006). Como referência de campo, adota-se o panorama das ciências da aprendizagem organizado por Sawyer (2014), que reúne trabalho interdisciplinar sobre progressões de aprendizagem e sobre o apoio que se retira gradualmente à medida que o aprendiz avança.'),
      p('A mesma formalização sustenta a decisão inversa, a de apontar o que não deve ser estudado agora: o que está fora da fronteira do estado atual depende de competências ainda ausentes, e apresentá-lo ao aprendiz acrescenta carga sem possibilidade de aproveitamento. Adiar deixa de ser omissão e passa a ser consequência da estrutura de precedência.'),
      p('Esse mesmo raciocínio orienta a composição dos recursos associados a cada competência. Tutoriais avulsos e respostas geradas sob demanda entregam fragmentos, cuja recomposição exige do leitor exatamente o repertório que ele ainda não tem; o livro oferece tratamento sequenciado e editado de um assunto inteiro, com a progressão já decidida por quem domina o campo. A preferência por material estruturado para aprendizes iniciantes é a mesma defendida por Kirschner, Sweller e Clark (2006), e sustenta a decisão de manter livros no catálogo em vez de reduzi-lo a conteúdo fragmentado de consumo rápido.'),
      h2('4.4 PERSONALIZAÇÃO E SISTEMAS DE RECOMENDAÇÃO'),
      p('A plataforma classifica-se como sistema de recomendação baseado em conhecimento, família adequada a cenários sem histórico de interação acumulado e que, por essa razão, não apresenta o problema da partida a frio (FELFERNIG et al., 2024). Para a avaliação centrada no usuário, adota-se o questionário ResQue, que organiza a percepção de qualidade em construtos de acurácia percebida, transparência, controle, utilidade, confiança e satisfação (PU; CHEN; HU, 2011). Quanto ao desenho experimental, considera-se a exigência de que as condições comparadas sejam equivalentes em tudo o que não constitui a variável manipulada (KNIJNENBURG; WILLEMSEN, 2015), reforçada pelos achados sobre viés de resposta que fundamentam os controles descritos na seção 3.3 (KOSCH et al., 2023; DELL et al., 2012).'),
      // ========================= REFERÊNCIAS ========================
      h1('REFERÊNCIAS'),
      ...REFERENCIAS.map((r) => new Paragraph({
        spacing: { line: 240, lineRule: LineRuleType.AUTO, after: 240, before: 0 },
        indent: { left: 0, firstLine: 0 }, alignment: AlignmentType.LEFT,
        children: [run(r)],
      })),
    ],
  }],
});

Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync('PROJETO_TCC_CAREER_GAP.docx', b);
  console.log('gerado');
});
