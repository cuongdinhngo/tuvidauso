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
