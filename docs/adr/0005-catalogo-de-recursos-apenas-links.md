# ADR-0005 — Catálogo de recursos: apenas links, com direitos verificados

**Status:** proposto · **Data:** 2026-09-10

## Contexto

Verificação das fontes sugeridas:

- **BibliotecaDev** (`github.com/KAYOKG/BibliotecaDev`): hospeda PDFs digitalizados de livros
  comerciais protegidos (Casa do Código, Fowler, Martin). É distribuição não autorizada.
- **roadmap.sh**: a licença proíbe explicitamente redistribuição do conteúdo fora do repositório.
- **free-programming-books**: índice CC BY; exige que o material listado seja de acesso livre e
  recomenda linkar sempre a fonte mais autoritativa.
- **CS50**: CC BY-NC-SA 4.0 — link é livre; reuso comercial e derivados, não.
- **refactoring.guru**: uso de conteúdo restrito; no máximo 10 ilustrações mediante condições.

## Decisão

- O catálogo armazena **metadados + URL canônica da página do detentor dos direitos**.
  Nada é hospedado, espelhado, embutido ou reproduzido.
- **BibliotecaDev não é usado** como fonte nem como destino de link.
- roadmap.sh entra apenas como **trabalho relacionado** na escrita acadêmica, citado, nunca copiado.
- Cada recurso registra `licença`, `custo`, `idioma` e `fonte`, e é vinculado a
  (competência, nível, tipo de ação).
- Prioridade de autoridade: documentação oficial > site do autor/editora > terceiros.

## Consequências

- O produto permanece viável comercialmente depois do TCC (nenhuma dependência de conteúdo
  com cláusula não comercial embutida no sistema).
- O baseline do experimento precisa ser construído com o **nosso próprio catálogo** — o que
  por acaso é o desenho experimental mais limpo (ADR-0007).
- Cobertura em português é desigual; a UI informa o idioma do recurso.
