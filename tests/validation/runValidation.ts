#!/usr/bin/env tsx
/**
 * Cross-Validation Engine
 * Run: npm run validate
 * Generate expected values: npm run validate -- --generate
 */

import { solarToLunar } from '../../src/core/calendar/solarToLunar.ts';
import { calculateFourPillars } from '../../src/core/battu/fourPillars.ts';
import { getMenhCung } from '../../src/core/tuvi/menhCung.ts';
import { getThanCung } from '../../src/core/tuvi/thanCung.ts';
import { getCuc } from '../../src/core/tuvi/cuc.ts';
import { placeMainStars } from '../../src/core/tuvi/mainStars.ts';
import { placeAuxStars } from '../../src/core/tuvi/auxStars.ts';
import { arrangePalaces } from '../../src/core/tuvi/twelvePalaces.ts';
import { getFourTransforms } from '../../src/core/tuvi/fourTransforms.ts';
import { getStarTransform } from '../../src/core/tuvi/fourTransforms.ts';
import { getBrightness } from '../../src/core/tuvi/brightness.ts';
import { REFERENCE_CASES } from './referenceData.ts';
import type { ReferenceCase } from './referenceData.ts';

// ── DIA_CHI_HOURS for display ──
const DIA_CHI_HOURS = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// ── ANSI colors ──
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

interface ComputedResult {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  yearCan: string;
  yearChi: string;
  napAm: string;
  menh: string;
  than: string;
  cucName: string;
  cucValue: number;
  tuHoa: { loc: string; quyen: string; khoa: string; ky: string };
  mainStars: Record<string, string>;
  mainStarCount: number;
  palaceCount: number;
}

function computeChart(input: ReferenceCase['input']): ComputedResult {
  const { solarYear, solarMonth, solarDay, hourIndex } = input;
  const lunar = solarToLunar(solarYear, solarMonth, solarDay);
  const menh = getMenhCung(lunar.month, hourIndex);
  const than = getThanCung(lunar.month, hourIndex);
  const cuc = getCuc(lunar.yearCan, menh);
  const palacePositions = arrangePalaces(menh);
  const mainStarPositions = placeMainStars(cuc.value, lunar.day);
  const tuHoa = getFourTransforms(lunar.yearCan);

  const mainStars: Record<string, string> = {};
  for (const ms of mainStarPositions) {
    mainStars[ms.star] = ms.position;
  }

  return {
    lunarYear: lunar.year,
    lunarMonth: lunar.month,
    lunarDay: lunar.day,
    isLeapMonth: lunar.isLeapMonth,
    yearCan: lunar.yearCan,
    yearChi: lunar.yearChi,
    napAm: lunar.napAm,
    menh,
    than,
    cucName: cuc.name,
    cucValue: cuc.value,
    tuHoa,
    mainStars,
    mainStarCount: mainStarPositions.length,
    palaceCount: palacePositions.length,
  };
}

// ── Generate mode: output reference data to paste into referenceData.ts ──
function generateMode() {
  console.log(`${BOLD}${CYAN}═══ Generating expected values for ${REFERENCE_CASES.length} cases ═══${RESET}\n`);

  const results: Array<{ id: number; label: string; input: ReferenceCase['input']; expected: ComputedResult }> = [];

  for (const ref of REFERENCE_CASES) {
    const computed = computeChart(ref.input);
    results.push({ id: ref.id, label: ref.label, input: ref.input, expected: computed });

    const { input } = ref;
    console.log(`Case ${ref.id}: ${ref.label}`);
    console.log(`  Lunar: ${computed.lunarDay}/${String(computed.lunarMonth).padStart(2, '0')}/${computed.yearCan} ${computed.yearChi} (${computed.napAm})${computed.isLeapMonth ? ' [NHUẬN]' : ''}`);
    console.log(`  Mệnh: ${computed.menh} | Thân: ${computed.than} | Cục: ${computed.cucName} (${computed.cucValue})`);
    console.log(`  Tứ Hóa: Lộc=${computed.tuHoa.loc}, Quyền=${computed.tuHoa.quyen}, Khoa=${computed.tuHoa.khoa}, Kỵ=${computed.tuHoa.ky}`);
    console.log(`  Stars: ${computed.mainStarCount} main, ${computed.palaceCount} palaces`);
    console.log('');
  }

  // Output JSON that can be pasted
  console.log(`${BOLD}${YELLOW}═══ Copy the array below into referenceData.ts ═══${RESET}\n`);
  console.log('export const REFERENCE_CASES: ReferenceCase[] = ' + JSON.stringify(
    results.map(r => ({
      id: r.id,
      label: r.label,
      input: r.input,
      expected: r.expected,
      verified: false,
    })),
    null,
    2,
  ).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'") + ';\n');
}

// ── Validate mode: compare engine output to reference data ──
function validateMode() {
  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║   Tử Vi Cross-Validation — ${REFERENCE_CASES.length} Cases              ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${RESET}\n`);

  let totalPassed = 0;
  let totalFailed = 0;

  for (const ref of REFERENCE_CASES) {
    const computed = computeChart(ref.input);
    const exp = ref.expected;
    const checks: Array<{ field: string; expected: string; actual: string; pass: boolean }> = [];

    function check(field: string, expected: string | number | boolean, actual: string | number | boolean) {
      checks.push({ field, expected: String(expected), actual: String(actual), pass: expected === actual });
    }

    // Calendar
    check('Năm ÂL', exp.lunarYear, computed.lunarYear);
    check('Tháng ÂL', exp.lunarMonth, computed.lunarMonth);
    check('Ngày ÂL', exp.lunarDay, computed.lunarDay);
    check('Nhuận', exp.isLeapMonth, computed.isLeapMonth);
    check('Năm Can', exp.yearCan, computed.yearCan);
    check('Năm Chi', exp.yearChi, computed.yearChi);
    check('Nạp Âm', exp.napAm, computed.napAm);

    // Core
    check('Mệnh', exp.menh, computed.menh);
    check('Thân', exp.than, computed.than);
    check('Cục', exp.cucName, computed.cucName);
    check('Cục value', exp.cucValue, computed.cucValue);

    // Tu Hoa
    check('Hóa Lộc', exp.tuHoa.loc, computed.tuHoa.loc);
    check('Hóa Quyền', exp.tuHoa.quyen, computed.tuHoa.quyen);
    check('Hóa Khoa', exp.tuHoa.khoa, computed.tuHoa.khoa);
    check('Hóa Kỵ', exp.tuHoa.ky, computed.tuHoa.ky);

    // Main stars
    check('Main star count', exp.mainStarCount, computed.mainStarCount);
    check('Palace count', exp.palaceCount, computed.palaceCount);

    // Compare individual main star positions
    const starNames = Object.keys(exp.mainStars);
    let starMatchCount = 0;
    for (const star of starNames) {
      if (computed.mainStars[star] === exp.mainStars[star]) {
        starMatchCount++;
      }
    }
    check(`14 chính tinh`, `${starNames.length}/${starNames.length}`, `${starMatchCount}/${starNames.length}`);

    const casePassed = checks.every(c => c.pass);
    const failed = checks.filter(c => !c.pass);

    if (casePassed) {
      totalPassed++;
    } else {
      totalFailed++;
    }

    // Output
    const hourName = DIA_CHI_HOURS[ref.input.hourIndex];
    const genderLabel = ref.input.gender === 'male' ? 'Nam' : 'Nữ';
    const statusIcon = casePassed ? `${GREEN}✅ PASS${RESET}` : `${RED}❌ FAIL${RESET}`;
    const verifiedTag = ref.verified ? `${GREEN}[verified]${RESET}` : `${DIM}[unverified]${RESET}`;

    console.log(`${BOLD}Case ${ref.id}: ${genderLabel} ${ref.input.solarDay}/${String(ref.input.solarMonth).padStart(2, '0')}/${ref.input.solarYear} ${hourName} ${verifiedTag}${RESET}`);

    if (casePassed) {
      // Compact output for passing cases
      console.log(`├── ÂL: ${computed.lunarDay}/${String(computed.lunarMonth).padStart(2, '0')}/${computed.yearCan} ${computed.yearChi} (${computed.napAm})`);
      console.log(`├── Mệnh: ${computed.menh} | Thân: ${computed.than} | Cục: ${computed.cucName} (${computed.cucValue})`);
      console.log(`├── Tứ Hóa: Lộc=${computed.tuHoa.loc}, Quyền=${computed.tuHoa.quyen}, Khoa=${computed.tuHoa.khoa}, Kỵ=${computed.tuHoa.ky}`);
      console.log(`├── 14 chính tinh: ${starMatchCount}/${starNames.length} đúng`);
      console.log(`└── ${statusIcon}`);
    } else {
      // Detailed output for failing cases
      for (const c of checks) {
        const icon = c.pass ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`;
        if (!c.pass) {
          console.log(`├── ${icon} ${c.field}: expected ${YELLOW}${c.expected}${RESET}, got ${RED}${c.actual}${RESET}`);
        }
      }
      // Show star mismatches in detail
      for (const star of starNames) {
        if (computed.mainStars[star] !== exp.mainStars[star]) {
          console.log(`│   ${RED}↳ ${star}: expected ${exp.mainStars[star]}, got ${computed.mainStars[star]}${RESET}`);
        }
      }
      console.log(`└── ${statusIcon} (${failed.length} field(s) differ)`);
    }
    console.log('');
  }

  // Summary
  console.log(`${BOLD}${'═'.repeat(50)}${RESET}`);
  if (totalFailed === 0) {
    console.log(`${BOLD}${GREEN}SUMMARY: ${totalPassed}/${REFERENCE_CASES.length} PASSED ✅${RESET}`);
  } else {
    console.log(`${BOLD}${RED}SUMMARY: ${totalPassed}/${REFERENCE_CASES.length} PASSED, ${totalFailed} FAILED ❌${RESET}`);
  }
  console.log(`${BOLD}${'═'.repeat(50)}${RESET}\n`);

  if (totalFailed > 0) {
    process.exit(1);
  }
}

// ── Main ──
const args = process.argv.slice(2);
if (args.includes('--generate')) {
  generateMode();
} else {
  validateMode();
}
