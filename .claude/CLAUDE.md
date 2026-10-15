# Career Gap — Claude Code Instructions

## Start here

Always read these files before planning significant work:

- `INITIAL_SCOPE.md` — current TCC/MVP scope and highest priority.
- `SYSTEM_SPEC.md` — complete long-term Career Gap vision.
- `.agents/AGENTS.md` — shared engineering and design rules.
- `docs/DISCOVERY.md` — Phase 1 output: domain model, engine design, build order, open decisions.
- `docs/adr/` — formal architecture decisions (short; read the ones you are about to touch).
- `docs/research/SOURCES.md` — vetted sources, including content that must NOT be used.
- `docs/PLANO-DIRECAO.md` — Phase 2 direction plan (resource layer, node card, stack choice),
  already corrected by adversarial critique. Read §4 before implementing anything from it.
- `docs/DECISOES.md` — the three open questions, decided on evidence. **Overrides
  `PLANO-DIRECAO.md` and ADR-0007 where they conflict.**
- `docs/adr/0008-fluxo-vertical-sem-canvas.md` — current visual direction. **Supersedes
  ADR-0006 and the whiteboard/canvas rules in this file.**
- `docs/TCC-ORIENTACAO.md` — the seven fronts the advisor asked for, written as academic text.

If the files conflict, use this priority:

1. explicit current user instruction;
2. `INITIAL_SCOPE.md`;
3. `docs/DISCOVERY.md` and `docs/adr/`;
4. `.agents/AGENTS.md`;
5. `SYSTEM_SPEC.md`.

`docs/DISCOVERY.md` details and refines `INITIAL_SCOPE.md`. Items it marks as **MUDANÇA** are
proposed changes to the documented scope — treat them as approved only once the user has said so.

## How to work

Before coding:

1. inspect the existing repository structure;
2. identify existing conventions and reusable patterns;
3. understand the smallest change that solves the request;
4. avoid redesigning architecture without necessity;
5. state a short implementation plan internally, then execute it.

Do not spend the response explaining what you could implement when the user asked you to implement it. Make the change, validate it, then summarize briefly.

## Code standards

- Clean, readable and self-explanatory code.
- Descriptive naming.
- DRY, KISS and YAGNI.
- Prefer composition over unnecessary inheritance.
- Prefer small cohesive modules over god objects/components.
- Avoid premature abstraction.
- Avoid unnecessary comments.
- Comment trade-offs, constraints and non-obvious reasons, not syntax.
- Follow the repository's established patterns when they are sound.
- Do not create duplicate architectural approaches for the same problem.
- Remove unused code after refactors.

## Career Gap domain rules

Never reduce the product to:

`user answers → LLM prompt → roadmap text`.

The implementation must preserve structured concepts for:

- skills;
- skill levels;
- target requirements;
- user estimates;
- gaps;
- priorities;
- roadmap items;
- recommendation reasons;
- resources.

AI may interpret and explain, but deterministic/structured domain logic must control the core roadmap.

Recommendations should be explainable.

Prefer storing:

```text
recommendation
reason
source gap
priority
prerequisites
status
```

over storing only generated prose.

## Current scope guard

Do not proactively implement:

- CV analysis;
- LinkedIn analysis;
- GitHub profile analysis;
- Senior/Tech Lead/Architect full tracks;
- job scraping;
- market intelligence;
- consulting track;
- Skill Passport;
- community features;
- mobile app;
- microservices;
- graph database.

The current TCC should focus on early-career development users and prove:

`assessment → gap identification → prioritized roadmap → useful/coherent recommendation`.

## UI identity

> **Atualizado em 2026-09-16 pela ADR-0008.** O canvas com pan/zoom foi substituído por um
> fluxo vertical editorial, mobile primeiro. A metáfora do quadro branco sobrevive apenas na
> **voz da anotação** (`← você está aqui`, `← comece aqui`, `não agora`) e no papel/tinta.
> Não reintroduzir canvas, pan/zoom ou traço desenhado sem revisar a ADR-0008.

Career Gap must not look like a generic AI SaaS dashboard.

The historical metaphor below is kept for context; the current direction is the editorial
vertical flow described in ADR-0008.

Think:

- Excalidraw-like visual language;
- mentor sketching a path;
- connected nodes;
- arrows;
- branches;
- annotations;
- paper/off-white canvas;
- restrained red/blue/green/yellow accents;
- hand-written labels paired with readable UI typography.

Do not clone Excalidraw's application chrome or toolbar.

The Career Gap visual identity should be its own product.

## Required design behavior

For frontend implementation, when the skills are available, use:

- `frontend-design` from Anthropic;
- `impeccable` from pbakaus.

Anthropic Frontend Design:
`https://github.com/anthropics/skills/tree/main/skills/frontend-design`

Impeccable:
`https://github.com/pbakaus/impeccable`

Use them to improve intentionality, typography, layout, hierarchy, responsive behavior, accessibility and polish.

Do not let a design skill override the whiteboard/career-map product direction.

## Visual rules

### Canvas

- warm off-white background;
- generous whitespace;
- subtle paper/diagram feeling if performance allows;
- clear pan/zoom behavior;
- avoid visual clutter.

### Nodes

Nodes should look like diagram elements rather than standard SaaS cards.

Support clear states:

- completed;
- current;
- next;
- future;
- blocked;
- not-now.

Use shape, stroke, annotation and color together; do not rely only on color.

### Connectors

Prefer slightly organic/sketched connectors where technically reasonable.

Arrows must make sequence obvious.

### Typography

Use readable UI typography for body/forms/details.

Use a hand-drawn/sketch typeface selectively for:

- roadmap node titles;
- labels;
- annotations;
- `YOU ARE HERE`;
- `NEXT`;
- `WHY?`;
- `NOT NOW`.

Verify font licensing before committing external fonts.

### Colors

Use semantic tokens rather than hardcoded scattered values.

Direction:

```text
background     warm off-white
ink            near-black
secondary      neutral gray
completed      muted green
next/action    blue
critical       red
attention      yellow/orange
future         subdued gray
```

Do not copy exact Excalidraw colors unless there is a documented reason.

## UX priorities

At any point on the roadmap, the user should be able to answer:

1. Where am I?
2. Where am I going?
3. What should I do next?
4. Why is that next?
5. What can I ignore for now?

If a visual change makes those answers harder, reject the change.

## Validation before finishing frontend work

Check:

- desktop layout;
- smaller viewport;
- loading state;
- empty state;
- error state;
- keyboard/focus behavior where relevant;
- canvas navigation;
- text readability;
- no overlapping labels/connectors in common cases;
- no generic placeholder copy left behind;
- no obvious AI-generated UI clichés.

Then use Impeccable audit/critique/polish workflows when available.

## Academic constraint

This is a TCC system. Features must remain demonstrable, explainable and evaluable.

Prefer a smaller mechanism that can be justified in the written methodology over a sophisticated black box that cannot be explained.

When implementing recommendation logic, preserve enough metadata that the final paper can explain:

- how current state was estimated;
- how target requirements were represented;
- how gaps were calculated;
- how priorities were calculated;
- how the roadmap was assembled;
- where AI was used;
- where deterministic rules were used.
