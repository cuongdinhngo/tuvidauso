# Ticket: An-sao audit — Hỏa/Linh Tinh + remaining auxiliary stars

**Priority:** P1 (highest remaining accuracy risk)
**Track:** backend (`src/core/tuvi/auxStars.ts` + tests)
**Follows:** PR #20 (Triệt Lộ, Cô Thần/Quả Tú). Continues the "don't stop at A1/A2" mandate from `docs/tickets/accuracy-audit.work.md`.

## Context
PR #20 verified the structurally-determined placements and fixed Triệt Lộ + Cô Thần/Quả Tú. The remaining auxiliary stars in `auxStars.ts` have **never been independently verified** against an authoritative source.

## Highest-risk item: Hỏa Tinh / Linh Tinh
Current code (`auxStars.ts`) places both by year-Chi group start + **thuận** (forward) by hour, with **no gender / âm-dương-year dependence**. Multiple authoritative schools make the start palace and/or direction depend on gender and yin/yang of the birth year, and **Linh Tinh frequently runs nghịch (backward)**. This is the single most likely remaining defect.

## Scope
1. Research the authoritative Vietnamese Tử Vi rule for **Hỏa Tinh & Linh Tinh** (start palace by year-Chi group, direction, and any gender/âm-dương dependence). Cite 2–3 reputable sources; state the mainstream school.
2. Rule-by-rule sweep of the remaining unverified aux stars: Thiên Quan, Thiên Phúc, Thiên Trù, Quốc Ấn, Đường Phù, Thiên Hình, Thiên Riêu, Tam Thai, Bát Tọa, Phá Toái, Thiên Không, Đại Hao, Tiểu Hao, Thiên La, Địa Võng, Thiên Thương, Thiên Sứ.
3. Fix any confirmed defects; add reference-data-free **structural invariants** where they exist (e.g. Thiên Thương/Thiên Sứ are opposite Văn Xương/Văn Khúc by ±6; Đại/Tiểu Hao adjacency).

## Acceptance criteria
- Each placement either confirmed correct (with a cited source comment) or fixed.
- Tests assert **sourced** values, never engine output (constraint C-1).
- New invariants added to `tests/auxStarsInvariants.test.ts`.
- `npm test` + `npm run validate` + `npm run build` green.

## Constraint (C-1)
Any change to `src/core/**` must be justified against an external source or a proven invariant — never against engine-generated reference data.

<!-- ===== MANGO WORKING DOC (below this line is NOT part of the raw ticket) ===== -->
# tuvi-hoa-linh-aux-sweep — Aux-star accuracy sweep

**work_doc_mode:** auto → local-file ticket → working doc appended below separator
**STRUCTURE:** synthesized (ticket uses Context/Scope/AC prose, not the C/R/G/AC header schema)

## Session status
- **Phase:** DONE — **merged in PR #22** (on `main`). 14 of 19 aux stars corrected; gender threaded into `placeAuxStars`.
- **Revert path:** `git revert` the merge commit of PR #22.
- **Durable lesson:** recorded to `docs/LESSONS.md` (aux-star-sweep — systematic untested an-sao errors; invariants ≠ correctness; prioritise C2 corpus).
- **Branch:** `fix/aux-star-accuracy-sweep` · **reviewed commit:** `2c09ee2`
- **Reviewed at `2c09ee2`** — files: `src/core/tuvi/auxStars.ts`, `src/core/compare/buildProfile.ts`, `tests/auxStarsInvariants.test.ts`, `tests/{fullValidation,aiPrompts}.test.ts`, `tests/validation/quickCheck.ts`
- **TIER:** full · **TRACK:** backend · **SCOPE:** **L**

---

## PHASE 4 — REVIEW (CLEAN)

**Reviewer (Sonnet): LGTM** — no Critical/Important. Verified independently: Dương-Nam/Âm-Nữ predicate (Can parity), Hỏa/Linh opposite directions, Đại Hao⊥Tiểu Hao Δ6 (∀ d), Phá Toái 3-group mapping, by-Can tables match cited sources, Đường Phù=Quốc Ấn−3 (∀), Tam Thai/Bát Tọa anchors, Thiên Thương/Sứ=Mệnh−7/−5 straddling Thiên Di. All 6 call sites threaded; no orphans; `src/core` purity preserved; Vietnamese intact; tests non-tautological. (Minor: pre-existing dead `placeAuxStars` import in `runValidation.ts` — out of scope.)

**Challenger (ticket-blind): 5 met, 1 partial → RESOLVED.** R2a ("each placement confirmed-with-source-comment or fixed") flagged 5 confirmed-correct stars (Thiên Hình, Thiên Riêu, Thiên Không, Thiên La, Địa Võng) lacking a citation comment. **Looped back → added `verified ✓ <source>` comments (commit `2c09ee2`, comment-only).** All 19 targets now carry a source/verified comment (grep-confirmed). R1, R3–R7 MET. Re-review delta is comment-only → reviewer LGTM on logic stands.

**Scope reconciliation:** diff = the 6 approved files only (+ working doc); no creep; `buildProfile`/test-caller updates are mechanical signature changes, not creep. SCOPE=L held; branch type `fix` matches.

**Proving test:** green at HEAD; fails without the change (encodes corrected values + invariants). `npm test` 1294; `validate` 20/20; `build` clean; lint clean on changed files.

### Ph3/4 proven by (k/N)
| Row | Proven by | k/N |
|-----|-----------|-----|
| R-1 Hỏa/Linh | direction-flip assertion + reviewer arithmetic | 2/2 |
| R-2 sweep (19 stars) | 14 fixed w/ source + WebFetch reconfirm; 5 confirmed-correct w/ citation; all 19 commented | 19/19 |
| R-3 invariants | Song Hao Δ6, Phá Toái set, Đường Phù−3, straddle Δ2, Cô/Quả | green |
| AC-2 non-tautology | reviewer + challenger confirmed sourced expecteds | pass |
| AC-4 | test 1294 / validate 20/20 / build / lint | pass |

**Reviewed at `2c09ee2`** (stale-review guard).

---

## PHASE 3 — EXECUTE (autonomous, complete)

### Independent reconfirmation (C-1, before editing)
- **Thiên Quan** full table → WebFetch tracuutuvi.com/sao-thien-quan.html: matches corrected values verbatim (Giáp Mùi, Ất Mùi, Bính Thìn, …, Quý Ngọ). ✅
- **Phá Toái** → WebFetch tuvi.cohoc.net: Tý/Ngọ/Mão/Dậu→Tị, Dần/Thân/Tị/Hợi→Dậu, Thìn/Tuất/Sửu/Mùi→Sửu. ✅
- **Đường Phù** → structural cross-check: = Quốc Ấn − 3 in all 10 cells (verified arithmetically + asserted as invariant). ✅

### Implemented (diff ⊆ approved list)
14 stars corrected in `auxStars.ts`; signature extended with `gender, menhCung`; sole prod caller `buildProfile.ts:43` + 3 test callers updated; proving test + 6 invariant blocks added. The 5 confirmed-correct stars (Thiên Không, Thiên Hình, Thiên Riêu, Thiên La, Địa Võng) untouched (asserted).

### Verification sweep
- **Diff ⊆ approved change-list:** exactly the 6 approved code/test files + working doc; no file outside the list; no untouched-line reformatting. Every hunk maps to a change-list row.
- **Proving test fails-pre/passes-post:** new assertions (Phá Toái Tý→Tị, Đại Hao⊥Tiểu Hao Δ6, Thiên Quan Bính→Thìn, Tam Thai m1d1→Thìn, Thiên Thương/Sứ straddle Thiên Di, Hỏa/Linh direction-flip) all encode the corrected behaviour; pre-change logic violates them.
- **No orphans:** `yearChiIdx` (removed-use) is a separate local in `getHongLoan`; `vanXuongPos/vanKhucPos` still used by Văn Xương/Khúc.

### Full sweep results
- `npm test` → **1294 passed (14 files)** (+24 from new aux assertions).
- `npm run validate` → **20/20 PASSED**.
- `npm run build` → clean (only pre-existing chunk-size warning).
- `npm run lint` (changed files) → clean.

### Ph3/4 proven by (k/N)
| Row | Proven by | k/N |
|-----|-----------|-----|
| R-1 Hỏa/Linh direction | direction-flip assertion + Đại Hạn-parity logic | 2/2 |
| R-2 corrected tables | per-cell sourced assertions + WebFetch reconfirm (Thiên Quan, Phá Toái) + Đường Phù=Quốc Ấn−3 invariant | 12/12 stars |
| R-3 invariants | Đại Hao⊥Tiểu Hao, Phá Toái∈{Tị,Dậu,Sửu}, Cô/Quả, Thiên Thương/Sứ straddle Thiên Di, Đường Phù−3 | green |
| AC-4 | npm test 1294 + validate 20/20 + build + lint | pass |

### Scope check
No growth beyond the Gate-0-approved **L**. Branch type `fix` matches change type. No outgrew-its-ticket nudge.

## Decision log
- **Gate 0 (resolved):** (1) Synthesized reading confirmed by user ("best recommendation"). (2) Scope: **absorb Hỏa/Linh gender-threading now → SCOPE re-declared M→L**; thread `gender` through `placeAuxStars` + `buildProfile` + store pipeline + callers in this ticket. Hỏa/Linh is the headline P1 item; splitting it would gut the ticket.
- **Design research (5 parallel agents, sourced):** swept all 19 targets vs tracuutuvi.com, tuvi.cohoc.net, tracuulasotuvi.com, hocvienlyso.org, tuvilyso.org, TVĐS Tân Biên. **14 of 19 are WRONG.** Notably the ticket's own suggested invariant ("Thiên Thương/Sứ ⊥ Xương/Khúc ±6") is itself wrong — those stars are fixed at Nô Bộc/Tật Ách palaces. Magnitude confirms SCOPE=L; still within the ticket's "fix confirmed defects" mandate.

---

## PHASE 2 — DESIGN

### Approach
Single pure-function rewrite of the wrong placements in `auxStars.ts`, justified per-star against external sources (C-1). Extend `placeAuxStars`' signature with `gender` + `menhCung` (both already available at the sole production call site `buildProfile.ts:43`), correct the 14 wrong stars, and lock the structural relationships with reference-data-free invariants. Because the audience is dogmatic and 14 cells change, **execute will WebFetch-reconfirm each full-table replacement against its cited source before committing** (belt-and-suspenders on the agent research).

### Research verdict (19 targets)
| Star | Derivation | Current | Verdict | Correct (sourced) |
|------|-----------|---------|---------|-------------------|
| Hỏa Tinh | chi-group + hour | thuận only, no gender | ❌ direction | start tables OK; dir = thuận if Dương-Nam/Âm-Nữ else nghịch |
| Linh Tinh | chi-group + hour | thuận only | ❌ direction | always opposite Hỏa |
| Đại Hao | year Chi | = yearChi | ❌ mechanism | = Lộc Tồn + 9·d (d=±1 by Dương-Nam/Âm-Nữ) |
| Tiểu Hao | year Chi | = yearChi+1 | ❌ mechanism | = Lộc Tồn + 3·d; always đối cung Đại Hao |
| Phá Toái | year Chi | Tị/Dậu swapped | ❌ 8/12 | Tý/Ngọ/Mão/Dậu→Tị; Dần/Thân/Tị/Hợi→Dậu; Thìn/Tuất/Sửu/Mùi→Sửu |
| Thiên Quan | year Can | — | ❌ 8/10 | Giáp Mùi, Ất Mùi, Bính Thìn, Đinh Dần, Mậu Mão, Kỷ Dậu, Canh Hợi, Tân Dậu, Nhâm Tuất, Quý Ngọ |
| Thiên Phúc | year Can | — | ❌ Nhâm | Nhâm Dậu→**Ngọ** (Bính Tý vs Thân = source split → LEAVE, note) |
| Thiên Trù | year Can | — | ❌ 5/10 | Bính→Tý, Đinh→Tị, Mậu→Ngọ, Canh→Dần, Tân→Ngọ |
| Quốc Ấn | year Can | — | ❌ 2/10 | Nhâm→Mùi, Quý→Thân |
| Đường Phù | year Can | — | ❌ 10/10 | Giáp Mùi, Ất Thân, Bính Tuất, Đinh Hợi, Mậu Tuất, Kỷ Hợi, Canh Sửu, Tân Dần, Nhâm Thìn, Quý Tị |
| Tam Thai | lunar day | absolute from Tý | ❌ | = Tả Phụ + (day−1) thuận |
| Bát Tọa | lunar day | absolute mirror | ❌ | = Hữu Bật − (day−1) nghịch |
| Thiên Thương | derived | Văn Xương+6 | ❌ | = cung Nô Bộc = menhIdx−7 |
| Thiên Sứ | derived | Văn Khúc+6 | ❌ | = cung Tật Ách = menhIdx−5 |
| Thiên Không | year Chi | yearChi+1 | ✅ | keep (Thiếu Dương, attested) |
| Thiên Hình | lunar month | Dậu+fwd | ✅ | keep |
| Thiên Riêu | lunar month | Sửu+fwd | ✅ | keep |
| Thiên La | fixed | Thìn | ✅ | keep |
| Địa Võng | fixed | Tuất | ✅ | keep |

**Dương-Nam/Âm-Nữ predicate:** `yangYear = (THIEN_CAN.indexOf(yearCan) % 2 === 0)` (Giáp/Bính/Mậu/Canh/Nhâm = dương); `dnan = (yangYear && male) || (!yangYear && female)`; direction `d = dnan ? +1 : −1`. Same parity split as Đại Hạn direction.

### Rejected alternatives
- **Fix only Hỏa/Linh (the ticket's headline), defer the rest** — rejected: research proved 12 *more* stars wrong; the ticket mandate is "verify each of N and fix defects." Deferring known, now-sourced defects would re-bless wrong data (the B1 anti-pattern).
- **Trust agent research, skip source re-fetch in execute** — rejected: 14 changed cells for a dogmatic audience; one agent self-corrected mid-run. C-1 + the blast radius justify a WebFetch reconfirm of the full-replacement tables.
- **Drop Đại Hao/Tiểu Hao rather than thread gender** — rejected: gender threading is already approved (Gate 0) and needed for Hỏa/Linh anyway; the Lộc Tồn anchor is well-sourced.
- **Add the ticket's suggested Thiên Thương/Sứ ⊥ Xương/Khúc invariant** — rejected: that invariant is FALSE; the correct invariant is Thiên Thương/Sứ giáp (straddle) Thiên Di.

### Assumptions
| Assumption | Tag | Resolution |
|-----------|-----|-----------|
| Mainstream school = Vân Đằng Thái Thứ Lang; corrected values above | verified | 2–3 concurring sources per star, quoted verbatim by research agents; execute re-fetches full-table replacements |
| Hỏa/Linh & Song Hao direction keys on Dương-Nam/Âm-Nữ (year-Can parity × gender) | verified | tracuutuvi.com + hoctuvi verbatim; same split as existing Đại Hạn direction |
| `gender` + `menhCung` available at the only production call site | verified | `buildProfile.ts:36` computes `menh`; `BirthInfo.gender` in scope; `buildTuViChart` serves BOTH main chart + compare |
| Thiên Phúc Bính is school-split (Tý vs Thân) | verified (leave unchanged) | sources disagree → C-1 forbids changing on disagreement; keep Tý, add code comment noting the split |
| `placeAuxStars` is pure (no gender/menh side-effects elsewhere) | verified | grep: sole prod caller is `buildProfile.ts:43`; rest are tests |

No `novel-untested` third-party/runtime assumption (pure function; domain assumptions resolved by sourced research = the spike). → Gate 2 not blocked on that axis.

### Smallest change-list
| # | Change | File/area | Ph2 covered by | k/N |
|---|--------|-----------|----------------|-----|
| 1 | Extend signature `placeAuxStars(yearCan, yearChi, lunarMonth, lunarDay, hourIndex, gender, menhCung)` + Dương-Nam/Âm-Nữ helper | `auxStars.ts:153` | R-1 | 1/1 |
| 2 | Hỏa Tinh / Linh Tinh: direction by `dnan` (start tables unchanged) | `auxStars.ts:180-183` | R-1 | 2/19 |
| 3 | Đại Hao / Tiểu Hao: Lộc Tồn ± offset, drop year-Chi logic | `auxStars.ts:204-206` | R-2 | 2/19 |
| 4 | Phá Toái table rebuild (8 cells) | `auxStars.ts:91-95` | R-2 | 1/19 |
| 5 | Thiên Quan table replace (8 cells) | `auxStars.ts:104-108` | R-2 | 1/19 |
| 6 | Thiên Phúc: Nhâm→Ngọ (Bính left, commented) | `auxStars.ts:110-114` | R-2 | 1/19 |
| 7 | Thiên Trù: 5 cells | `auxStars.ts:116-120` | R-2 | 1/19 |
| 8 | Quốc Ấn: Nhâm→Mùi, Quý→Thân | `auxStars.ts:122-126` | R-2 | 1/19 |
| 9 | Đường Phù table replace (10 cells) | `auxStars.ts:128-132` | R-2 | 1/19 |
| 10 | Tam Thai = Tả Phụ+(day−1); Bát Tọa = Hữu Bật−(day−1) | `auxStars.ts:220-221` | R-2 | 2/19 |
| 11 | Thiên Thương = menhIdx−7 (Nô Bộc); Thiên Sứ = menhIdx−5 (Tật Ách) | `auxStars.ts:228-229` | R-2 | 2/19 |
| 12 | Update sole prod caller to pass `gender, menhCung` | `compare/buildProfile.ts:43` | R-1 | 1/1 |
| 13 | Update 5 test callers + `tests/validation/{runValidation,quickCheck}.ts` to new signature | tests | AC-4 | 6/6 |
| 14 | Add invariants + proving assertions to `tests/auxStarsInvariants.test.ts`, each with source citation | `tests/auxStarsInvariants.test.ts` | R-3 / AC-1/2/3 | — |

Cited-source comments added per corrected table (AC-1). Stars confirmed correct (Thiên Không, Thiên Hình, Thiên Riêu, Thiên La, Địa Võng) get a brief "verified ✓ <source>" comment, no value change.

### Rule compliance (`docs/ENGINEERING_RULES.md`)
- `src/core/**` stays pure (named export, deterministic) — signature gains params but no I/O. ✅
- All user-facing strings remain Vietnamese (star names unchanged). ✅
- Testing DoD: proving test added; `npm test` + `npm run build` + `npm run lint` before done. ✅

### Verification plan (per-AC, layer-matched)
| AC / requirement | risk layer | proof artifact | layer-match? |
|------------------|-----------|----------------|--------------|
| R-1 Hỏa/Linh direction by gender | logic | unit — assert Hỏa/Linh positions flip with gender×year parity; Hỏa≠Linh direction | ✅ |
| R-2 each corrected table | logic | unit — assert sourced value per fixed cell (fails pre) + WebFetch source reconfirm (execute, recorded) | ✅ |
| R-3 invariants hold ∀ chart | logic | unit — Đại Hao⊥Tiểu Hao (Δ6); Thiên Thương/Sứ straddle Thiên Di (Δ2); Phá Toái∈{Tị,Dậu,Sửu}; Thiên La=Thìn, Địa Võng=Tuất — over fuzz sweep | ✅ |
| AC-2 tests assert sourced values | process | tests carry source-citation comments; no engine-derived expecteds | ✅ |
| AC-4 test+validate+build green | logic/data | `npm test`, `npm run validate`, `npm run build` | ✅ |

No ❌ rows → no coverage-gap exclusions. (TRACK=backend → no frontend surfaces, no DESIGN.md, no M-gates.)

### Proving test
`tests/auxStarsInvariants.test.ts` — new block asserting sourced values + invariants that **fail pre-change**:
- Phá Toái: tuổi Tý → **Tị** (pre: Dậu).
- Đại Hao ⊥ Tiểu Hao: Δ = 6 (pre: Δ = 1 → fails hard).
- Thiên Quan: Bính → **Thìn** (pre: Tý).
- Tam Thai: month 1/day 1 → **Thìn** (pre: Tý).
- Thiên Thương/Thiên Sứ: straddle Thiên Di, Δ = 2 (pre: derived from Xương/Khúc → fails).
- Hỏa/Linh: Dương-Nam vs Âm-Nam flips direction for a fixed (year, hour).
Invocation: `npm test -- auxStarsInvariants` (and full `npm test` / `npm run validate`).

### Rollback + porting
- **Rollback:** single commit; `git revert` restores the tables + signature together. Signature change is contained (1 prod caller).
- **Porting:** single repo (`app`); no cross-repo port.

### SCOPE: L (confirmed at Gate 0) — TRACK: backend — TIER: full
Branch type = `fix` (correctness bug fixes); no branch/PR-type drift. Realized change-list = the 14 sourced defects + signature + tests, matching the Gate-0-approved L scope. No further outgrowth beyond the approved re-scope.

### Session status update
- **Phase:** 2 (design) COMPLETE → **STOP at Gate 2**
- Branch to create on approval: `fix/aux-star-accuracy-sweep`

---

## Requirements matrix (synthesized from prose)

| ID | Source | Verbatim (condensed) | Interpretation | Ph1 evidence | Status |
|----|--------|----------------------|----------------|--------------|--------|
| C-1 | §Constraint | "changes to `src/core/**` justified vs external source or proven invariant — never engine reference data" | Global constraint on HOW any fix is justified | `auxStars.ts` is pure `src/core/` | confirmed |
| R-1 | §Highest-risk + §Scope.1 | Research & correctly place **Hỏa Tinh / Linh Tinh** (start palace by year-Chi group, direction, gender/âm-dương dependence); cite 2–3 sources; state mainstream school; fix if wrong | The headline P1 item | `auxStars.ts:48-54,180-183`: chi-group start + **thuận by hour, NO gender/âm-dương dependence**; Linh often runs nghịch in mainstream → suspected defect | gap confirmed (likely defect) |
| R-2 | §Scope.2 | Rule-by-rule verify the **17 listed** remaining aux stars; fix confirmed defects | Per-item verification checklist (17 rows) | tables at `auxStars.ts:77-143`,`216-229`; never externally verified | gap (unverified) |
| R-3 | §Scope.3 | Add reference-data-free **structural invariants** where they exist | New invariants in test file | `tests/auxStarsInvariants.test.ts` exists (PR #20) | gap |
| AC-1 | §AC.1 | Each placement confirmed (cited comment) or fixed | Output: cited source per table | — | pending |
| AC-2 | §AC.2 | Tests assert **sourced** values, never engine output (C-1) | No tautological tests | prior bug pattern (B1) | pending |
| AC-3 | §AC.3 | New invariants added to `tests/auxStarsInvariants.test.ts` | — | file present | pending |
| AC-4 | §AC.4 | `npm test` + `npm run validate` + `npm run build` green | Full sweep | baseline green @ `861e2cf` | pending |

**SECTIONS: 5 found (Context, Highest-risk Hỏa/Linh, Scope, Acceptance criteria, Constraint) | 5 decomposed | ROWS: C=1, R=3 (R-2 expands to 17 per-item), G=0, AC=4**
(Context = background, no requirement. Scope.1 folded into R-1.)

---

## AC validation (re-derived independently)

| Claim | Ticket value | My computation | Match? |
|-------|-------------|----------------|--------|
| # aux stars to sweep in R-2 | "~17" | Listed set = exactly **17** (Thiên Quan, Thiên Phúc, Thiên Trù, Quốc Ấn, Đường Phù, Thiên Hình, Thiên Riêu, Tam Thai, Bát Tọa, Phá Toái, Thiên Không, Đại Hao, Tiểu Hao, Thiên La, Địa Võng, Thiên Thương, Thiên Sứ) | ✅ |
| Total verification denominator | (implicit) | **N = 19** (17 + Hỏa Tinh + Linh Tinh) | ✅ computed |
| Invariant example: Thiên Thương/Sứ ⊥ Xương/Khúc | "by ±6" | `auxStars.ts:228-229`: `+6` of Văn Xương / Văn Khúc | ✅ consistent |
| Invariant file | `tests/auxStarsInvariants.test.ts` | exists (created in PR #20) | ✅ |

No AC numeric mismatch → **no AC-derived Gate-1 question.**

---

## Universal inventory (denominator N = 19 verification targets)
R-2/R-1 is a counted **"verify each of N"** requirement → per-item checklist; review must confirm **every** star, not a total.

1. Hỏa Tinh · 2. Linh Tinh · 3. Thiên Quan · 4. Thiên Phúc · 5. Thiên Trù · 6. Quốc Ấn · 7. Đường Phù · 8. Thiên Hình · 9. Thiên Riêu · 10. Tam Thai · 11. Bát Tọa · 12. Phá Toái · 13. Thiên Không · 14. Đại Hao · 15. Tiểu Hao · 16. Thiên La · 17. Địa Võng · 18. Thiên Thương · 19. Thiên Sứ

**Out of scope (per ticket — already verified prior sessions):** Lộc Tồn, Kình Dương, Đà La, Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt, Thiên Mã, Đào Hoa, Hồng Loan, Thiên Hỉ, Địa Không, Địa Kiếp, Cô Thần, Quả Tú.

## Cause / gap analysis (taxonomy: `logic`/`data`)
- **R-1 Hỏa/Linh → `logic`/`data`** (`auxStars.ts:48-54` start tables, `:180-183` placement): missing gender/âm-dương dependence + possible wrong direction (Linh Tinh).
- **R-2 → `data`** (lookup tables `:77-143`,`216-229`): unverified against external source.

## Blast radius
`placeAuxStars(yearCan, yearChi, lunarMonth, lunarDay, hourIndex)` — **6 call sites**: `compare/buildProfile.ts:43`, `tests/{fullValidation,aiPrompts,auxStarsInvariants}.test.ts`, `tests/validation/{runValidation,quickCheck}.ts`. **No `gender` parameter today.** If R-1's correct rule needs gender/âm-dương, the signature must gain a `gender` arg threaded from `BirthInfo` through `buildProfile` + the store pipeline + all 6 callers → pushes SCOPE toward **L**. Gender IS available upstream (`tuViStore.ts:12`, `BirthInfo`).

## TRACK / SCOPE / TIER
- **TRACK: backend** — touched files `src/core/tuvi/auxStars.ts` + `tests/`; 0/N under UI paths. (Gender threading would add `buildProfile`/store — still non-UI.)
- **SCOPE: M** baseline — single core file + tests + research. ⚠ gender-threading would cross to **L** (outgrew-nudge fires at Gate 2 if confirmed).
- **TIER: full** — universal "verify each" requirement with **N = 19 > 1**, multiple rows, domain-critical correctness.

---

## CLARIFICATION: 2 raised | 0 self-resolved | 2 for human decision → STOP at Gate 0
1. **(mandatory, synthesized)** Confirm my reading of this freeform ticket (matrix above): N = 19 verification targets, the 17 prior-verified stars excluded, C-1 binding.
2. **(scope boundary)** Hỏa/Linh Tinh placement is genuinely school-dependent and the mainstream rule likely needs a **gender/âm-dương-year parameter** that `placeAuxStars` doesn't have. Fixing it properly expands the signature + 6 callers + the store pipeline (SCOPE M→L). Two options — see Gate question.
