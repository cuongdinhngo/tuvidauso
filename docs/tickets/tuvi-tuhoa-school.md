# Ticket: C6 — Tứ Hóa: declare the school, make it auditable

**Priority:** P3 (needs a user decision, not a bug fix)
**Track:** backend + light UI (`src/core/tuvi/fourTransforms.ts`, UI note)

## Context
`fourTransforms.ts` encodes ONE Tứ Hóa table. Several Can are genuinely **school-dependent** — notably **Canh** (Lộc Nhật / Quyền Vũ / Khoa Âm-or-Phủ / Kỵ Đồng-or-Âm) and **Nhâm** (Khoa Tả Phụ vs Thiên Phủ). The current table is not cited, so an expert can't tell which tradition it follows.

## Decision required (human)
Which school does this app follow? (e.g. Thái Thứ Lang / Tử Vi Đẩu Số Tân Biên, Trung Châu, etc.)

## Scope
1. Name the exact school/source in a header comment, citing it.
2. Verify the table matches that school (esp. Canh, Nhâm); fix deviations.
3. Add a UI note framing school-dependent Can as "varies by school," never as the single truth.
4. (Stretch) Make the table swappable so users can pick their tradition.

## Acceptance criteria
- `fourTransforms.ts` cites its school; Canh/Nhâm match the cited source.
- UI surfaces the school + the "varies by school" caveat.

## Constraint (C-1)
Justify the table against the named external source.
