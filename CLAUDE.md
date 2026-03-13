# CLAUDE.md — Project Reference

## Overview

**Tử Vi Đẩu Số** (Vietnamese Purple Star Astrology) web application. Takes solar birth date, hour, and gender as input; computes a complete astrological chart with 14 main stars, 36 auxiliary stars, Four Transforms (3-layer: natal + đại hạn + lưu niên), brightness levels, Tuần/Triệt influence zones, tam hợp/đối cung/giáp cung palace relations, 210 interpretation rules, 25 cách cục patterns, and palace ratings. 100% client-side — no backend required.

## Tech Stack

- **Vite 8** — build tool
- **React 19** + **TypeScript 5.9**
- **TailwindCSS 3** — styling (dark theme)
- **Zustand 5** — state management
- **React Router 7** — HashRouter (for GitHub Pages SPA)
- **Vitest 4** — testing
- **Lucide React** — icons
- **gh-pages** — deployment

## Commands

```bash
npm run dev        # Start dev server
npm run build      # TypeScript check + Vite production build
npm test           # Run all tests (vitest run)
npm run preview    # Preview production build locally
npm run deploy     # Build + deploy to GitHub Pages
npm run lint       # ESLint
npm run validate   # Full validation suite (tsx)
npm run quickcheck # Quick chart check with CLI args
```

## Project Structure

```
src/
├── core/                        # Pure computation (no React)
│   ├── calendar/
│   │   ├── lunarData.ts         # Hex-encoded lunar data 1900-2100
│   │   ├── solarToLunar.ts      # Solar → Lunar conversion (base: 31/01/1900)
│   │   ├── canChi.ts            # Year/Month/Day/Hour Can Chi (JDN, Ngu Ho Don, Ngu Thu Don)
│   │   └── jieQi.ts             # 24 Solar Terms (Tiết Khí)
│   ├── battu/
│   │   ├── fourPillars.ts       # Tứ Trụ (year changes at Lập Xuân, NOT Tết)
│   │   ├── hiddenStems.ts       # Tàng Can lookup
│   │   ├── fiveElements.ts      # Ngũ Hành mapping + counting
│   │   ├── tenGods.ts           # Thập Thần relationships
│   │   └── majorFate.ts         # Bát Tự Đại Vận
│   ├── tuvi/
│   │   ├── menhCung.ts          # Mệnh: (month+1-hourIndex+24)%12
│   │   ├── thanCung.ts          # Thân: (month+1+hourIndex)%12
│   │   ├── cuc.ts               # Cục: 5×12 lookup (Can pairs × Địa Chi)
│   │   ├── twelvePalaces.ts     # 12 cung counter-clockwise from Mệnh
│   │   ├── mainStars.ts         # 14 chính tinh (Tử Vi table: 5 Cục × 30 ngày)
│   │   ├── auxStars.ts          # 36 phụ tinh across 6 groups
│   │   ├── fourTransforms.ts    # Tứ Hóa (10 Can → 4 stars)
│   │   ├── brightness.ts        # Miếu/Vượng/Đắc/Bình/Hãm (14×12 table)
│   │   ├── majorPeriod.ts       # Đại Hạn (10-year periods)
│   │   ├── yearlyPeriod.ts      # Tiểu Hạn (yearly fortune)
│   │   ├── interpretation.ts    # Vietnamese text generation
│   │   ├── tuanTriet.ts         # Tuần Không & Triệt Lộ (2+2 palaces)
│   │   ├── palaceRelations.ts   # Tam hợp, Đối cung, Giáp cung
│   │   ├── palaceRating.ts      # Palace rating 1-5 stars
│   │   ├── periodTransforms.ts  # Đại hạn Tứ Hóa layer
│   │   ├── yearlyStars.ts       # Lưu tinh (Lộc Tồn, Kình Đà, Thiên Mã lưu niên)
│   │   └── layeredAnalysis.ts   # 3-layer Tứ Hóa stacking + pattern detection
│   └── types/index.ts           # All TypeScript types + constants
├── data/
│   ├── starDatabase.ts          # Star definitions (nature, keywords)
│   ├── palaceDatabase.ts        # 12 palace meanings
│   ├── cachePatterns.ts         # 25 cách cục (special star combinations)
│   ├── napAm.ts                 # 60 Giáp Tý Nạp Âm
│   └── interpretationRules.ts   # 210 rules, CHIEU_TEMPLATES, CAREER_MAP, HEALTH_MAP, PALACE_ADVICE
├── pages/
│   ├── HomePage.tsx             # Landing + feature cards + chart history
│   ├── InputPage.tsx            # Birth info form + lunar preview
│   └── ResultPage.tsx           # 5-tab result display
├── components/
│   ├── layout/                  # Header, Layout
│   ├── tuvi/
│   │   ├── TuViChart.tsx        # 4×4 grid with star filter + relation highlights
│   │   ├── CungDetail.tsx       # Palace detail panel with rating + interpretation
│   │   ├── LuanGiaiTab.tsx      # 9-section interpretation tab with sidebar nav
│   │   ├── DaiHanTimeline.tsx   # Clickable Đại Hạn timeline
│   │   ├── TieuHanCards.tsx     # Tiểu Hạn year cards
│   │   ├── StarFilterBar.tsx    # Star filter toggle bar
│   │   └── YearlyDetailPanel.tsx # 3-layer Tứ Hóa yearly breakdown
│   ├── battu/
│   │   └── BatTuTab.tsx         # Enhanced Bát Tự with element colors + Đại Vận
│   └── shared/                  # Tabs, ErrorBoundary
├── hooks/
│   └── useStarFilter.ts         # Star filter state (all/chinh/chinh_cat_sat/custom)
├── store/tuViStore.ts           # Zustand store (calculation pipeline)
├── App.tsx                      # HashRouter setup
├── main.tsx                     # Entry point
└── index.css                    # Tailwind imports + print CSS

tests/
├── calendar.test.ts             # Solar→Lunar conversion cases
├── fourPillars.test.ts          # Bát Tự validation
├── tuvi.test.ts                 # Mệnh, Thân, Cục, 12 palaces
├── fullValidation.test.ts       # End-to-end chart building (7 cases)
├── tuanTriet.test.ts            # Tuần Không & Triệt Lộ
├── palaceRelations.test.ts      # Tam hợp, Đối cung, Giáp cung
└── validation/
    ├── runValidation.ts         # Full validation suite (npm run validate)
    └── quickCheck.ts            # Quick CLI chart check (npm run quickcheck)
```

## Architecture Notes

- **No backend.** All computation happens in the browser.
- **Calendar engine** covers 1900–2100 using hex-encoded lunar data from `lunarData.ts`.
- **Bát Tự year pillar** changes at Lập Xuân (Start of Spring, ~Feb 4), not at Lunar New Year.
- **Bát Tự month pillar** uses Tiết Khí (Jie Qi) boundaries, not lunar months.
- **Tử Vi main stars:** Tử Vi position from 150-entry lookup table (5 Cục × 30 days). Tử Vi system (6 stars) goes counter-clockwise. Thiên Phủ mirrors Tử Vi across Dần-Thân axis. Thiên Phủ system (8 stars) goes clockwise.
- **Đại Hạn** direction depends on gender + year Can yin/yang.
- **Tuần Không & Triệt Lộ:** Two influence zones (2 palaces each) computed from year Can Chi. Stars in affected palaces have reduced power.
- **Tam hợp / Đối cung / Giáp cung:** Palace relation system. Tam hợp = 4 groups of 3 (triangle), Đối cung = opposite palace, Giáp cung = adjacent pair. Stars from related palaces "chiếu" (influence) the selected palace.
- **3-layer Tứ Hóa:** Natal (birth year Can) + Đại hạn (period Can) + Lưu niên (current year Can). Pattern detection for Song Kỵ, Song Lộc, Tam Kỳ Gia Hội, etc.
- **Palace rating:** 1-5 stars based on chính tinh brightness, cát/sát tinh count, Tứ Hóa transforms, Tuần/Triệt status.
- **210 interpretation rules:** 14 main stars × 5 key palaces (Mệnh, Quan Lộc, Tài Bạch, Phu Thê, Tật Ách) × 3 brightness levels (Miếu, Bình, Hãm). Brightness normalization: Vượng→Miếu, Đắc→Bình.
- **Star filter:** 4 modes — all stars, chính tinh only, chính+cát+sát, custom group selection.
- **Base URL** is `/tuvidauso/` for GitHub Pages deployment.
- **All UI text is in Vietnamese.** Star names, palace names, interpretations — everything uses Vietnamese with diacritics.

## Key Types (`src/core/types/index.ts`)

- `LunarDate` — lunar day/month/year with Can Chi and Nạp Âm
- `BirthInfo` — solar date, hour index (0-11), gender
- `CanChi` — Thiên Can + Địa Chi pair
- `FourPillars` — year/month/day/hour CanChi
- `Star` — name, type (chính/phụ/cát/sát), brightness, transform
- `Palace` — name, position, stars array, major period
- `TuViChart` — complete chart with all data
- `TuanTriet` — tuan: [string, string], triet: [string, string]
- `PalaceInfluence` — tam hợp, đối cung, giáp cung stars/palaces

## Testing

49 tests across 6 files. Run with `npm test`. Key validation cases:
- 15/04/1988 → Lunar 29/02 Mậu Thìn, Đại Lâm Mộc
- 25/01/2020 → Lunar 01/01 Canh Tý (Tết)
- Every chart produces exactly 14 main stars and 12 unique palaces
- Tuần/Triệt computed correctly for multiple year Can Chi combinations
- Tam hợp groups, đối cung, giáp cung verified for all 12 positions

## Deployment

GitHub Pages via `gh-pages` package. `npm run deploy` builds and pushes `dist/` to `gh-pages` branch. Deployed at `https://<username>.github.io/tuvidauso/`.
