# Engineering Guide

> Rule book for Tử Vi Đẩu Số. Coding-standard entries below were defined via `/mango:codify`:
> mango counted the observed patterns, a human chose each going-forward standard, and the set was
> **ratified**. These rules are binding. mango's `reviewer`/`challenger` ground their findings in
> this file on every run.

## Contents
- [Architecture](#architecture)
- [Coding standards / Conventions](#coding-standards--conventions)
- [Security (must / never)](#security-must--never)
- [Data access](#data-access)
- [Error handling](#error-handling)
- [Testing & the Definition of Done](#testing--the-definition-of-done)

## Architecture
<!-- Observed: layout, entry points, module boundaries. -->
- **100% client-side.** No backend. All computation runs in the browser; AI features call external provider APIs directly from the client.
- **Layer split (observed):**
  - `src/core/**` — pure computation, **no React**.
  - `src/components/**` — React presentation, grouped by feature.
  - `src/pages/**` — route-level screens; `src/store/**` — Zustand stores; `src/data/**` — static data tables; `src/hooks/**`, `src/utils/**`.
- Entry: `src/main.tsx` → `src/App.tsx` (React Router 7 **HashRouter** for GitHub Pages SPA). Calendar & Compare pages are lazy-loaded.
- TODO: confirm the forbidden-dependency rule (e.g. `src/core/**` must never import from `components/`, `pages/`, or `store/`).

## Coding standards / Conventions
<!-- Observed: language(s), formatter/linter config, naming patterns. -->
- **Language:** TypeScript 5.9 (strict via `tsc -b`), React 19 function components + hooks.
- **Styling:** TailwindCSS 3, dark theme. Design tokens / direction live in `DESIGN.md`.
- **State:** Zustand 5 stores under `src/store/`.
- **Lint:** `npm run lint` (ESLint 9). **All user-facing UI text is Vietnamese with diacritics.**

Codified standards (`/mango:codify`, ratified):
- **Exports**: default export for React components/pages; **named** exports for everything in `src/core` and util/lib modules. (Observed: 42/42 components default, core 100% named.)
- **Component declaration**: components declared as **`function Name()`**. (Observed: all 34 components — matches existing code.)
- **Import paths**: **relative imports only** (`../`, `./`); no path alias. (Observed: 378 relative, 0 alias.)
- **Type declarations**: use `interface` for object/props shapes; reserve `type` for unions and aliases. (Observed: 97 interface, 21 type.)
- **File naming**: `src/core` & util files **camelCase** (`menhCung.ts`); component files **PascalCase** (`BatTuTab.tsx`).

## Security (must / never)
- AI provider API keys are user-supplied and stored client-side (`src/store/aiStore.ts`). NEVER log, commit, or transmit keys anywhere except the chosen provider endpoint.
- AI system prompts include anti-hallucination rules (`src/core/ai/prompts/systemPrompts.ts`) — new AI prompt paths must preserve them.
- **Logging**: `console.*` allowed only behind a dev/debug guard (e.g. `import.meta.env.DEV`) and stripped from production builds; no unconditional console logging in shipped code. (Observed: 0 console statements in `src` today.)
- NEVER: hardcode secrets; secrets live only in a gitignored `.env` / client-side user config, never in source or `.harness.json`.
- TODO: input-sanitisation expectations for the birth-info form.

## Data access
- **No database.** Static lookup data lives in `src/data/**` and `src/core/calendar/lunarData.ts` (hex-encoded 1900–2100).
- TODO: rule for changing the encoded lunar/astrology data tables — what validation must accompany it.

## Error handling
- React `ErrorBoundary` at `src/components/shared/ErrorBoundary.tsx`.
- **Core errors**: `src/core` functions `throw new Error` with a **Vietnamese user-facing message** on invalid input; callers (store/hooks/UI) catch and surface. (Observed: 9 core files follow this.)
- **Input validation (entry boundaries)**: validate inputs once at each **system entry boundary** — the birth-info form/store **and** the public core entry points outside code actually calls (e.g. `solarToLunar`, the chart builder, good-day picker, compare profile builder): date range 1900–2100, hour index 0–11, NaN guards; throw on violation. Internal pipeline helpers may assume already-validated input — do **not** re-guard them.
- TODO: how AI provider call failures must be surfaced to the user (`src/core/ai/callProvider.ts`).

## Testing & the Definition of Done
<!-- Observed: test runner / command. -->
- **Test runner:** Vitest 4. Run with `npm test` (`vitest run`). 201 tests across 12 files.
- Additional validation: `npm run validate` (full suite), `npm run quickcheck` (CLI chart check).
- Invariants worth a proving test: every chart yields exactly 14 main stars and 12 unique palaces; Solar→Lunar conversion cases.
- TODO: define what level of test a change requires (the proving test mango asks for).
- TODO: write the Definition of Done checklist (tests pass + lint clean + `tsc -b` clean + Vietnamese UI text reviewed).
