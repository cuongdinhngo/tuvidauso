# Ticket: C2 — external consensus-verified reference corpus + brightness verification

**Priority:** P1 (the durable trust foundation)
**Track:** backend (`tests/validation/referenceData.ts`, new corpus tooling)
**Follows:** the root-cause finding B1 in `docs/tickets/accuracy-audit.work.md`.

## Context
Current validation references are **engine-generated** (`verified:false`) — the suite confirms "the engine reproduces its own output," not that the output is correct. This is the single most important reliability gap. It also blocks verifying large tables that can't be checked by hand — notably the **168-cell brightness table** (`brightness.ts`) and the long tail of minor aux stars.

## Scope
1. Pick **25–40 birth datetimes** spanning edge cases: leap months, day 1 / day 30, hour Tý (23:00 and 00:30), Lập Xuân boundary, Tết boundary, both genders, 1900s + 2000s.
2. For each, compute the expected chart using **2–3 independent reputable Tử Vi engines/sources** (NOT this app). Accept a value only when sources **agree**; record disagreements separately as "school-dependent."
3. Store as `referenceData.ts` entries with `verified:true` and a `source:` field. **Never regenerate from the engine.**
4. Use the corpus to verify the **brightness table** (`brightness.ts`) cell-by-cell; fix mismatches with the source noted.
5. Validation compares engine → external reference (no longer tautological).

## Acceptance criteria
- ≥25 charts stored `verified:true` with sources; `generateMode` no longer used to bless values.
- Brightness mismatches resolved against sources or flagged school-dependent.
- `npm run validate` passes against the external corpus.

## Constraint (C-1)
Reference values come only from external sources, never engine output.

<!-- ===== MANGO WORKING DOC (below this line is NOT part of the raw ticket) ===== -->
# tuvi-reference-corpus — C2 external reference corpus + brightness verification

**work_doc_mode:** auto → local-file ticket → working doc appended below separator
**STRUCTURE:** synthesized (Context/Scope/AC prose, not the C/R/G/AC header schema)

## Session status
- **Phase:** READY TO RESUME — the P0 Cục bug this run caught is now **fixed & merged** (PR #23, `tuvi-cuc-table-fix.md`). Re-run Slice A on the corrected engine.
- **On resume:** the 15 charts re-synced by the Cục fix are still `verified:false` (provisional); promote the seed to `verified:true` with external sources per the design below. Engine is now trustworthy for Cục + main stars.
- **Branch:** none (empty branch deleted; no code changed).
- **TIER:** full · **TRACK:** backend · **SCOPE:** **M** (Slice A — infrastructure + small seed)

## Decision log
- **Gate 0 (resolved, user "best recommendation"):**
  1. Synthesized reading confirmed.
  2. **Sourcing:** I fetch published worked charts (lá số mẫu) from reputable Tử Vi sites/books + cross-check against classical derivation rules; user spot-checks. No browser automation; AI-computed charts explicitly excluded as oracle.
  3. **Scope split → this run = SLICE A only** (re-scoped L/XL → **M**): corpus *infrastructure* + a *small externally-verified seed*. **Deferred to follow-ups:** Slice B (scale to 25–40 charts), Slice C (168-cell brightness audit + brightness/aux schema fields).
- **Design spike (resolved novel-untested assumption):** external sourcing is feasible. For 15/04/1988 Ngọ Nam, every `expected` field was independently corroborated against non-AI authorities (HKO 1988 calendar PDF → lunar 29/02 Mậu Thìn; Lục Thập Hoa Giáp → Đại Lâm Mộc; classical an-sao offset rules → all 14 main stars) and **agrees with the engine**. School-dependent cell flagged: **Mậu Hóa Khoa** = Hữu Bật (Nam phái, engine's choice) vs Thái Dương (Trung Châu).

---

## PHASE 2 — DESIGN

### Approach
Build the *provenance infrastructure* that makes engine-blessing structurally impossible, then prove it with a small genuinely-external seed. Concretely: add a `source` field to `ReferenceCase`; add a guard test that **`verified:true` ⇒ non-empty `source`** AND **the corpus contains ≥2 verified+sourced charts** (fails today: 0 verified cases); promote a seed of charts to `verified:true` only after independently corroborating every `expected` field against cited non-AI authorities (the spike's method); annotate `generateMode` so it can only emit provisional `verified:false`. This delivers the durable foundation (C-1 enforced by a test) without attempting the full 25–40 corpus or the 168-cell brightness audit (slices B/C).

### Rejected alternatives
- **Attempt the full 25–40 corpus + brightness now** — rejected at Gate 0: L/XL, bottlenecked on per-chart external verification; would stall. Slice A delivers a provable foundation this run.
- **Add `source` but don't enforce it with a test** — rejected: without the guard, the B1 tautology can silently return (someone re-blesses engine output as verified). The enforcing test IS the fix.
- **Mark the existing 21 cases verified:true in bulk** — rejected (C-1): they're engine-bootstrapped; each must be independently corroborated before promotion. Seed only what's truly verified.
- **Use a chat-AI (incl. me) as the oracle** — rejected: this session proved it unreliable; sources must be dedicated engines / classical texts / authoritative calendars.

### Assumptions
| Assumption | Tag | Resolution |
|-----------|-----|-----------|
| External non-AI authorities suffice to corroborate every `expected` field | verified | Spike did it end-to-end for 15/04/1988 (HKO PDF, nạp âm table, classical an-sao rules) |
| Engine output agrees with external sources for the seed charts | verified (for #1); execute confirms others | Spike: all 14 stars + lunar + cục agree for #1. Disagreement on another chart = a caught engine bug → surface, don't bury |
| Mậu Hóa Khoa is school-dependent (Hữu Bật vs Thái Dương); engine = Nam phái | verified | Spike (giaithan.vn, lyso.vn). Record as school note on the seed, not a defect |
| A literal published full lá-số per birth may be unavailable; cited classical *method* is the source | verified | Spike: charts published as images; the generating rules/tables are the citable external authority (C-1 allows "external source OR proven invariant") |
| New `tests/*.test.ts` auto-discovered by `npm test` | verified | all existing suites live in `tests/*.test.ts` |

No unresolved `novel-untested` third-party/runtime assumption (fetch feasibility resolved by spike) → Gate 2 not blocked on that axis.

### Smallest change-list
| # | Change | File/area | Ph2 covered by | k/N |
|---|--------|-----------|----------------|-----|
| 1 | Add `source?: string` to `ReferenceCase`; rewrite header comment (verified:true requires external source; verified:false = provisional/engine-bootstrapped) | `tests/validation/referenceData.ts` | R-3 | 1/1 |
| 2 | New proving test: `verified:true ⇒ source non-empty` AND `count(verified:true) ≥ 2` | `tests/referenceCorpus.test.ts` (new) | R-3 / AC-1 | 1/1 |
| 3 | Promote seed (≥2 charts incl. #1 15/04/1988) to `verified:true` + `source` citing authorities; add Mậu Hóa Khoa school note; correct any field that disagrees with external (surface if engine bug) | `tests/validation/referenceData.ts` | R-1 / R-2 / AC-1 | 2/2 |
| 4 | Annotate `generateMode`: emits **provisional `verified:false` only**, never blesses | `tests/validation/runValidation.ts` | AC-1 | 1/1 |
| 5 | `runValidation` summary line: report `verified+sourced` count vs provisional | `tests/validation/runValidation.ts` | R-5 | 1/1 |

### Rule compliance (`docs/ENGINEERING_RULES.md`)
- No `src/core/**` change (data/test only) — purity untouched. ✅
- Testing DoD: proving test added; `npm test` + `npm run build` before done. ✅
- C-1 honoured and now machine-enforced by the guard test. ✅

### Verification plan (per-AC, layer-matched)
| AC / requirement | risk layer | proof artifact | layer-match? |
|------------------|-----------|----------------|--------------|
| AC-1 ≥2 verified+sourced; generateMode doesn't bless | logic/data | unit — guard test (verified⇒source, count≥2) + manual-recorded external verification per seed chart (spike) | ✅ |
| R-2 engine agrees with external for seed | logic/data | existing `fullValidation`/`runValidation` engine-vs-reference comparison, now over externally-sourced expecteds | ✅ |
| AC-3 validate passes | logic | `npm run validate` | ✅ |

**Deferred (recorded, not coverage gaps for this run):** R-4 brightness 168-cell audit → **Slice C**; scale to 25–40 charts → **Slice B**. Follow-up tickets to be drafted at finalise.

### Proving test
`tests/referenceCorpus.test.ts` — asserts (a) every `verified:true` case has a non-empty `source`, (b) `REFERENCE_CASES.filter(c=>c.verified).length ≥ 2`. **Fails pre-change** (0 verified cases → (b) fails), **passes post-change** (seed promoted with sources). Invocation: `npm test -- referenceCorpus` (and full `npm test` / `npm run validate`).

### Rollback + porting
- **Rollback:** single commit; `git revert` removes the `source` field, guard test, and seed promotions together.
- **Porting:** single repo (`app`); no cross-repo port.

### SCOPE: M (Slice A) — TRACK: backend — TIER: full
Branch type `chore` (test/validation infrastructure). Change-list = schema + guard + small seed; matches the Gate-0-approved Slice A. No outgrowth.

### Session status update
- **Phase:** 2 (design) COMPLETE → **STOP at Gate 2**
- Branch to create on approval: `chore/reference-corpus-seed`

---

## PHASE 3 — EXECUTE → HALTED (caught-defect escalation, outside scope)

**Branch `chore/reference-corpus-seed` created; NO commits, NO code changes made.** Seed verification (the corpus working as designed) caught a P0 engine bug well outside Slice-A scope.

### Caught defect: `CUC_TABLE` is wrong (`src/core/tuvi/cuc.ts`)
- **Trigger:** external verification of seed chart #5 (25/01/2020, Canh Tý, Mệnh Dần). Engine → Kim Tứ Cục (4); authoritative → **Thổ Ngũ Cục (5)**.
- **Confirmed 3 ways:** my nạp-âm derivation; a 2-method research agent (nạp-âm + arithmetic, 12/12); and the **verbatim published Cục grid** at tuvisaigon.vn.
- **Rule:** Cục = ngũ-hành of the nạp-âm of the Mệnh-palace can-chi (stem via Ngũ Hổ Độn). A correct Cục row therefore consists of **6 adjacent equal pairs** (nạp âm pairs two consecutive can-chi). **Every engine row lacks this pairing** → the table is structurally invalid, not a school variant.
- **Correct {Ất,Canh} row** [Tý..Hợi]: `[6,6,5,5,4,4,3,3,2,2,5,5]`; **engine has** `[6,2,4,3,6,5,2,4,3,6,5,2]`.
- **Impact:** Cục seeds the Tử Vi position → a wrong Cục mis-places ALL 14 main stars for affected charts (and aux/brightness downstream). Affects ~all year-Can groups; only coincidental cells are right (e.g. Mậu/Quý@Dậu=Mộc3, which is why 15/04/1988 happened to verify correct).
- **Why it survived:** (B1) reference `cucValue` is engine-generated → validation compared engine to its own wrong output; and the structural invariants (trine/mirror) only check star *relationships*, which hold regardless of where the (wrong) Cục places the system.

### Action (per mango: surface, don't absorb)
HALT Slice A. Fixing `cuc.ts` is `src/core` core-math, out of this ticket's scope, and is a higher priority than the corpus (the corpus sits on top of Cục). Escalated to user for re-scope decision. Slice A's seed cannot proceed on chart #5 until Cục is fixed.

---

## Requirements matrix (synthesized from prose)

| ID | Source | Verbatim (condensed) | Interpretation | Ph1 evidence | Status |
|----|--------|----------------------|----------------|--------------|--------|
| C-1 | §Constraint | "Reference values come only from external sources, never engine output" | Global constraint on the corpus | `referenceData.ts` header: "bootstrapped from our engine" → currently violated | confirmed |
| R-1 | §Scope.1 | Pick 25–40 birth datetimes spanning edge cases (leap, day1/30, hour Tý 23:00/00:30, Lập Xuân, Tết, both genders, 1900s+2000s) | Curate the input set | 21 existing cases cover many edges already | partial (have 21) |
| R-2 | §Scope.2 | Compute expected via **2–3 independent reputable engines/sources (not this app)**; accept only on agreement; record disagreements as school-dependent | **The hard part — needs an external oracle** | I cannot run external SPA engines (no browser tool) and AI computation is unreliable (proven this session) | **gap — feasibility blocker** |
| R-3 | §Scope.3 | Store as `referenceData.ts` with `verified:true` + `source:`; never regen from engine | Schema change + data | interface has **no `source` field**; 0 source fields present | gap |
| R-4 | §Scope.4 | Use corpus to verify **brightness** table cell-by-cell; fix mismatches | 168-cell audit | `brightness.ts` declares "mainstream/Northern school"; expected schema has **no brightness field** | gap (large; school-dependent) |
| R-5 | §Scope.5 | Validation compares engine → external reference | Harness already compares; refs just aren't external | `runValidation.ts` already diffs engine vs `referenceData` | mostly present |
| AC-1 | §AC.1 | ≥25 charts `verified:true` + sources; `generateMode` no longer blesses values | Count + provenance | 1/21 verified:true; generateMode writes verified:false | pending |
| AC-2 | §AC.2 | Brightness mismatches resolved against sources or flagged school-dependent | — | brightness is inherently school-variant → expect many "flagged" | pending |
| AC-3 | §AC.3 | `npm run validate` passes against external corpus | — | validate currently 20/20 vs engine-blessed refs | pending |

**SECTIONS: 4 found (Context, Scope, Acceptance criteria, Constraint) | 4 decomposed | ROWS: C=1, R=5, G=0, AC=3**

---

## AC validation (re-derived independently)
| Claim | Ticket value | My computation | Match? |
|-------|-------------|----------------|--------|
| Min charts | "25–40" / "≥25" | Current = 21 → need ≥4 new AND re-verify 21 externally | ⚠ all 21 currently engine-blessed |
| Brightness cells | "cell-by-cell" | 14 stars × 12 positions = **168 cells** (many school-dependent) | computed |
| `source` field | implied | **absent** from `ReferenceCase` — schema change required | gap |
| Aux/brightness in refs | implied by R-4 | `expected` schema has neither → schema extension required | gap |

No numeric mismatch worth a silent correction; flagged as gaps.

---

## Universal inventory (denominators)
- **Corpus:** N ≥ 25 charts, each fully externally verified (per-item; review must confirm provenance of every chart).
- **Brightness:** 168 cells (14 × 12) to verify/flag.

## Cause / gap analysis (taxonomy: `validation`/`data`)
- **R-2/C-1 → `validation`**: no independent oracle; `runValidation.ts` `generateMode` writes `verified:false` engine output (the B1 root cause).
- **R-3 → `data`**: `ReferenceCase` interface lacks `source`; `expected` lacks aux/brightness fields (`tests/validation/referenceData.ts`).

## Blast radius
`tests/validation/referenceData.ts` (interface + data), `tests/validation/runValidation.ts` (generateMode / comparison), `tests/fullValidation.test.ts`. Brightness fixes (if any) → `src/core/tuvi/brightness.ts`. No app/UI files. Pure data/test + possibly one core table.

## TRACK / SCOPE / TIER
- **TRACK: backend** — `tests/` + possibly `brightness.ts`; 0 UI files.
- **SCOPE: L → likely XL.** 25–40 fully-verified charts + 168 brightness cells + schema change is well beyond one tractable run. **Recommend split** (CLARIFICATION 3).
- **TIER: full** — universal "for each of N≥25" + brightness 168; domain-critical.

---

## CLARIFICATION: 3 raised | 0 self-resolved | 3 for human decision → STOP at Gate 0
1. **(mandatory, synthesized)** Confirm my reading of this freeform ticket (matrix above).
2. **(feasibility — decisive)** R-2 needs an external oracle. I **cannot** run dedicated lá-số SPA engines (no browser tool) and AI computation is unreliable (this session proved it). How do we source ground truth? — see Gate question.
3. **(scope split)** This is L/XL. Recommend slicing this run to a provable foundation; defer the bulk. — see Gate question.
