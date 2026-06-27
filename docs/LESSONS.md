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
