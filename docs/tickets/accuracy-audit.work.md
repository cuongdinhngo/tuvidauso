<!-- ===== MANGO WORKING DOC ===== -->
# accuracy-audit — Calculation Accuracy & Reliability Audit + Remediation

**Source ticket:** `/home/cuong-ngo/Downloads/tuvidauso-accuracy-audit.md` (external file, captured verbatim — see below)
**work_doc_mode:** separate (ticket lives outside repo) → this file at `docs/tickets/accuracy-audit.work.md`
**STRUCTURE:** synthesized (audit uses A/B/C/D headers, not the harness C/R/G/AC schema)

---

## Session status
- **Phase:** 4 (review) CLEAN → 5 (finalise) pending final gate
- **Branch:** `fix/accuracy-audit-main-stars` · **commit:** `2ccfbb8`
- **Reviewed at 2ccfbb8** — files: `src/core/tuvi/mainStars.ts`, `tests/mainStarsInvariants.test.ts`, `tests/validation/referenceData.ts`
- _(prev: Phases 1+2+3 — Gates 0/1/2 CLEARED; execute committed e89a11a→amended 2ccfbb8)_

---

## PHASE 4 — REVIEW (CLEAN)

**Reviewer (Sonnet): LGTM** — offset arithmetic independently verified (+10, −8 correct); invariant tests confirmed non-tautological (derived from star geometry); 20 reference cells recompute correctly; `src/core` purity + naming OK. Re-reviewed the Mệnh/Thân delta → LGTM (coincidence predicate `hour % 6 === 0` derived algebraically, non-tautological).

**Challenger (ticket-blind): 11 met, 1 partial (non-blocking), 8 deferred.**
- A1, A2, C1 invariants, D-scope → MET (math verified independently).
- Req 11 "12 palaces distinct" → correct reading is palace arrangement (distinct by construction); 14 stars legitimately share palaces. Non-blocking.
- Req 13 Mệnh/Thân → **was the one non-deferred gap; resolved by the added invariant block → now MET** (re-confirmed ticket-blind).
- C2–C7 + B1 (8 items) → NOT MET = the **recorded Gate-0 human-approved scope split** (follow-up tickets). Not blockers per review step 9.

**Scope reconciliation:** diff = exactly the 3 reviewed files, no creep, no untouched-line reformatting. SCOPE=M held.
**Proving test:** `tests/mainStarsInvariants.test.ts` green at HEAD (fails without the offset fix). Full `npm test` 1239 passed; `npm run validate` 20/20; `npm run build` clean; lint debt all pre-existing/out-of-scope.

### Ph3/4 proven by (k/N)
| Row | Proven by | k/N |
|-----|-----------|-----|
| R-A1 | Sát-Phá-Tham trine ×150 + validate | 150/150 |
| R-A2 | Tử-Vũ-Liêm trine ×150 + validate | 150/150 |
| R-C1 | invariant suite (stars ×150 + Mệnh/Thân ×144) | 294/294 |
| Ref-correction | validate 20/20 + surgical-isolation assertion | 20/20 |

**Reviewed at 2ccfbb8** (stale-review guard).

---

## PHASE 3 — EXECUTE (autonomous, complete)

**Branch:** `fix/accuracy-audit-main-stars` · **Commit:** `e89a11a`

### Proving-test transition (fails pre → passes post)
- Pre-fix: `tests/mainStarsInvariants.test.ts` → **300 failed** (Sát-Phá-Tham + Tử-Vũ-Liêm trines × 150 combos); mirror/opposition/14-stars passed.
- Post-fix: **750/750 passed.**

### Verification sweep
- **Diff ⊆ approved list:** only `mainStars.ts` (items 1,2), `mainStarsInvariants.test.ts` (item 3), `referenceData.ts` (item 4). No file outside the list; no untouched-line reformatting.
- **Surgical isolation proven:** migration helper asserted that across all 20 refs the *only* changed star keys are Phá Quân/Liêm Trinh (threw otherwise) → passed. `referenceData.ts` diff = 20 changed lines, each a mainStars line.
- **No stray symbols/imports.**

### Full sweep results
- `npm test` → **951 passed (13 files)** (+201 from new suite).
- `npm run validate` → **20/20 PASSED**.
- `npm run build` → clean (only pre-existing chunk-size warning).
- `npm run lint` → 26 errors, **all pre-existing on `main`** in unrelated files (BatTuTab, runValidation, etc.); none in the 3 changed files. Out of scope — not touched.

### Ph3/4 proven by
- R-A1 → Sát-Phá-Tham trine green ×150 + validate 20/20.
- R-A2 → Tử-Vũ-Liêm trine green ×150 + validate 20/20.
- R-C1 → invariant suite green ×150.
- Ref-correction → validate 20/20 + surgical-isolation assertion.

### Scope check
No growth: SCOPE=M, TRACK=backend, diff matches the Gate-2 change-list exactly. No outgrew-its-ticket nudge.

---

## PHASE 2 — DESIGN

### Approach
Two one-token offset fixes in `mainStars.ts`, guarded by a new structural-invariant Vitest suite that fails pre-fix and passes post-fix, then a **surgical** correction of only the Phá Quân / Liêm Trinh cells in the 21 reference cases (everything else untouched). The invariant suite — not the engine — is the justification for the new reference values (honours constraint C-1).

### Rejected alternatives
- **Regenerate referenceData wholesale via `generate` mode** — rejected: re-blesses engine output for *all* fields (violates C-1) and would mask any collateral change. Surgical patch + "only these two stars changed" assertion is strictly safer and proves the fix is isolated.
- **Block on the external C2 corpus before fixing** — rejected at Gate 0 (deferred to follow-up). The fix is provable today from structural invariants.
- **Fix offsets only, skip C1 suite** — rejected at Gate 0 (the invariant net is the highest-leverage, regression-proof part).

### Assumptions
| Assumption | Tag | Resolution |
|-----------|-----|-----------|
| Phá Quân correct offset = +10, Liêm Trinh = −8 | verified | Trine + gap-pattern math; audit external example (Tử Vi@Dần → Phá Quân Tý, Liêm Trinh Ngọ); cross-checked vs stored buggy data |
| "Tử Vi, Vũ Khúc, Liêm Trinh share a trine" is a valid independent invariant for A2 | verified | Derived: all ≡ t (mod 4) under correct offsets; current −7 ≡ t+1 → breaks it. Independent of the A1 fix |
| Fixing the two offsets changes ONLY Phá Quân & Liêm Trinh positions across all charts | verified (proven in execute) | Offsets are independent constants; execute asserts a surgical diff over all 21 refs |
| New `tests/*.test.ts` is auto-discovered by `npm test` | verified | All 12 existing suites live in `tests/*.test.ts` |

No `novel-untested` third-party/runtime assumptions → Gate 2 not blocked on that axis.

### Smallest change-list
| # | Change | File/area | Ph2 covered by | k/N |
|---|--------|-----------|----------------|-----|
| 1 | Phá Quân offset `8` → `10` (+ fix comment L112) | `src/core/tuvi/mainStars.ts:113` | R-A1 | 1/1 |
| 2 | Liêm Trinh offset `-7` → `-8` (+ fix comment L96) | `src/core/tuvi/mainStars.ts:97` | R-A2 | 1/1 |
| 3 | New structural-invariant suite over sweep cuc{2..6}×day{1..30} (N=150): Sát-Phá-Tham trine, Tử-Vũ-Liêm trine, Thiên Phủ⊥Thất Sát (Δ6), Tử Vi/Thiên Phủ mirror, all 14 stars named present | `tests/mainStarsInvariants.test.ts` (new) | R-C1 (+ proves A1,A2) | 150/150 |
| 4 | Surgically update Phá Quân + Liêm Trinh positions in all 21 reference cases (preserve all other fields + `verified:false`) | `tests/validation/referenceData.ts` | R-B1 / ref-correction | 21/21 |

Migration helper (scratchpad, **not committed**): imports `placeMainStars`, recomputes each ref's mainStars, asserts the *only* changed keys are Phá Quân/Liêm Trinh, writes back the patched file. The assertion is itself the surgical-isolation proof.

### Rule compliance (`docs/ENGINEERING_RULES.md`)
- `src/core/**` stays pure (named exports, no React) — change is a constant edit. ✅
- Testing DoD (§57-63): proving test added; will run `npm test` + `npm run build` + `npm run lint` before done. ✅
- Invariants worth a proving test (§61: "14 main stars / 12 unique palaces") — extended with the trine/mirror invariants. ✅

### Verification plan (per-AC, layer-matched)
| AC / requirement | risk layer | proof artifact | layer-match? |
|------------------|-----------|----------------|--------------|
| R-A1 Phá Quân +10 | logic | unit — Sát-Phá-Tham trine over N=150 | ✅ |
| R-A2 Liêm Trinh −8 | logic | unit — Tử-Vũ-Liêm trine over N=150 | ✅ |
| R-C1 invariant suite holds for every chart | logic | unit — suite green over N=150 sweep | ✅ |
| Ref-correction: validate passes | logic/data | `npm run validate` 21/21 PASS + surgical-diff assertion (only 2 stars changed) | ✅ |
| C-1 constraint (justify by invariant, not engine) | process | new ref values backed by C1 suite + surgical diff; no wholesale regen | ✅ |

No ❌ rows → no coverage-gap exclusions needed.

### Proving test
`tests/mainStarsInvariants.test.ts` — the Sát-Phá-Tham trine assertion FAILS today (Phá Quân ≡0 mod4 ≠ 2) and the Tử-Vũ-Liêm trine assertion FAILS today (Liêm Trinh ≡ t+1 ≠ t); both PASS after the offset fixes.
Invocation: `npm test -- mainStarsInvariants` (and full `npm test` / `npm run validate`).

### Rollback + porting
- **Rollback:** single commit; `git revert` restores both offsets and the reference cells together.
- **Porting:** single repo (`app`), no cross-repo porting.

### SCOPE: M (unchanged) — TRACK: backend — TIER: full
No tier growth; change-list matches the analysis baseline.

- **Branch:** not yet created (still on `main`)
- **TIER:** full
- **TRACK:** backend
- **SCOPE:** M
- **Open gates:** Gate 1 (approve matrix → move to design)

## Decision log
- **Gate 0 (resolved via AskUserQuestion):**
  - SCOPE = **slice**: this run covers R-C1 (invariant tests) + R-A1 + R-A2 + invariant-derived correction of the 20 stale references. **R-C2, G-C3, G-C4, G-C5, G-C6, G-C7 deferred to follow-up tickets.**
  - References = **invariant-derive now, C2 later**: recompute only Phá Quân/Liêm Trinh positions in existing refs from the proven trine/gap invariant; keep `verified:false`; C1 structural invariants are the real guard. External `verified:true` corpus = follow-up.
- Synthesized reading (matrix) confirmed by the scope selection.

---

## Requirements matrix (synthesized from prose)

| ID | Source | Verbatim (condensed) | Interpretation | Ph1 evidence | Status |
|----|--------|----------------------|----------------|--------------|--------|
| C-1 | §C constraint / §D footer | "changes to calculation files must be justified against an external source or a proven invariant — never against engine-generated reference data" | Global constraint on HOW any core math change is justified | audit L163-164 | confirmed |
| R-A1 | §A1 | Phá Quân offset `+8` → `+10` (`-2`) in `mainStars.ts` | Fix one offset constant | `mainStars.ts:113` = `offsetChi(thienPhuPos, 8)`; trine math requires +10 | confirmed defect |
| R-A2 | §A2 | Liêm Trinh offset `-7` → `-8` in `mainStars.ts` | Fix one offset constant | `mainStars.ts:97` = `offsetChi(tuViPos, -7)`; gap pattern requires -8 | confirmed defect |
| R-B1 | §B1 | Validation references are engine-generated (tautological), `verified:false` | Root-cause finding; remediation = C2 (+ correct stale refs after A1/A2) | `runValidation.ts:87-118` generateMode writes `verified:false`; `referenceData.ts` 20×false / 1×true | confirmed |
| R-C1 | §C1 | Add structural-invariant test suite over fuzz sweep cuc{2..6}×day{1..30} | New Vitest file; would have caught A1 | no invariant test exists in `tests/` | gap confirmed |
| R-C2 | §C2 | Build external consensus-verified reference corpus (25–40 charts, 2–3 sources, `verified:true`+`source:`) | Large research task; replaces tautological refs | n/a — needs external sources | gap (follow-up) |
| G-C3 | §C3 | Validate lunar calendar vs Hồ Ngọc Đức UTC+7; switch or document limitation | Calendar correctness / research | `calendar/lunarData.ts` exists (UTC+8 packed table) | gap (follow-up) |
| G-C4 | §C4 | Solar-term boundary precision (instant-of-term) or interim "boundary case" flag | Bát Tự pillar precision | `calendar/jieQi.ts` exists (day-only polynomial) | gap (follow-up) |
| G-C5 | §C5 | Capture exact HH:MM time (not just hour bucket); 23:00 rollover, term-by-time | Input feature (frontend + core) | `pages/InputPage.tsx` collects hourIndex only | gap (follow-up) |
| G-C6 | §C6 | Tứ Hóa: declare school, cite source, make table swappable | Auditability / config | `tuvi/fourTransforms.ts` exists (one table) | gap (follow-up) |
| G-C7 | §C7 | Derivation/transparency UX + publish methodology | Frontend feature + docs | n/a | gap (follow-up) |

**SECTIONS: 4 found (A, B, C, D) | 4 decomposed | ROWS: C=1, R=5 (A1,A2,B1,C1,C2), G=5 (C3,C4,C5,C6,C7)**
(Section D = execution-order constraint, folded into the per-item sequencing; not a separate requirement.)

---

## AC validation (re-derived independently)

| Claim | Audit value | My computation | Match? |
|-------|-------------|----------------|--------|
| Phá Quân correct offset | +10 (−2) | Tham +2, Thất Sát +6 ⇒ trine ≡2 mod4; Phá must be +10 (≡2). +8≡0 breaks it. | ✅ |
| Phá Quân, Tử Vi@Dần | should be Tý / engine gives Tuất | Thiên Phủ@Dần(2); +10→idx0=Tý ✓; current +8→idx10=Tuất ✓ | ✅ |
| Liêm Trinh correct offset | −8 | Thiên Đồng@−5, skip −6/−7, Liêm Trinh −8 | ✅ |
| Liêm Trinh, Tử Vi@Dần | should be Ngọ / engine gives Mùi | Tử Vi@Dần(2); −8→idx6=Ngọ ✓; current −7→idx7=Mùi ✓ | ✅ |
| Trine invariant violations | 20/20 ref charts | not yet machine-run, but math guarantees 100% (offset bug is day-independent) | ✅ (consistent) |

No AC mismatches → **no AC-derived Gate-1 questions.**

---

## Universal inventory (denominators later phases prove against)
- **C1 fuzz sweep:** cuc ∈ {2,3,4,5,6} × day ∈ {1..30} = **N=150** chart configs; each must satisfy: Sát-Phá-Tham trine; Thiên Phủ⊥Thất Sát (Δ=6); Tử Vi/Thiên Phủ mirror about Dần–Thân; 14 stars placed once; 12 distinct palaces; valid Mệnh/Thân.
- **A1/A2 regression:** **N=20** existing reference charts must pass the trine invariant after the fix (and their stale Phá Quân / Liêm Trinh positions corrected).

## Cause analysis (taxonomy)
- R-A1, R-A2 → **logic** (wrong offset constant), `mainStars.ts:97,113`.
- R-B1 → **validation** (no independent oracle), `runValidation.ts:87-118`.

## Blast radius
`placeMainStars` consumers: `compare/buildProfile.ts:40`, `tests/fullValidation.test.ts`, `tests/aiPrompts.test.ts`, `tests/validation/{runValidation,quickCheck}.ts`. Fixing offsets shifts compare profiles + AI prompt content (correctly). `referenceData.ts` 20 unverified cases encode the OLD positions → will fail validate until corrected.

## TRACK / SCOPE / TIER
- **TRACK: backend** — 0/N UI files touched for recommended slice (A1+A2+C1 are `src/core/` + `tests/`). Full audit = fullstack (C5/C7 touch UI).
- **SCOPE: M** (recommended slice) — `mainStars.ts` + new invariant test + reference correction. Full audit = **L**.
- **TIER: full** — universal requirement (N=150 > 1), multiple rows, domain-critical correctness.

## CLARIFICATION: 2 raised | 0 self-resolved | 2 for human decision  → STOP at Gate 0
1. (mandatory, synthesized) Confirm my reading of this freeform audit (matrix above).
2. (scope) This audit is an epic (~11 items). Per "one ticket per run," recommend this run = first slice; split C2–C7 into follow-ups.
