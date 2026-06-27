# Lessons

Durable lessons captured during mango ticket runs — constraints discovered, wrong assumptions,
process gaps. One entry per lesson.

## mobile-ux — proving responsive ACs when `tests/` is off-limits and there is no DOM harness

**Context:** A presentation-only mobile-UX ticket hard-forbade touching `src/core/**` and `tests/`,
and the project has **no DOM/browser test harness** (all 201 tests are pure-core logic).

**Lesson:** Responsive / a11y acceptance criteria (no horizontal scroll @375, bottom-sheet renders,
tap targets ≥44px) have an integration/runtime risk layer — they cannot be proven by a logic/unit
test. With `tests/` off-limits and no harness, the correct proof is **manual-recorded at the
viewport** (or a throwaway Chrome-headless screenshot — `google-chrome --headless=new
--window-size=375,900 --screenshot=...`), recorded as a human-approved coverage-gap exclusion at
Gate 2. `npm run build` (TS) + `npm test` (logic regression) cover only the layers below.

**How to apply:** On a frontend ticket that forbids adding tests, raise the coverage-gap exclusion at
design (Gate 2) up front, and use a headless-browser screenshot as real-DOM evidence rather than
claiming a unit test proves a runtime AC. Consider a follow-up ticket to add a Playwright/
vitest-browser responsive smoke (it touches `tests/` + devDeps, so it is its own scope).

## aux-star-sweep — the engine had systematic, untested an-sao errors; invariants ≠ correctness

**Context:** A "verify Hỏa/Linh + remaining aux stars" ticket assumed ~1 likely defect. The sweep
(19 stars, sourced against 5 reputable Vietnamese references) found **14 wrong** — whole lookup
tables (Đường Phù 10/10, Thiên Quan 8/10, Phá Toái 8/12), wrong mechanisms (Đại/Tiểu Hao on the year
branch instead of Lộc Tồn; Tam Thai/Bát Tọa absolute instead of Tả Phụ/Hữu Bật-anchored), and a
missing gender/âm-dương dimension (Hỏa/Linh direction). 1294 passing tests had masked all of it.

**Lesson:** Passing tests proved only that the engine reproduces its own output (the B1 tautology).
Structural invariants (trine, đối cung, Δ-offsets) catch *relational* bugs but **not wrong absolute
values** — e.g. Phá Toái ∈ {Tị,Dậu,Sửu} held both before and after the fix. The only durable oracle
is an **external consensus corpus** (C2: full charts from ≥2 independent engines, `verified:true` +
`source:`). Until that exists, treat every un-sourced lookup table as suspect, not trusted.

**Why:** Correctness for a dogmatic domain audience requires grounding outside the engine; invariants
and green tests are necessary but not sufficient.

**How to apply:** Prioritise the C2 external reference corpus (`docs/tickets/tuvi-reference-corpus.md`)
— it is the highest-leverage remaining accuracy work and the only thing that can verify the brightness
table and the long tail. When fixing any core lookup table, cite the external source inline per cell-
group, add value-level sourced tests (not just relational invariants), and for school-dependent cells
(e.g. Thiên Phúc Bính) leave unchanged with a documented split rather than guessing. See
[[mango-workflow-and-verification]].

## cuc-table-fix — the corpus's first external chart caught a P0 (CUC_TABLE wrong for ~75% of charts)

**Context:** Building the C2 corpus (slice A), verifying the *second* seed chart (Tết 2020, Canh Tý)
against external sources immediately exposed that `CUC_TABLE` (`src/core/tuvi/cuc.ts`) returned the
wrong Cục. Independent confirmation (nạp-âm derivation + published grid at tuvi.cohoc.net) showed the
table was wrong for 15/20 reference charts — mis-placing all 14 main stars on each, plus Đại Hạn start
ages. It had survived 1294 tests.

**Lesson:** Two structural reasons a catastrophic table bug stayed invisible: (1) the reference
`cucValue` was engine-generated (B1 tautology), and (2) the star invariants (trine/mirror) only assert
*relationships*, which hold regardless of where a wrong Cục drops the whole system. The cheap guard
that would have caught it: a **domain-structural invariant** — a valid Cục row must be 6 adjacent equal
pairs (nạp âm pairs consecutive can-chi; Tuất/Hợi follow Dần/Mão). Relational invariants are necessary
but not sufficient; add value-anchored AND structural-shape tests for lookup tables.

**Why:** The single external chart did what 1294 self-referential tests could not. This is the
strongest possible argument for the external corpus as the verification foundation.

**How to apply:** (1) When a corpus/seed chart disagrees with the engine, treat it as a caught defect
and STOP — don't seed around it (mango escalation worked here). (2) For every core lookup table, add a
structural-shape invariant (here: adjacent-pair) plus per-row externally-sourced anchors where at
least one anchor per row fails on the pre-fix data (non-tautological). (3) Beware coincidentally-correct
cells: a single passing anchor can be a pre-existing correct value, not proof of a fix. See
[[aux-star-sweep]] and [[mango-workflow-and-verification]].
