# CLAUDE.md — Agent Working Reference

Guidance for AI agents editing this codebase. For a feature tour and setup instructions, see `README.md`.

## What this is

**Tử Vi Đẩu Số** (Vietnamese Purple Star Astrology) — a 100% client-side React SPA. Given a solar birth date, hour, and gender, it computes a full astrological chart (14 main stars, 36 auxiliary stars, 3-layer Four Transforms, brightness, Tuần/Triệt zones, palace relations, 210 interpretation rules, 25 cách cục, palace ratings) plus Western Astrology, Numerology, a Calendar/Good-Day picker, Compatibility comparison, and AI analysis. No backend — AI features call provider APIs directly from the browser.

## Commands

```bash
npm run dev        # Dev server (hot reload)
npm run build      # tsc -b + Vite production build — run before considering work done
npm test           # Vitest (1311 tests, 15 files)
npm run lint       # ESLint
npm run validate   # Full validation suite (tsx tests/validation/runValidation.ts)
npm run quickcheck # Quick chart check with CLI args
npm run preview    # Preview production build
npm run deploy     # Build + push dist/ to gh-pages
```

After any change, run `npm test` and `npm run build`. There is no DOM test harness, so UI changes must be verified by running the app and looking at every affected surface at mobile + desktop breakpoints.

## Conventions (read before editing)

- **`src/core/` is pure.** No React, no DOM, no I/O — only deterministic computation. Keep it that way; it's what the test suite covers. UI lives in `src/components/` and `src/pages/`; cross-cutting state in `src/store/` (Zustand).
- **All user-facing text is Vietnamese** with correct diacritics — star names, palace names, interpretations, labels. Never emit English UI strings.
- **Stack:** Vite 8, React 19, TypeScript 5.9, TailwindCSS 3 (dark theme), Zustand 5, React Router 7 (HashRouter), Vitest 4, Lucide icons.
- **Routing is HashRouter** and `base` is `/tuvidauso/` — required for GitHub Pages. Don't switch to BrowserRouter or change the base without reason.
- **Domain math is reference-validated.** Changing any `src/core/` calculation can silently break chart correctness — update the relevant test and run `npm run validate` against the reference cases below.
- **Add new types** to `src/core/types/index.ts` (general) or `src/core/types/compare.ts` (comparison).

## Domain invariants (easy to get wrong)

- **Bát Tự year pillar** changes at Lập Xuân (~Feb 4), **not** at Lunar New Year. **Month pillar** uses Tiết Khí (Jie Qi) boundaries, not lunar months.
- **Tử Vi main stars:** Tử Vi position from a 150-entry table (5 Cục × 30 days). Tử Vi system (6 stars) runs counter-clockwise; Thiên Phủ mirrors Tử Vi across the Dần–Thân axis; Thiên Phủ system (8 stars) runs clockwise.
- **Mệnh** = `(month+1-hourIndex+24)%12`; **Thân** = `(month+1+hourIndex)%12`; 12 palaces counter-clockwise from Mệnh.
- **Đại Hạn** direction depends on gender + year Can yin/yang.
- **Tuần Không & Triệt Lộ:** two influence zones (2 palaces each) from year Can Chi; stars there have reduced power.
- **Palace relations:** Tam hợp = 4 triangles of 3; Đối cung = opposite; Giáp cung = adjacent pair. Related-palace stars "chiếu" (influence) the selected palace.
- **3-layer Tứ Hóa:** natal (birth-year Can) + đại hạn (period Can) + lưu niên (current-year Can), stacked in `layeredAnalysis.ts` with pattern detection (Song Kỵ, Song Lộc, Tam Kỳ Gia Hội, …).
- **210 interpretation rules** = 14 main stars × 5 key palaces (Mệnh, Quan Lộc, Tài Bạch, Phu Thê, Tật Ách) × 3 brightness tiers. Brightness normalizes Vượng→Miếu, Đắc→Bình.
- **Calendar engine** covers 1900–2100 from hex-encoded `lunarData.ts` (base date 31/01/1900).

## Code map

```
src/
├── core/                  # Pure computation (no React)
│   ├── calendar/          # Solar→Lunar, Can Chi, Tiết Khí, Hoàng Đạo, Sao 28,
│   │                      #   Trực, good-day picker, personalized day ratings
│   ├── battu/             # Tứ Trụ, Tàng Can, Ngũ Hành, Thập Thần, Đại Vận
│   ├── tuvi/              # An sao (main/aux), Tứ Hóa, brightness, Đại/Tiểu Hạn,
│   │                      #   Tuần/Triệt, palace relations, ratings, 3-layer analysis
│   ├── astrology/         # Western Big 3: sun/moon/rising sign
│   ├── numerology/        # Life Path / Expression / Personal Year + East–West bridge
│   ├── compare/           # Compatibility scoring across 8 dimensions + profile builder
│   ├── ai/                # callProvider, providerData, prompts/, providers/
│   │   ├── prompts/       #   system, astrology, numerology, combined, suggestion
│   │   └── providers/     #   anthropic, google, openai, groq
│   └── types/             # index.ts (all types/constants), compare.ts
├── data/                  # starDatabase, palaceDatabase, cachePatterns (25),
│                          #   interpretationRules (210), napAm, zodiac, big3,
│                          #   numerology, calendar, compare, aiQuickQuestions
├── pages/                 # HomePage, InputPage, ResultPage (8 tabs),
│                          #   calendar/ (lazy), compare/ (lazy: landing/add/result/ranking)
├── components/            # tuvi/ battu/ astrology/ numerology/ combined/
│                          #   calendar/ compare/ layout/ shared/
├── utils/                 # parseSuggestions (AI [SUGGESTIONS] blocks)
├── hooks/                 # useStarFilter, useAIAnalysis
├── store/                 # tuViStore, aiStore, calendarStore, compareStore (Zustand)
└── App.tsx                # HashRouter, 8 routes, lazy Calendar/Compare

tests/                     # 12 *.test.ts files + validation/ (runValidation, quickCheck, referenceData)
```

Key files to know: `store/tuViStore.ts` (the calculation pipeline + 10-chart history), `data/interpretationRules.ts` (the 210 rules + CAREER/HEALTH maps), `core/tuvi/layeredAnalysis.ts` (Tứ Hóa stacking), `core/ai/callProvider.ts` (unified provider interface).

## Key types (`src/core/types/index.ts`)

`LunarDate`, `BirthInfo` (solar date, hourIndex 0–11, gender, optional name/birthplace), `CanChi`, `FourPillars`, `Star` (name, type chính/phụ/cát/sát, brightness, transform), `Palace`, `TuViChart`, `TuanTriet`, `PalaceInfluence`, `DailyInfo`, `GoodDayResult`, `Purpose` (15 life-purpose enum). Comparison types live in `compare.ts`.

## Testing & validation

1311 tests across 15 files (`npm test`). Reference cases the validation suite asserts:
- 15/04/1988 → Lunar 29/02 Mậu Thìn, Đại Lâm Mộc
- 25/01/2020 → Lunar 01/01 Canh Tý (Tết)
- Every chart yields exactly 14 main stars and 12 unique palaces
- Tuần/Triệt, tam hợp / đối cung / giáp cung verified across all 12 positions

When touching core math, add or update the matching test in `tests/` and re-run `npm run validate`.
