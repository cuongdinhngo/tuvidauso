# Ticket: Fix CUC_TABLE — Cục (Ngũ Hành Cục) is mis-computed

**Priority:** P0 (highest — foundational correctness; blocks the reference corpus)
**Track:** backend (`src/core/tuvi/cuc.ts` + tests)
**Found by:** the C2 reference-corpus run (`tuvi-reference-corpus.md`), verifying the 25/01/2020 Tết chart against authoritative sources.

## Context
`src/core/tuvi/cuc.ts` `CUC_TABLE` returns the wrong **Cục** for most (year-Can × Mệnh-palace) combinations. Because the Cục seeds the Tử Vi star position, a wrong Cục mis-places **all 14 main stars** (and everything downstream: aux stars, brightness, Tứ Hóa targeting). This is the highest-impact defect in the accuracy audit.

## The defect
The authoritative rule: **Cục = the Ngũ Hành of the Nạp Âm of the Cung Mệnh palace's Can-Chi**, where the palace stem comes from **Ngũ Hổ Độn** applied to the year Can. Because Nạp Âm assigns one element to each *pair* of consecutive Can-Chi, a correct Cục row (over Mệnh chi Tý→Hợi) must consist of **6 adjacent equal pairs**.

**Every row of the current `CUC_TABLE` lacks this pairing** → structurally invalid (not a school variant).

Confirmed three independent ways: nạp-âm derivation, a 2-method research cross-check (nạp-âm + arithmetic, 12/12), and the **verbatim published Cục grid at tuvisaigon.vn**.

- Engine {Ất,Canh} row [Tý..Hợi]: `[6,2,4,3,6,5,2,4,3,6,5,2]`
- **Correct {Ất,Canh} row:** `[6,6,5,5,4,4,3,3,2,2,5,5]`
- Worked example: Canh-year + Mệnh-Dần → engine **Kim Tứ Cục (4)**, correct **Thổ Ngũ Cục (5)**.

### Why it survived 1294 tests
- Reference `cucValue` is **engine-generated** (the B1 tautology) → validation compared the engine to its own wrong output.
- Structural invariants (Sát-Phá-Tham trine, Tử Vi/Thiên Phủ mirror) only assert star **relationships**, which hold regardless of where a wrong Cục places the whole system.
- Coincidental correct cells (e.g. Mậu/Quý @ Dậu = Mộc 3) made some charts — incl. the 15/04/1988 reference — happen to verify correct.

## Scope
1. Regenerate `CUC_TABLE` (all 5 Can-pair rows × 12 Mệnh chi) from the **nạp-âm + Ngũ Hổ Độn** rule. Cite the source.
2. Verify against the published Cục grid (tuvisaigon.vn) and the nạp-âm derivation — all 5 rows.
3. Add a **structural invariant test**: every Cục row is 6 adjacent equal pairs (Tý=Sửu, Dần=Mão, …) — would have caught this immediately, needs no reference data.
4. Add value-level tests for the two externally-verified anchor charts: Canh-Tý/Mệnh-Dần → Thổ Ngũ Cục; Mậu/Mệnh-Dậu → Mộc Tam Cục.
5. Assess and document the blast radius on existing engine-generated reference data (`referenceData.ts` `cucValue` + `mainStars` will shift for affected charts) — update those reference values to the corrected engine output **only after** the corrected table is itself proven against external sources (not by re-blessing).

## Acceptance criteria
- `CUC_TABLE` matches the authoritative nạp-âm-derived table for all 60 cells (5 rows × 12), with a source citation.
- Invariant test (adjacent-pair structure) + the two anchor-chart value tests pass; both fail on the pre-fix table.
- `npm test`, `npm run validate`, `npm run build` green (reference data updated where the corrected Cục shifts main-star positions, justified by the external table — not engine re-blessing).

## Constraint (C-1)
The corrected table is justified against an external source (published Cục grid / nạp-âm rule) or the proven adjacent-pair invariant — never engine-generated reference data.

<!-- ===== MANGO WORKING DOC (below this line is NOT part of the raw ticket) ===== -->
# tuvi-cuc-table-fix — Fix CUC_TABLE (Cục mis-computed)

**work_doc_mode:** auto → local-file ticket → working doc below separator
**STRUCTURE:** synthesized (Context/Defect/Scope/AC prose)

## Session status
- **Phase:** 2 (design) COMPLETE → **STOP at Gate 2** (awaiting approval to execute)
- **Branch:** to create on approval → `fix/cuc-table` (on `main`)
- **TIER:** full · **TRACK:** backend · **SCOPE:** **M**

## Decision log
- **Gate 0 (resolved, user "best recommendation"):** (1) Reading + corrected table confirmed. (2) Re-sync the 15 affected reference charts' `cucValue`+`mainStars` to corrected-engine output, **keeping `verified:false` (provisional)**; justified by the now-externally-proven Cục table + already-verified an-sao rules (not a tautology). External `verified:true` promotion deferred to the parked corpus ticket.

---

## PHASE 2 — DESIGN

### Approach
Replace the 60 values in `CUC_TABLE` (`cuc.ts`) with the nạp-âm-derived correct table, cite the source, and lock it with a **structural invariant test** (every row = 6 adjacent equal pairs — would have caught this with zero reference data) plus **anchor value tests**. Then re-sync the 15 affected reference charts' `cucValue`/`cucName`/`mainStars` to the corrected engine output (provisional, `verified:false`). Keep the lookup-table form (the ticket asks for table regen; smallest change).

### Rejected alternatives
- **Derive Cục at runtime** (Ngũ Hổ Độn + nạp-âm lookup instead of a table) — rejected: larger change, new bug surface, for a P0 hotfix. The corrected table guarded by the adjacent-pair invariant is simpler and self-checking. (Worth a future refactor ticket.)
- **Promote affected refs to verified:true now** — rejected at Gate 0 (would pull the parked corpus work into this P0).
- **Keep refs and special-case the test** — rejected: refs must reflect the corrected engine or validate is meaningless.

### Assumptions
| Assumption | Tag | Resolution |
|-----------|-----|-----------|
| Corrected {Ất,Canh} row `[6,6,5,5,4,4,3,3,2,2,5,5]` | verified | published Cục grid (tuvisaigon.vn) verbatim + nạp-âm + arithmetic, 3 methods |
| Other 4 rows (G/K,B/T,Đ/N,M/Q) as derived | verified-by-derivation → execute confirms vs published grid | all have the 6-adjacent-pair signature; same nạp-âm method; execute cross-checks every cell vs the grid |
| Re-syncing provisional refs to corrected engine is C-1-legitimate | verified | Gate-0 decision; Cục now externally proven + an-sao rules already verified |
| `majorPeriod.ts` keys Đại Hạn start age on Cục number | verified | blast radius; fix auto-corrects start ages — check its tests for pinned values |
| Adjacent-pair invariant is a true property of any correct Cục table | verified | nạp âm assigns one element per consecutive can-chi pair → consecutive chi pair up |

No novel-untested 3p/runtime assumption → Gate 2 not blocked on that axis.

### Smallest change-list
| # | Change | File/area | Ph2 covered by | k/N |
|---|--------|-----------|----------------|-----|
| 1 | Replace `CUC_TABLE` 5 rows with corrected nạp-âm table + source-citation comment | `src/core/tuvi/cuc.ts:18-25` | R-1 | 60/60 cells |
| 2 | New invariant test: every row = 6 adjacent equal pairs (∀ Can-pair) | `tests/cucTable.test.ts` (new) | R-3 | 5/5 rows |
| 3 | Anchor value tests: Canh/Dần→Thổ5, Mậu/Dậu→Mộc3, Giáp/Tý→Thủy2 | `tests/cucTable.test.ts` | R-4 | 3/3 |
| 4 | Re-sync 15 affected reference charts' `cucValue`+`cucName`+`mainStars` to corrected engine (provisional, verified:false) | `tests/validation/referenceData.ts` | R-5 | 15/15 |
| 5 | Update any `majorPeriod` test that pinned a wrong Đại Hạn start age | `tests/*` (if present) | R-5 | as needed |

### Rule compliance
- `src/core/**` stays pure (constant table edit). ✅
- C-1: table justified by published grid + adjacent-pair invariant; refs re-synced provisionally per Gate-0. ✅
- Testing DoD: proving test added; npm test + validate + build before done. ✅

### Verification plan (per-AC, layer-matched)
| AC / requirement | risk layer | proof artifact | layer-match? |
|------------------|-----------|----------------|--------------|
| AC-1 60 cells authoritative | logic | unit invariant (adjacent pairs ∀ row) + anchors + execute cross-check all 5 rows vs published grid (manual-recorded) | ✅ |
| AC-2 invariant+anchors pass, fail pre | logic | unit — fails on current table (no pairs; Canh/Dần=4≠5) | ✅ |
| R-5 refs re-synced | data | `npm run validate` green after re-sync | ✅ |
| AC-3 test/validate/build green | logic/data | full sweep | ✅ |

No ❌ rows → no coverage-gap exclusions. (Backend; no surfaces.)

### Proving test
`tests/cucTable.test.ts` — asserts (a) every `CUC_TABLE` row consists of 6 adjacent equal pairs, (b) `getCuc('Canh','Dần').value===5`, `getCuc('Mậu','Dậu').value===3`, `getCuc('Giáp','Tý').value===2`. **Fails pre-fix** (current table has no adjacent pairs; Canh/Dần→4), **passes post-fix**. Invocation: `npm test -- cucTable`.

### Rollback + porting
- **Rollback:** single commit; `git revert` restores the table + reference values together.
- **Porting:** single repo (`app`).

### SCOPE: M — TRACK: backend — TIER: full
Branch type `fix` (correctness). Change-list = one core table + 2 test groups + provisional ref re-sync; matches Gate-0 scope. No outgrowth.

### Session status update
- **Phase:** 2 (design) COMPLETE → **STOP at Gate 2**
- Branch on approval: `fix/cuc-table`

---

## PHASE 3 — EXECUTE (autonomous, complete)

**Branch:** `fix/cuc-table`

### Pre-implement confirmation
All 5 `CUC_TABLE` rows confirmed cell-by-cell against the authoritative **text** grid at tuvi.cohoc.net (the tuvisaigon grid is an image → OCR-unreliable; ignored). Key nuance verified: Tuất/Hợi take the Dần/Mão Cục ("Tuất Hợi… Cục tòng Dần Mão") — the table encodes this.

### Implemented (approved change-list)
- `cuc.ts` — replaced all 60 `CUC_TABLE` cells with the nạp-âm table + source citation. (R-1)
- `tests/cucTable.test.ts` (new) — adjacent-pair invariant ∀ Can + 4 anchor values. (R-3, R-4)
- `tests/validation/referenceData.ts` — re-synced **15** affected charts' `cucName`/`cucValue`/`mainStars` to corrected engine (provisional, `verified:false`); migration asserted **only** those 3 fields changed (surgical). (R-5)

### Blast-radius test corrections (beyond literal change-list — FLAG at review)
The corrected data broke two pre-existing tests; both were **tautological/brittle**, not regressions:
- `tests/tuvi.test.ts` — "Cuc: Mau + Tuat" pinned the **old buggy** value 5; corrected to the sourced value **Thủy Nhị Cục (2)** (Nhâm Tuất = Đại Hải Thủy; cohoc.net grid). A B1-style tautology.
- `tests/compare.test.ts` — "Tam Hop > Luc Xung" asserted on the **aggregate** overallScore (tied 50/50 on corrected data). Re-pointed to the **Con Giáp** dimension that actually encodes tam-hợp/lục-xung (90 vs 25) — the meaningful, robust assertion. Compare scoring itself untouched.

### Verification sweep
- **Diff ⊆ approved + 2 flagged blast-radius test files.** referenceData diff = only cucName/cucValue/mainStars (grep-confirmed); no untouched-line reformatting.
- **Proving test** `tests/cucTable.test.ts`: passes post-fix; fails pre-fix (current table has no adjacent pairs; Canh/Dần→4≠5).
- `npm test` → **1308 passed (15 files)**; `npm run validate` → **20/20**; `npm run build` → clean; lint clean on changed files.
- **Side-effect confirmed positive:** Đại Hạn start ages (`majorPeriod`, keyed on Cục) now corrected; no test pinned wrong values (fullValidation/aiPrompts rebuild from engine).

### Ph3/4 proven by (k/N)
| Row | Proven by | k/N |
|-----|-----------|-----|
| R-1 table | 60 cells vs cohoc.net grid + nạp-âm | 60/60 |
| R-2 verify 5 rows | research cross-check all rows | 5/5 |
| R-3 invariant | adjacent-pair test ∀ Can | 10/10 |
| R-4 anchors | Canh/Dần=5, Mậu/Dậu=3, Giáp/Tý=2, Kỷ/Tuất=6 | 4/4 |
| R-5 ref re-sync | surgical migration (15 charts) + validate 20/20 | 15/15 |

### Scope note (outgrew check)
Core change = exactly the approved cuc.ts table + 2 new test groups + 15-chart provisional re-sync. The **2 extra test-file corrections** (tuvi/compare) are blast-radius from the corrected data, not new feature scope; SCOPE stays **M**, branch type `fix` correct. Surfaced here for the review gate.

### Session status
- **Phase:** 4 (review) CLEAN → **Phase 5 (finalise)** pending final gate

---

## PHASE 4 — REVIEW (CLEAN)

**Reviewer (Sonnet): LGTM** — all 60 cells satisfy the adjacent-pair invariant; anchors verified; referenceData re-sync surgical (only cucName/cucValue/mainStars across the 15 charts, all verified:false); blast-radius test edits correct (not masking); `src/core` pure; Vietnamese intact.

**Challenger (ticket-blind): initial 7 met / 1 not-met / 1 can't-tell → after loop-back, 3/3 MET.**
- First pass: AC-2 "not met" (Mậu/Dậu anchor coincidentally correct pre-fix) + R-2 "can't tell" (no per-row value pin beyond the structural invariant).
- **Loop-back (commit `ff52fb3`):** added one grid-sourced anchor per Can-pair row (Bính/Tý, Nhâm/Tý, Mậu/Tý), each ALSO failing pre-fix; relabelled Giáp/Tý & Mậu/Dậu as correctness-only. Re-challenge: **R-2 MET** (all 5 rows pinned), **AC-2 MET** (every row has a pre-fix-failing anchor; invariant fails all 5 pre-fix rows).

**Scope:** core diff = cuc.ts table + cucTable.test.ts; + surgical referenceData re-sync; + 2 blast-radius test corrections (tuvi/compare) surfaced and accepted. SCOPE M, branch `fix` — no drift.

**Sweep:** `npm test` **1311 passed**; `npm run validate` 20/20; `npm run build` clean.

**Reviewed at `ff52fb3`** — files: `src/core/tuvi/cuc.ts`, `tests/cucTable.test.ts`, `tests/validation/referenceData.ts`, `tests/tuvi.test.ts`, `tests/compare.test.ts`. (Reviewer LGTM covered production code at 56b52d2; only additive test anchors landed since → carried forward.)

---

## Requirements matrix (synthesized)

| ID | Source | Verbatim (condensed) | Interpretation | Ph1 evidence | Status |
|----|--------|----------------------|----------------|--------------|--------|
| C-1 | §Constraint | justify vs external source/invariant, never engine | binding | — | confirmed |
| R-1 | §Scope.1 | Regenerate `CUC_TABLE` (5 rows × 12) from nạp-âm + Ngũ Hổ Độn; cite | core fix | `cuc.ts:18-25` table has no adjacent-pair structure | confirmed defect |
| R-2 | §Scope.2 | Verify all 5 rows vs published grid + nạp-âm | proof | {Ất,Canh} confirmed vs tuvisaigon grid; other 4 rows to confirm | partial |
| R-3 | §Scope.3 | Structural invariant test: every row = 6 adjacent equal pairs | regression net | no such test exists | gap |
| R-4 | §Scope.4 | Value tests: Canh/Dần→Thổ5, Mậu/Dậu→Mộc3 | anchor proof | — | gap |
| R-5 | §Scope.5 | Assess + update `referenceData` cucValue+mainStars for affected charts (justified, not re-blessed) | data sync | **15/20 charts change** (measured) | confirmed |
| AC-1 | §AC.1 | 60 cells match authoritative table + citation | — | — | pending |
| AC-2 | §AC.2 | invariant + 2 anchor tests pass; fail pre-fix | — | — | pending |
| AC-3 | §AC.3 | test/validate/build green (refs updated, justified) | — | — | pending |

**SECTIONS: 5 found (Context, The defect, Scope, Acceptance criteria, Constraint) | 5 decomposed | ROWS: C=1, R=5, G=0, AC=3**

---

## AC validation (re-derived independently)
**Corrected `CUC_TABLE` (nạp-âm derived; cols Tý..Hợi; Thủy2/Mộc3/Kim4/Thổ5/Hỏa6):**
| Can pair | Ngũ Hổ Độn Dần | corrected row |
|----------|----------------|---------------|
| Giáp/Kỷ | Bính Dần | `[2,2,6,6,3,3,5,5,4,4,6,6]` |
| Ất/Canh | Mậu Dần | `[6,6,5,5,4,4,3,3,2,2,5,5]` ✓ confirmed vs tuvisaigon grid |
| Bính/Tân | Canh Dần | `[5,5,3,3,2,2,4,4,6,6,3,3]` |
| Đinh/Nhâm | Nhâm Dần | `[3,3,4,4,6,6,2,2,5,5,4,4]` |
| Mậu/Quý | Giáp Dần | `[4,4,2,2,5,5,6,6,3,3,2,2]` |

Every row = 6 adjacent equal pairs (the structural signature). Other 4 rows to confirm vs the published grid in design/execute. Anchor cells: Canh+Dần→5 (Thổ), Mậu+Dậu→3 (Mộc), Giáp+Tý→2 (Thủy) — all verified by 3 independent methods.

**Blast measured:** 15/20 reference charts get a different Cục (only 5 coincidentally correct: cases 1,2,11,13,16).

---

## Universal inventory
- **N = 60 Cục cells** (5 Can-pair rows × 12 Mệnh chi) — per-row checklist; review confirms all 5 rows vs source.
- **15 affected reference charts** — cucValue + 14 mainStars each must be re-synced after the fix.

## Cause / gap analysis (taxonomy: `data`)
- **R-1 → `data`** (`src/core/tuvi/cuc.ts:18-25`): `CUC_TABLE` values don't follow the nạp-âm rule (no adjacent-pair structure). Likely hand-entered or a broken formula.

## Blast radius
`getCuc` → consumed by `buildProfile.ts` (Tử Vi position via `placeMainStars(cuc.value, …)`) **and** `majorPeriod.ts` (Đại Hạn start age keys on Cục number). So the fix also corrects Đại Hạn start ages (a positive side-effect; check majorPeriod tests for pinned wrong values). `referenceData.ts` cucValue+mainStars for 15 charts will shift → validate fails until re-synced. Cục **name** display also corrects.

## TRACK / SCOPE / TIER
- **TRACK: backend** — `cuc.ts` + tests + `referenceData.ts`; 0 UI.
- **SCOPE: M** — one core table (60 cells) + 3 tests + mechanical re-sync of 15 provisional reference rows.
- **TIER: full** — universal "all 60 cells / all 5 rows correct" (N>1), domain-critical P0.

---

## CLARIFICATION: 2 raised | 0 self-resolved | 2 for human decision → STOP at Gate 0
1. **(mandatory, synthesized)** Confirm my reading (matrix + corrected table above).
2. **(scope / C-1 interpretation)** 15/20 reference charts change. How to re-sync their `cucValue`+`mainStars`? — see Gate question.
