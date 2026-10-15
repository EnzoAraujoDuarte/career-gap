# Career Gap — Agent Engineering Instructions

## Source of truth

Before implementing anything, read:

1. `INITIAL_SCOPE.md`
2. `SYSTEM_SPEC.md`

`INITIAL_SCOPE.md` defines the current implementation boundary.
`SYSTEM_SPEC.md` defines the long-term product vision.

Do not implement long-term features unless explicitly requested.

## Engineering principles

- Prefer the simplest solution that correctly solves the current problem.
- Follow **KISS**: do not introduce complexity without a concrete need.
- Follow **YAGNI**: do not build infrastructure or abstractions for hypothetical future requirements.
- Follow **DRY** pragmatically: remove meaningful duplication, but do not create premature abstractions just to eliminate a few repeated lines.
- Prefer explicit, readable code over clever code.
- Code should explain its own intent through naming and structure.
- Use descriptive names for variables, functions, classes, components, hooks, services and domain concepts.
- Comments are allowed when they explain WHY, constraints, trade-offs or non-obvious behavior. Do not narrate obvious code.
- Keep functions/components focused.
- Preserve existing good patterns before introducing new ones.
- Avoid large rewrites unless the current architecture clearly prevents the required change.
- Avoid speculative generic frameworks.
- Do not add dependencies when the platform/framework already solves the problem adequately.

## Architecture

Career Gap is a domain-driven product, not an LLM wrapper.

Keep these concerns conceptually separate:

- user/profile assessment;
- skills and skill levels;
- career targets;
- skill relationships;
- gap calculation;
- prioritization;
- roadmap generation;
- resource catalog;
- AI interpretation/explanation;
- UI.

Core career rules must be testable without an LLM.

LLM integrations should sit behind explicit interfaces/adapters. Do not scatter prompts across UI components.

Prefer a modular monolith for the TCC. Do not introduce microservices, queues, event buses or graph databases unless a current requirement proves they are necessary.

## Data and domain rules

- Do not invent skill levels silently.
- Do not let UI state become the source of truth for domain decisions.
- Recommendation results should include reasons whenever possible.
- Preserve traceability between target requirement → gap → priority → roadmap item.
- Keep structured data structured. Do not store important domain state only inside generated prose.
- Treat AI output as untrusted input: validate and normalize structured responses.

## Quality

Before considering a task complete:

- verify the happy path;
- verify important empty/error/loading states;
- check type/lint/test failures if the project has those tools;
- test domain rules independently where practical;
- remove dead code and debug output;
- ensure no secret/API key is committed;
- ensure the implementation still matches `INITIAL_SCOPE.md`.

## Frontend direction

The Career Gap UI should feel like a technical career map drawn by a thoughtful mentor on a whiteboard.

Primary visual reference: **the visual language of Excalidraw-style diagrams**, not the Excalidraw application UI itself.

Desired characteristics:

- large navigable canvas;
- nodes and connectors;
- organic/hand-drawn line quality;
- subtle visual imperfection;
- off-white/paper-like background;
- near-black primary text;
- restrained semantic accents;
- annotations around the map;
- clear hierarchy;
- whitespace;
- visually understandable paths and branches.

Avoid:

- generic SaaS dashboard layouts;
- purple/blue AI gradients;
- excessive rounded cards;
- glassmorphism by default;
- card-inside-card patterns;
- unnecessary sidebars;
- dozens of KPI widgets;
- decorative animations with no purpose;
- making every element look hand-drawn to the point of harming readability.

## Typography

Use two typographic roles:

1. A highly legible UI/body typeface.
2. A handwritten/sketch-like typeface for map labels, annotations and selected headings.

The handwritten font should evoke technical whiteboard notes without sacrificing readability.

Do not use the sketch font for long paragraphs, forms or dense content.

When selecting actual fonts, verify licensing and web availability before adding them.

## Color direction

Use design tokens/CSS variables.

Starting semantic direction:

- canvas/background: warm off-white;
- primary ink: near-black;
- secondary ink: neutral gray;
- completed: muted green;
- action/resource: blue;
- critical gap/blocker: red;
- attention/reassess: warm yellow/orange;
- future/not-now: subdued gray.

Exact values should be tuned visually rather than copied blindly from Excalidraw.

Color must carry meaning; do not use many colors only for decoration.

## Roadmap canvas

The roadmap is the visual centerpiece.

It should support, when technically reasonable:

- pan;
- zoom;
- fit-to-view;
- selected node;
- focus/current node;
- connectors;
- branches;
- completed/current/next/future/blocked states;
- annotations such as `YOU ARE HERE`, `NEXT`, `WHY?`, `NOT NOW`.

The user should immediately understand:

- where they are;
- where they are going;
- what comes next.

Do not sacrifice this clarity for visual novelty.

## Interaction

- Motion should explain state changes or spatial relationships.
- Keep transitions quick and restrained.
- Respect reduced-motion preferences.
- Preserve keyboard accessibility where applicable.
- Interactive nodes must have clear hover/focus/selected states.
- Canvas navigation must not trap the user.

## Frontend skills and design references

When available, use these design skills during UI work:

### Anthropic Frontend Design

Official source:
`https://github.com/anthropics/skills/tree/main/skills/frontend-design`

Use it to force deliberate visual direction, typography, hierarchy and non-generic product design.

### Impeccable

Official source:
`https://github.com/pbakaus/impeccable`

Use it for design critique, polishing, hierarchy, spacing, accessibility, responsive behavior, UX states and detection of generic AI frontend patterns.

Recommended workflow when the skill is installed:

- initialize product/design context;
- build the core interaction;
- run design critique/audit;
- polish only after functionality works.

Do not blindly follow any skill when it conflicts with Career Gap's product requirements.

## Visual implementation guidance

For a whiteboard-like canvas, evaluate libraries only after checking project needs. Possible categories include:

- node/edge graph/canvas libraries;
- SVG connectors;
- rough/hand-drawn rendering;
- custom React canvas/SVG.

Do not select a heavy library simply because it resembles Excalidraw. Evaluate:

- pan/zoom quality;
- node positioning;
- custom node rendering;
- edge customization;
- accessibility;
- bundle/runtime cost;
- implementation time.

For the TCC, a convincing and stable approximation is better than recreating Excalidraw.

## Scope discipline

Before implementing a feature, ask:

1. Is it required by `INITIAL_SCOPE.md`?
2. Does it help assess current state, target, gaps, roadmap or evaluation?
3. Will it materially improve the TCC demonstration or user test?

If all answers are no, do not implement it unless explicitly requested.
