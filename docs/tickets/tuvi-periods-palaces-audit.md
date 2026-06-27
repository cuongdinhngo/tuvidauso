# Ticket: Audit Đại Hạn / Tiểu Hạn / Lưu niên + palace relations & ratings

**Priority:** P2
**Track:** backend (`src/core/tuvi/{majorPeriod,yearlyPeriod,periodTransforms,palaceRelations,palaceRating}.ts` + tests)
**Follows:** PR #20.

## Context
These subsystems have not been audited against authoritative rules. A wrong period direction or start shifts every Đại Hạn / Tiểu Hạn across the whole life timeline; wrong palace relations corrupt "chiếu" (influence) logic used throughout interpretation.

## Scope
1. **Đại Hạn** (`majorPeriod.ts`) — verify start palace and direction. Direction depends on **gender × year Can yin/yang** (dương nam / âm nữ → thuận; âm nam / dương nữ → nghịch). Confirm the Cục value sets the starting age correctly.
2. **Tiểu Hạn** (`yearlyPeriod.ts`) — verify start palace by year-Chi group and direction (gender-dependent), and Lưu niên Thái Tuế placement.
3. **Period Tứ Hóa** (`periodTransforms.ts`) — verify đại-hạn / lưu-niên transforms layer onto the correct Can.
4. **Palace relations** (`palaceRelations.ts`) — verify Tam hợp (4 triangles), Đối cung (opposite), Giáp cung (adjacent pair).
5. **Palace ratings** (`palaceRating.ts`) — verify the rating heuristic against documented criteria.

## Acceptance criteria
- Each rule confirmed (cited) or fixed.
- Structural invariants added where provable (e.g. Tam hợp members differ by 4; Đối cung by 6; Đại Hạn directions per gender×Can parity).
- Full test + validate + build green.

## Constraint (C-1)
Justify any core-math change against an external source or proven invariant — never engine output.
