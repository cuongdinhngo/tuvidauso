# Ticket: C3 + C4 — lunar calendar (UTC+7) & solar-term boundary precision

**Priority:** P2 (upstream correctness — affects which lunar day/month feeds an-sao)
**Track:** backend (`src/core/calendar/{lunarData,jieQi}.ts` + tests)

## Context
Everything downstream (an-sao, Mệnh/Thân, Cục, Bát Tự) depends on the solar→lunar conversion and solar-term boundaries. Two known precision gaps:

### C3 — Lunar calendar timezone
`lunarData.ts` uses the China-derived packed table (**UTC+8**). Vietnam's official lunar calendar is computed at **UTC+7** and diverges on some dates (Tết boundary; certain years' leap month differs). For a Vietnamese Tử Vi app this changes an-sao on boundary dates.

### C4 — Solar terms (Tiết Khí)
`jieQi.ts` returns **day-only** term dates via a polynomial approximation — no time-of-day, no exception-year corrections. Births on a term boundary day (esp. **Lập Xuân**, which flips the Bát Tự YEAR pillar) can be assigned to the wrong pillar.

## Scope
1. Diff this engine's solar→lunar output against **Hồ Ngọc Đức's Vietnamese âmlịch** algorithm across 1900–2100, especially around new-moon / Tết boundaries. Either switch to a UTC+7 astronomical computation or document the limitation explicitly.
2. Upgrade solar-term computation to include the **instant (time)** of each term; OR, interim: detect "born within ±1 day of a Jie term" and surface a "boundary case — verify manually" flag.

## Acceptance criteria
- Documented (or fixed) divergence vs the Vietnamese standard across the range.
- Term-boundary births either resolved by time or flagged.
- Regression tests for known boundary dates (Tết, Lập Xuân).

## Constraint (C-1)
Calendar output justified against an external standard (Hồ Ngọc Đức / astronomical), never engine output.
