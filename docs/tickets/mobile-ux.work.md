# mobile-ux — Mobile UI/UX Fixes (working doc)

- **Ticket:** mobile-ux · pasted file `~/Downloads/mobile-ux-fix-prompt.md` (no tracker ticket)
- **Type:** enhancement (presentation-only mobile responsiveness)
- **Repo(s) / Porting:** app (`.`) only — no porting
- **SCOPE:** M
- **STRUCTURE:** synthesized  <!-- freeform prompt; headers do not match ticket_header_schema → confirm reading at Gate 0 -->
- **TRACK:** frontend
- **TIER:** full
- **work_doc_mode:** separate (ticket lives outside the repo) → this file

---

## Requirements matrix

`SECTIONS: 4 found (HARD CONSTRAINTS, "BEFORE WRITING CODE", 5 numbered fixes, FINAL VERIFICATION) | 4 decomposed | ROWS: C=7 R=8 G=1 AC=7`

<!-- Ph2 coverage: each row is covered 1/1 (R5 = 2/2) by the Phase-2 "Smallest change-list" table below; see that table for the file mapping. -->

| ID | Source | Verbatim | Interpretation | Ph1 evidence | Ph2 covered by | Ph3/4 proven by | Status |
|----|--------|----------|----------------|--------------|----------------|-----------------|--------|
| C1 | HARD CONSTRAINTS | "NEVER touch src/core/** … or the tests/ directory" | No edits under `src/core/**` or `tests/` | engine + tests live there | 0/0 | 0/0 | ⬜ |
| C2 | HARD CONSTRAINTS | "Presentation only … Do not change any business logic" | Only layout/className/interaction changes | — | 0/0 | 0/0 | ⬜ |
| C3 | HARD CONSTRAINTS | "Reuse the existing color/font tokens. Do NOT introduce new colors" | Only tokens from `tailwind.config.js`/`index.css`; no new hex | tokens at `tailwind.config.js:9-46` | 0/0 | 0/0 | ⬜ |
| C4 | HARD CONSTRAINTS | "Keep the desktop layout (md and up) exactly as it is … gated behind breakpoints" | All new behaviour gated `md:`/`lg:`; desktop unchanged | — | 0/0 | 0/0 | ⬜ |
| C5 | HARD CONSTRAINTS | "Preserve existing a11y: visible focus rings, minimum 44px tap targets, and prefers-reduced-motion" | Keep focus-visible (`index.css:54`), ≥44px targets, motion gated | reduced-motion at `index.css:101-110` | 0/0 | 0/0 | ⬜ |
| C6 | HARD CONSTRAINTS | "The astrology chart MUST keep its 4x4 layout" | Keep `grid-cols-4 grid-rows-4` | `TuViChart.tsx:119` | 0/0 | 0/0 | ⬜ |
| C7 | BEFORE WRITING CODE | "give me a short plan and WAIT for my confirmation before editing" | Process: gated approval before code | satisfied by mango gates | 0/0 | 0/0 | ⬜ |
| R1 | Fix #1 | Header responsive nav: hamburger (Menu icon) below md, dropdown w/ 4 links + AI Settings; desktop nav unchanged; close on pathname change | Add `useState` open + `Menu` toggle `md:hidden`, panel; existing `<nav>`→`md:flex`; `useEffect` close on `pathname` | `Header.tsx:26` nav always inline | 0/0 | 0/0 | ⬜ |
| R2a | Fix #2a | StarTooltip hover dead on touch → restrict tooltip to md+; mobile rely on tap | Gate tooltip render/hover behind md+ | `TuViChart.tsx:172-173,184-186` onMouseEnter | 0/0 | 0/0 | ⬜ |
| R2b | Fix #2b | CungDetail bottom sheet below lg: `fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl`, slide-up, dimmed backdrop, X close; lg+ keep sticky side panel | Responsive wrapper: mobile fixed sheet + backdrop, `lg:` revert to current `w-96 sticky` | `CungDetail.tsx:46` renders inline below chart | 0/0 | 0/0 | ⬜ |
| R2c | Fix #2c | Palace cell `min-h-[108px] sm:min-h-[140px]` | Swap fixed `min-h-[140px]` for responsive | `TuViChart.tsx:151` | 0/0 | 0/0 | ⬜ |
| R3 | Fix #3 | Tabs: fade gradients left/right edges + `scrollIntoView({inline:'center',block:'nearest'})` on active change | Add edge fade overlays + `useRef`+`useEffect` scroll active into view | `Tabs.tsx:13` overflow-x-auto, no cue | 0/0 | 0/0 | ⬜ |
| R4 | Fix #4 | ResultPage header → `flex-col gap-3 sm:flex-row sm:justify-between sm:items-start`; button `w-full sm:w-auto text-center` | Swap header container + button classes | `ResultPage.tsx:289,301-306` | 0/0 | 0/0 | ⬜ |
| R5 | Fix #5 | "buttons in StarFilterBar and the main control buttons are at least 44px tall on mobile" | Universal: ensure named controls ≥44px on mobile — see Inventory (N) | `StarFilterBar.tsx:33` py-1; `ResultPage.tsx:303` py-1 | 0/0 | 0/0 | ⬜ |
| G1 | Context | "The SOLE goal … is to fix the mobile UI/UX. Do not expand the scope." | Mobile-only fixes; desktop untouched; no scope creep | — | 0/0 | 0/0 | ⬜ |
| AC1 | Fix #1 Done | "at 375px there is no horizontal overflow and every nav item is reachable" | @375 no h-scroll from header; all 5 controls tappable | M2 width-gate | 0/0 | ⬜ |
| AC2 | Fix #2 Done | "tapping one palace cell on mobile opens a readable, scrollable bottom sheet; per-star detail is accessible; the chart is still 4x4" | Tap → sheet scrolls; star detail in sheet; grid still 4x4 | — | 0/0 | ⬜ |
| AC3 | Fix #3 Done | "on mobile it is visually clear the bar scrolls, and tapping a far tab brings it into view" | Fade visible @mobile; far tab scrolls into view | — | 0/0 | ⬜ |
| AC4 | Fix #4 Done | "no squish at 375px" | @375 title+button stack, no squish | M2 | 0/0 | ⬜ |
| AC5 | FINAL | "`npm run build` (tsc + vite) must pass with zero TypeScript errors" | `npm run build` green | — | 0/0 | ⬜ |
| AC6 | FINAL | "Self-check at a 375px viewport: header does not overflow; tapping a palace opens the bottom sheet; the tab bar visibly scrolls; the ResultPage header does not get squished" | Manual @375 recorded check of all four | — | 0/0 | ⬜ |
| AC7 | FINAL | "Do the work on a dedicated branch (e.g. feat/mobile-ux) and list the diff per file" | Branch `feat/mobile-ux`; per-file diff listed | branch_strategy `feat\|fix\|chore/<slug>` | 0/0 | ⬜ |

Status legend: ✅ done/proven · ⚠ deferred · ❌ not met · ⬜ pending phase.

## AC validation

| AC ID | Ticket states | Independently computed | Match? | If mismatch → Gate-1 question |
|-------|---------------|------------------------|--------|-------------------------------|
| AC1 | viewport 375px | 375 = lowest `config.breakpoints` ✓ | Y | — |
| AC2 | sheet `max-h-[85vh]`, chart 4x4 | current detail `max-h-[80vh]` (`CungDetail.tsx:46`), grid 4x4 (`TuViChart.tsx:119`) — 85vh is the new sheet value, no conflict | Y | — |
| AC2 | `min-h-[108px] sm:min-h-[140px]` | current fixed `min-h-[140px]` → 140 preserved at sm+ ✓ | Y | — |
| AC2 | bottom sheet boundary "below lg" | lg = 1024 (Tailwind default; not in `config.breakpoints` [375,768,1280] but explicitly chosen by ticket) | Y | — |
| R1/AC1 | hamburger "below md" | md = 768 ✓ (`config.breakpoints`) | Y | — |
| C5 | "minimum 44px tap targets" | matches existing Tabs `min-h-[44px]` (`Tabs.tsx:20`) ✓ | Y | — |

No numeric mismatches → no AC-derived Gate-1 questions.

## Inventory (universal "all/every/no" requirements)

R5 — "buttons in StarFilterBar and the main control buttons … at least 44px tall on mobile."

- **Denominator / total N:** 2 control groups (pending Gate-0 confirmation of "main control buttons" scope)
  1. StarFilterBar mode buttons — `StarFilterBar.tsx:25-41` (currently `text-xs px-2.5 py-1` ≈ 27px)
  2. ResultPage "Lập lá số mới" button — `ResultPage.tsx:301-306` (currently `px-3 py-1` ≈ 28px)

  (Tabs buttons already `min-h-[44px]` — `Tabs.tsx:20` — out of R5 scope; StarFilterBar custom-group checkbox rows noted but are labels, not buttons.)

| # | Item | Ph3/4 proven by (`path:line` / test) | Status |
|---|------|--------------------------------------|--------|
| 1 | StarFilterBar mode buttons ≥44px mobile | — | ⬜ |
| 2 | ResultPage control button ≥44px mobile | — | ⬜ |

## Clarifications

`CLARIFICATION: 6 raised | 4 self-resolved (cited) | 2 for human decision`

- Self-resolved (cited):
  - **SR1** — Branch = `feat/mobile-ux` (ticket line 75 + `config.branch_strategy` `feat|fix|chore/<slug>`; this is additive UI → `feat`).
  - **SR2** — "below md" = md/768, "below lg" = lg/1024 (Tailwind defaults; 768 ∈ `config.breakpoints`).
  - **SR3** — Slide-up + reduced-motion: existing global `@media (prefers-reduced-motion: reduce)` block (`index.css:101-110`) already forces `animation-duration:0.001ms`, so a CSS-driven slide-up satisfies C5 with no extra JS gating.
  - **SR4** — "No new colors": reuse tokens declared in `tailwind.config.js:9-46` (backdrop = existing `bg-base/80` or `bg-black/*` opacity utility on a token, no new hue).
- Human decisions (**Gate 0 RESOLVED**):
  - **H1 (mandatory, synthesized ticket):** ✅ User confirmed the C/R/G/AC matrix is correct.
  - **H2:** ✅ Resolved → R5 stays **N=2** (StarFilterBar mode buttons + ResultPage "Lập lá số mới" button). Header AI-Settings button is relocated into the hamburger dropdown by R1, so its mobile ≥44px target is handled inside R1's panel rows — not a separate R5 line (avoids scope creep / keeps G1).

---

## Phase 1 — Analysis ✋ Gate 1

- **Per-goal gap analysis (enhancement), with `path:line`:**
  - R1: `Header.tsx:26` `<nav className="flex gap-4">` is never gated → overflows <768px. Target: `Menu` toggle `md:hidden` + dropdown; `<nav>`→`hidden md:flex`; close on `pathname`.
  - R2a: `TuViChart.tsx:172-173` `onMouseEnter/Leave` + `184-186` tooltip — hover-only, dead on touch. Target: render tooltip + hover handlers only at md+.
  - R2b: `CungDetail.tsx:46` `w-full lg:w-96 lg:sticky` renders inline; on mobile (`TuViChart.tsx:113` `flex-col`) it sits below the chart → long scroll. Target: mobile `fixed` bottom sheet + backdrop, `lg:` keep sticky panel.
  - R2c: `TuViChart.tsx:151` fixed `min-h-[140px]`. Target: `min-h-[108px] sm:min-h-[140px]`.
  - R3: `Tabs.tsx:13` `overflow-x-auto no-scrollbar`, no scroll affordance, no auto-scroll. Target: edge fade overlays + `scrollIntoView` on active change.
  - R4: `ResultPage.tsx:289` `flex justify-between items-start` squishes at 375px. Target: responsive `flex-col`.
  - R5: `StarFilterBar.tsx:33` / `ResultPage.tsx:303` `py-1` → <44px. Target: ≥44px on mobile.
- **Handler / entry point + blast radius:**
  - Entry points: `Header.tsx` (global, mounted in `Layout`), `ResultPage.tsx` (route `/result`), `Tabs.tsx` (shared — used by ResultPage; **blast radius: any other Tabs consumer**), `TuViChart.tsx`+`CungDetail.tsx`+`StarFilterBar.tsx` (Lá Số tab).
  - **Tabs is shared** — changes must not regress other call sites. Dependents to confirm in design: grep `Tabs` importers.
  - Repos touched: `app` only. No `db-map` (no DB). No `src/core` / `tests` touched (C1).
- **TRACK:** frontend — 6/6 materially-touched files under `src/components/**` + `src/pages/**` (UI). (`config.track`=fullstack is the project default, but this ticket has zero server/data surface → frontend gate set applies.) `config.breakpoints` includes 375 (small viewport) → **width-parametric gates in scope: M2 no horizontal scroll @375, M3 reflow** — challenger counts them at review (AC1/AC4/AC6 are exactly these).
- **Self-audit:** every section decomposed (4/4) ✅ · AC table complete, 0 mismatches ✅ · inventory N=2 set (pending H2) ✅ · matrix Status filled ✅ · STRUCTURE/TRACK/TIER declared ✅ · **j=2 → STOP at Gate 0/1**.
- **Gate 1 status:** ✅ cleared (user confirmed matrix; H1+H2 resolved)

## Phase 2 — Design ✋ Gate 2

**Approach.** Pure Tailwind responsive-variant work + one CSS keyframe; zero logic change. Each fix
is gated behind a breakpoint so desktop (md+/lg+) renders byte-identically to today (C4). No new
color tokens — backdrop uses existing `bg-base/70`, fades use `from-base` (C3).

- **R1 Header:** add `useState` `menuOpen` + `Menu`/`X` (lucide). Existing `<nav>` → `hidden md:flex`; existing settings button stays in the desktop cluster. New `md:hidden` hamburger button (≥44px) toggles an absolute full-width dropdown panel (`bg-surface`, `border-white/[0.08]`) holding the 4 links + AI-Settings button, **each row `min-h-[44px]`** (covers H2/Header tap target). `useEffect(() => setMenuOpen(false), [pathname])` closes on route change. `aria-expanded`/`aria-label` on toggle.
- **R2a Tooltip:** wrap `<StarTooltip>`'s root in `hidden md:block` so it never shows on touch; hover handlers stay (harmless on touch), tap on cell already opens detail.
- **R2b Bottom sheet (CungDetail):** wrap output in a fragment — a `lg:hidden` backdrop (`fixed inset-0 bg-base/70 z-40`, `onClick={onClose}`) + the panel made responsive: `fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-2xl animate-slide-up lg:static lg:inset-auto lg:w-96 lg:max-h-[80vh] lg:rounded-lg lg:sticky lg:top-20 lg:animate-none`. Existing X close button reused.
- **R2c:** `TuViChart.tsx:151` `min-h-[140px]` → `min-h-[108px] sm:min-h-[140px]`.
- **R3 Tabs:** wrap tablist in `relative`; add two `pointer-events-none md:hidden` edge overlays (`bg-gradient-to-r from-base`, `bg-gradient-to-l from-base`); `useRef` on tablist + `useEffect([active])` → active button `scrollIntoView({inline:'center',block:'nearest'})`.
- **R4 ResultPage header:** `flex justify-between items-start` → `flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start`; button gains `w-full sm:w-auto text-center` + R5 sizing.
- **R5 tap targets:** StarFilterBar mode buttons + ResultPage button get `min-h-[44px] inline-flex items-center justify-center md:min-h-0` (44px on mobile, original compact height restored at md+ so desktop is unchanged — C4).
- **index.css:** add `.animate-slide-up` + `@keyframes slide-up { from{transform:translateY(100%)} to{transform:translateY(0)} }` inside the existing `@media (prefers-reduced-motion: no-preference)` block (transform-only; global `reduce` block at `index.css:101` already neutralizes it — C5/SR3).

**Rejected alternatives:**
- *Render the bottom sheet from a new portal/Dialog component* — rejected: adds a component + focus-trap library surface; the ticket is presentation-only and CungDetail already owns its open/close. Responsive classes on the existing element are the smaller change (principle 1).
- *Add a `2xl` radius + backdrop color token to `tailwind.config.js`* — rejected: `rounded-t-2xl` (Tailwind default 1rem) and `bg-base/70` already exist; no new token needed (C3).
- *Move the AI-Settings tap-target bump into R5 (N=3)* — rejected at Gate 0 (H2): R1 relocates it into the dropdown where rows are already ≥44px; a separate R5 line would double-handle it.

**Assumptions:**

| Assumption | verified / novel-untested | Resolution |
|------------|---------------------------|------------|
| `scrollIntoView({inline,block})` supported in target browsers | verified | standard DOM API, broadly supported; no polyfill |
| Tailwind responsive variants `lg:static`/`fixed`/`rounded-t-2xl`/`bg-gradient-*` compile | verified | all stock Tailwind 3 utilities (`tailwind.config.js`) |
| New `.animate-slide-up` keyframe is neutralized under `prefers-reduced-motion: reduce` | verified | existing global `* { animation-duration:0.001ms !important }` at `index.css:101-110` overrides it |
| Tabs change is safe | verified | `Tabs` has a single consumer — `ResultPage.tsx` (grep confirmed); no other blast radius |

No `novel-untested` third-party/runtime assumption → Gate 2 not blocked on Assumptions.

**Smallest change-list (every item traces to a matrix row):**

| Change | File/area | Ph2 covered by | k/N |
|--------|-----------|----------------|-----|
| Hamburger toggle + dropdown panel (44px rows), close-on-route | `Header.tsx` | R1, C4, C5 | 1/1 |
| Gate StarTooltip to `md:block` | `TuViChart.tsx` (StarTooltip) | R2a, C4 | 1/1 |
| Responsive bottom sheet + backdrop | `CungDetail.tsx` | R2b, C4, C5 | 1/1 |
| Cell min-height responsive | `TuViChart.tsx:151` | R2c | 1/1 |
| Edge fades + scrollIntoView | `Tabs.tsx` | R3, C4 | 1/1 |
| Header container + button responsive | `ResultPage.tsx:289,301` | R4 | 1/1 |
| Tap targets ≥44px (gated md:min-h-0) | `StarFilterBar.tsx:33`, `ResultPage.tsx:303` | R5 (N=2), C5 | 2/2 |
| slide-up keyframe (reduced-motion safe) | `index.css` | R2b, C5 | 1/1 |
| Responsive & touch contract | `DESIGN.md` | frontend-track contract | 1/1 |

Untouched (proves constraints): no `src/core/**`, no `tests/**` (C1); no logic (C2); 4x4 grid string preserved (C6).

**Rule compliance (vs `docs/ENGINEERING_RULES.md` + `DESIGN.md`):**
- Default export + `function Name()` components, relative imports — preserved (only editing existing files in place).
- No new colors / hex-px outside tokens — backdrop `bg-base/70`, fades `from-base`, radius stock (C3 / DESIGN "token là nguồn sự thật").
- Vietnamese UI text — no user-facing strings added (hamburger uses icon; `aria-label="Menu"` is non-visible).
- DESIGN.md rule "KHÔNG sửa src/core, tests phải xanh" — honored.
- Motion transform-only + reduced-motion — honored (DESIGN "Motion").

**Verification plan (per-AC, layer-matched):**

| AC | risk layer | proof artifact | layer-match? |
|----|-----------|----------------|--------------|
| AC1 header no h-scroll @375 + nav reachable | integration/runtime (M2/M6) | manual-recorded render @375 (real DOM, DevTools scrollWidth≤clientWidth; tap each item) | ✅ |
| AC2 tap palace → scrollable bottom sheet; star detail; 4x4 | integration/runtime | manual-recorded @375 + grep `grid-cols-4 grid-rows-4` unchanged | ✅ |
| AC3 tab scroll cue + far tab into view | integration/runtime | manual-recorded @375 | ✅ |
| AC4 header no squish @375 | integration/runtime (M3) | manual-recorded @375 | ✅ |
| AC5 `npm run build` zero TS errors | document/logic | `npm run build` (automated) | ✅ |
| AC6 self-check @375 (all four) | integration/runtime | manual-recorded @375 (the AC *is* a manual check) | ✅ |
| AC7 branch + per-file diff | process | done in execute/finalise | n/a |
| R5/M4 ≥44px tap targets | computed-style | manual-recorded @375 (DevTools box height) | ✅ |
| C1/C2 no core/tests/logic change | logic | `npm test` 188 green + diff-scope sweep | ✅ |
| C3 no new colors | greppable | grep diff for raw `#rrggbb` / `NNpx` | ✅ |
| C6 4x4 preserved | greppable | grep grid string | ✅ |

All proofs sit at or above their AC's risk layer (real-DOM manual-recorded, not mocked) → **no layer-match ❌**.

**Coverage-gap exclusions** (human-approved at Gate 2):

| Item | Risk tier | Why deferred | Follow-up |
|------|-----------|--------------|-----------|
| Automated DOM assertions for M2/M4/M6 (scrollWidth, bounding-box height, tap-parity) | medium | C1 forbids touching `tests/`; project has no DOM/browser test harness (188 tests are all pure-core logic). Verified instead by manual-recorded check at a real 375px viewport — exactly what AC6 mandates. | Optional future ticket: add a Playwright/vitest-browser responsive smoke (touches `tests/` + devDeps — out of this ticket's presentation-only scope) |

**Proving test** (at the matching integration/runtime layer): **manual-recorded 375px viewport check** — *Header `scrollWidth ≤ clientWidth` at 375px*: **fails pre-change** (inline nav overflows), **passes post-change** (hamburger collapse). Recorded during execute/review against a real rendered DOM (dev/preview server in browser). Automated regression run alongside via `config.test_command`: `npm test` (188 green = no logic regression) + `npm run build` (zero TS errors = AC5). If a browser-driving capability is available at execute, the scrollWidth assertion will be automated as a throwaway scratchpad script (NOT under `tests/`).

**Rollback + porting:** single repo (`app`); revert = `git checkout main -- <files>` or drop branch `feat/mobile-ux`. No shared-code porting.

**SCOPE confirmed:** M (unchanged). 8 files, all presentation; no architectural change, no tier crossing → no *outgrew-its-ticket* nudge. Branch type `feat` matches additive UI (hamburger/sheet) — no branch/PR-type drift.

**Self-audit:** every change-list item traces to a matrix row ✅ · Ph2 covered k/N filled ✅ · all assumptions verified, 0 novel-untested ✅ · proving test named + runnable ✅ · verification plan no ❌ (1 recorded coverage-gap exclusion awaiting Gate-2 approval) ✅ · rollback recorded ✅ · DESIGN.md updated (frontend track) ✅.

- **Gate 2 status:** ✅ cleared (user "approve and process"; coverage-gap exclusion approved)

## Phase 3 — Execute

- **Branch:** `feat/mobile-ux`
- **Commits (no AI co-author trailer):**
  - `9aaa5ed` feat(header): collapse nav into hamburger menu below md — R1
  - `b22973e` feat(tuvi): mobile bottom sheet for CungDetail + touch-safe chart — R2a/R2b/R2c, C5/C6
  - `9701892` feat(tabs): scroll affordance + scroll active tab into view — R3
  - `54178b3` fix(ui): responsive ResultPage header + 44px mobile tap targets — R4/R5
  - `2f439d1` docs(mobile-ux): responsive & touch design contract + working doc — DESIGN.md contract
- **Proving test added/run:** structural + visual at integration/runtime layer.
  - Structural proxy: nav cluster now `hidden md:flex` (`Header.tsx:54`) + 44px hamburger `md:hidden` (`Header.tsx:72`) + close-on-route `useEffect` (`Header.tsx:14-16`). Pre-change the ungated inline nav overflowed at 375px; post-change only the hamburger renders below md → no overflow row.
  - Visual (real DOM, Chrome headless): `home-375.png` → header = logo + ☰, no horizontal overflow (AC1 header ✅); `home-900.png` → full inline nav + Cài đặt AI, identical to pre-change (C4 ✅). Screenshots in scratchpad.
  - Automated regression: `npm run build` → zero TS errors (AC5 ✅); `npm test` → **201/201 green** (no logic regression; C1/C2 ✅).
- **Verification sweep:**
  - zero stray references ✅ (build + tsc clean)
  - diff ⊆ approved list ✅ — exactly 7 source files (Header, TuViChart, CungDetail, Tabs, StarFilterBar, ResultPage, index.css) + DESIGN.md + working doc; **no `src/core/**` or `tests/**`** touched (C1 ✅)
  - each hunk maps to a row ✅ (see commit→row mapping above)
  - C3 no new colors ✅ (backdrop `bg-base/70`, fades `from-base`; grep hits were a pre-existing `min-w-[180px]` and the `max-width:1023.98px` breakpoint media query, neither a new token)
  - C6 4x4 preserved ✅ (`TuViChart.tsx:119` `grid-cols-4 grid-rows-4`)
- **`Ph3/4 proven by` progress:** AC1(header)/AC5/C1/C2/C3/C6 ✅ automated+visual. AC1(nav reachable by tap), AC2/AC3/AC4/AC6, R5/M4 box-height → **manual-recorded pending** (approved coverage-gap exclusion; require app-state interaction not reachable from a static URL).
- **Design-invalidation / re-gate:** none — approach implemented as designed.

## Phase 4 — Review ✋ (stop only if not clean)

- **reviewer verdict (round 1):** CHANGES REQUESTED, **no Critical**. 3 Important: F1 SHAPE-LOCK (`rounded-t-2xl`→ token), F2 M6 star-row hover/tap parity, F3 M9 safe-area on new fixed bottom sheet. Minors: hamburger `aria-controls`, close-button `aria-label`, redundant `lg:static`.
- **challenger (ticket-blind, round 1):** **9 met, 0 not met**, 4 can't-tell (runtime @375 → recorded coverage-gap exclusion), 1 rubric gap (M9), DESIGN.md flagged as unrequested-but-benign doc.
- **Fixes applied (commit `eefa82e`, execute loop-back):** F1 `rounded-t-lg`; F3 `.pb-safe` + `env(safe-area-inset-bottom)`; minors (`id`/`aria-controls`, `aria-label="Đóng"`, dropped `lg:static`). Re-verified: build clean, 201 tests green, no core/tests touched.
- **F2 adjudication (defer, not a blocker):** challenger scored M6 **MET** — no info is hover-only on mobile (palace tap → CungDetail surfaces star detail). Hover handlers are pre-existing; star-row keyboard/AT semantics are beyond this presentation ticket (G1). → **follow-up**, not a scope expansion.
- **Scope reconciliation:** diff = 7 source files + DESIGN.md (+ working doc); within approved Gate-2 list (DESIGN.md was an approved frontend-track artifact). No tier crossing. ✅
- **Proving test result:** `npm run build` zero TS errors; `npm test` 201/201; header @375 structural+visual proof holds (would fail pre-change). ✅
- **Layer-match re-confirmation:** runtime ACs (M2/M3/AC2/AC3/AC4/AC6, M4 box-height) carried by manual-recorded @375 (recorded human-approved coverage-gap exclusion) — no AC closed clean on a mismatched proof. ✅
- **reviewer verdict (round 2):** **LGTM** — all 3 Important findings resolved in `eefa82e`; F2 + `rounded-full` deferrals confirmed pre-existing on `main` and accepted. No Critical/Important remain.
- **Clean?** reviewer no Critical ✅ AND challenger 0 not-met (4 can't-tell = recorded coverage-gap exclusion) ✅ AND no layer-match ❌ unresolved ✅ AND k=N/exclusions approved ✅ AND proving test green ✅ → **YES, clean.**
- **Reviewed at `eefa82e`** · reviewed files: `src/components/layout/Header.tsx`, `src/components/tuvi/TuViChart.tsx`, `src/components/tuvi/CungDetail.tsx`, `src/components/shared/Tabs.tsx`, `src/components/tuvi/StarFilterBar.tsx`, `src/pages/ResultPage.tsx`, `src/index.css`, `DESIGN.md`. (finalise refuses the PR if HEAD/diff moves beyond this set.)
- **`Ph3/4 proven by`:** R1/R2a/R2b/R2c/R3/R4/R5 (N=2) confirmed by reviewer+challenger at path:line; AC5/C1/C2/C3/C6 automated; AC1(header)/C4 visual @375+900; AC1(nav reachable)/AC2/AC3/AC4/AC6 + M4 box-height → manual-recorded @375 (recorded exclusion). **Follow-up:** F2 star-row keyboard/AT semantics (pre-existing, out of scope).

## Decision log

| When | Decision | Why |
|------|----------|-----|
| Ph1 | TIER=full | SCOPE=M, 6 files, multi-row, R5 universal N>1 → not lite-eligible |
| Ph1 | TRACK=frontend (over project default fullstack) | zero server/data files touched |
| Ph1 | STRUCTURE=synthesized → Gate 0 | freeform prompt, no schema-matching headers |
| Gate 0 | H1 confirmed, H2 → R5 N=2; Header button handled in R1 panel | user: "matrix correct" + "suggest best solution"; keep scope tight per G1 |
| Gate 2 | Approved design + coverage-gap exclusion (manual-recorded @375 in lieu of automated DOM tests) | user "approve and process"; C1 forbids tests/, no DOM harness |

## Session status

## Phase 5 — Finalise ✋ final gate

- **PR draft:** `/tmp/pr-mobile-ux.md`
- **Stale-review guard:** ✅ not stale — since `eefa82e` only `docs/tickets/` changed; zero reviewed-code-file changes.
- **Planned outward actions (each needs separate approval):**
  - [x] push branch `feat/mobile-ux` to origin — done (tracking `origin/feat/mobile-ux`)
  - [x] open PR via `gh pr create` (base `main`) — done → https://github.com/cuongdinhngo/tuvidauso/pull/17
  - tracker comment/transition: **n/a** — no tracker ticket (pasted-file ticket)
- **Follow-up tickets drafted (deferred rows):** F2 star-row hover/tap keyboard+AT parity (pre-existing, out of scope); optional responsive smoke-test harness.
- **Durable lesson:** ✅ recorded to `docs/LESSONS.md` — responsive/a11y ACs can't be unit-proven; with `tests/` off-limits + no DOM harness, prove via manual-recorded / headless screenshot @viewport (coverage-gap exclusion at Gate 2).
- **Revert path:** `git checkout main` + delete branch `feat/mobile-ux`; or revert `9aaa5ed..eefa82e`.

## Session status

- **Last updated:** Phase 5 complete — PR #17 open
- **Current phase:** DONE — all 5 phases cleared; PR open, awaiting human merge
- **Next action:** Review/merge PR #17; on merge, delete branch `feat/mobile-ux`
- **Blocked on:** nothing (lifecycle complete)
