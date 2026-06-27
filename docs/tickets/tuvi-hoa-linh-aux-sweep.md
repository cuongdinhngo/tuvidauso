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
