import type { NumerologyChart, NumberResult, PinnacleResult, ChallengeResult } from './types';

// ============================================
// BASIC RULES
// ============================================

/** Reduce a number to single digit, KEEP Master Numbers (11, 22, 33) */
function reduceNumber(n: number, keepMaster: boolean = true): NumberResult {
  const path: number[] = [n];
  let current = n;

  while (current > 9) {
    if (keepMaster && [11, 22, 33].includes(current)) {
      break;
    }
    current = String(current).split('').reduce((sum, d) => sum + parseInt(d), 0);
    path.push(current);
  }

  return {
    value: current,
    masterNumber: [11, 22, 33].includes(current),
    karmicDebt: path.some(p => [13, 14, 16, 19].includes(p)),
    reductionPath: path.join(' → '),
    steps: path,
  };
}

// Pythagorean letter-to-number mapping
const LETTER_MAP: Record<string, number> = {
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
  'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
  's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
// Note: 'y' is treated as consonant by default for simplicity

/** Remove Vietnamese diacritics before calculation */
export function removeVietnameseDiacritics(str: string): string {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// ============================================
// CORE NUMBERS
// ============================================

/** LIFE PATH NUMBER — Most important. Reduce day, month, year separately then sum. */
function calcLifePath(day: number, month: number, year: number): NumberResult {
  const d = reduceNumber(day, true);
  const m = reduceNumber(month, true);
  const y = reduceNumber(year, true);
  const total = d.value + m.value + y.value;
  const result = reduceNumber(total, true);

  return {
    ...result,
    reductionPath: `${day}/${month}/${year} → ${d.value} + ${m.value} + ${y.value} = ${total} → ${result.value}`,
    steps: [...d.steps, ...m.steps, ...y.steps, total, ...result.steps],
  };
}

/** BIRTHDAY NUMBER — Just the birth day, reduced */
function calcBirthday(day: number): NumberResult {
  return reduceNumber(day, true);
}

/** ATTITUDE NUMBER — Day + Month */
function calcAttitude(day: number, month: number): NumberResult {
  return reduceNumber(day + month, true);
}

/** EXPRESSION/DESTINY NUMBER — Sum of all letters in full name */
function calcExpression(fullName: string): NumberResult {
  const clean = removeVietnameseDiacritics(fullName).toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return { value: 0, masterNumber: false, karmicDebt: false, reductionPath: '0', steps: [0] };
  const total = clean.split('').reduce((sum, ch) => sum + (LETTER_MAP[ch] || 0), 0);
  return reduceNumber(total, true);
}

/** SOUL URGE / HEART'S DESIRE — Sum of VOWELS in name */
function calcSoulUrge(fullName: string): NumberResult {
  const clean = removeVietnameseDiacritics(fullName).toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return { value: 0, masterNumber: false, karmicDebt: false, reductionPath: '0', steps: [0] };
  const total = clean.split('')
    .filter(ch => VOWELS.includes(ch))
    .reduce((sum, ch) => sum + (LETTER_MAP[ch] || 0), 0);
  return reduceNumber(total, true);
}

/** PERSONALITY NUMBER — Sum of CONSONANTS in name */
function calcPersonality(fullName: string): NumberResult {
  const clean = removeVietnameseDiacritics(fullName).toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return { value: 0, masterNumber: false, karmicDebt: false, reductionPath: '0', steps: [0] };
  const total = clean.split('')
    .filter(ch => !VOWELS.includes(ch))
    .reduce((sum, ch) => sum + (LETTER_MAP[ch] || 0), 0);
  return reduceNumber(total, true);
}

/** PERSONAL YEAR — Birthday + Birth month + Current year */
function calcPersonalYear(day: number, month: number, currentYear: number): NumberResult {
  const d = reduceNumber(day, false);
  const m = reduceNumber(month, false);
  const y = reduceNumber(currentYear, false);
  return reduceNumber(d.value + m.value + y.value, true);
}

/** PERSONAL MONTH — Personal Year + Current month */
function calcPersonalMonth(personalYear: number, currentMonth: number): NumberResult {
  return reduceNumber(personalYear + currentMonth, false);
}

// ============================================
// ADVANCED
// ============================================

// Brief number meanings for pinnacle/challenge descriptions
const NUMBER_TITLES: Record<number, string> = {
  0: 'Không có thử thách đặc biệt',
  1: 'Độc lập & Lãnh đạo',
  2: 'Hợp tác & Kiên nhẫn',
  3: 'Sáng tạo & Biểu đạt',
  4: 'Ổn định & Xây dựng',
  5: 'Thay đổi & Tự do',
  6: 'Trách nhiệm & Gia đình',
  7: 'Nội tâm & Tìm kiếm',
  8: 'Thành công & Quyền lực',
  9: 'Nhân đạo & Hoàn thành',
  11: 'Trực giác & Truyền cảm hứng',
  22: 'Tầm nhìn & Kiến tạo',
  33: 'Phục vụ & Tâm linh',
};

function getPinnacleDescription(n: number): string {
  return NUMBER_TITLES[n] || NUMBER_TITLES[reduceNumber(n, false).value] || '';
}

function getChallengeDescription(n: number): string {
  return NUMBER_TITLES[n] || '';
}

/** 4 PINNACLES — Life milestones */
function calcPinnacles(day: number, month: number, year: number, lifePath: number): PinnacleResult[] {
  const d = reduceNumber(day, false).value;
  const m = reduceNumber(month, false).value;
  const y = reduceNumber(year, false).value;

  const firstEnd = 36 - lifePath;

  return [
    { number: reduceNumber(d + m, true).value, startAge: 0, endAge: firstEnd },
    { number: reduceNumber(d + y, true).value, startAge: firstEnd + 1, endAge: firstEnd + 9 },
    { number: reduceNumber(d + m + d + y, true).value, startAge: firstEnd + 10, endAge: firstEnd + 18 },
    { number: reduceNumber(m + y, true).value, startAge: firstEnd + 19, endAge: null },
  ].map(p => ({ ...p, description: getPinnacleDescription(p.number) }));
}

/** 4 CHALLENGES */
function calcChallenges(day: number, month: number, year: number, lifePath: number): ChallengeResult[] {
  const d = reduceNumber(day, false).value;
  const m = reduceNumber(month, false).value;
  const y = reduceNumber(year, false).value;

  const firstEnd = 36 - lifePath;

  const c1 = Math.abs(d - m);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);

  return [c1, c2, c3, c4].map((n, i) => ({
    number: n,
    startAge: i === 0 ? 0 : (i === 1 ? firstEnd + 1 : (i === 2 ? firstEnd + 10 : firstEnd + 19)),
    endAge: i === 0 ? firstEnd : (i === 1 ? firstEnd + 9 : (i === 2 ? firstEnd + 18 : null)),
    description: getChallengeDescription(n),
  }));
}

/** INCLUSION CHART — Frequency of each number 1-9 in name */
function calcInclusionChart(fullName: string): Record<number, number> {
  const clean = removeVietnameseDiacritics(fullName).toLowerCase().replace(/[^a-z]/g, '');
  const chart: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  clean.split('').forEach(ch => {
    const num = LETTER_MAP[ch];
    if (num) chart[num]++;
  });

  return chart;
}

/** KARMIC LESSONS — Numbers MISSING from name */
function calcKarmicLessons(inclusionChart: Record<number, number>): number[] {
  return Object.entries(inclusionChart)
    .filter(([_, count]) => count === 0)
    .map(([num]) => parseInt(num));
}

/** HIDDEN PASSION — Number appearing MOST in name */
function calcHiddenPassion(inclusionChart: Record<number, number>): number[] {
  const maxCount = Math.max(...Object.values(inclusionChart));
  if (maxCount === 0) return [];
  return Object.entries(inclusionChart)
    .filter(([_, count]) => count === maxCount)
    .map(([num]) => parseInt(num));
}

/** BIRTH PYRAMID */
function calcBirthPyramid(day: number, month: number, year: number): number[][] {
  const digits = `${day}${month}${year}`.split('').map(Number);
  const pyramid: number[][] = [digits];

  let current = digits;
  while (current.length > 1) {
    const next: number[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push((current[i] + current[i + 1]) % 10);
    }
    pyramid.push(next);
    current = next;
  }

  return pyramid;
}

// ============================================
// MASTER FUNCTION
// ============================================

export function calculateNumerology(
  fullName: string,
  day: number,
  month: number,
  year: number,
  currentYear: number = new Date().getFullYear(),
  currentMonth: number = new Date().getMonth() + 1,
): NumerologyChart {
  const lifePath = calcLifePath(day, month, year);
  const inclusionChart = calcInclusionChart(fullName);
  const personalYear = calcPersonalYear(day, month, currentYear);

  const expression = calcExpression(fullName);
  const soulUrge = calcSoulUrge(fullName);
  const personality = calcPersonality(fullName);

  // Use the base value (not master) for pinnacle age calculation
  const lifePathBase = lifePath.masterNumber
    ? reduceNumber(lifePath.value, false).value
    : lifePath.value;

  return {
    lifePath,
    birthday: calcBirthday(day),
    attitude: calcAttitude(day, month),
    expression,
    soulUrge,
    personality,
    personalYear,
    personalMonth: calcPersonalMonth(personalYear.value, currentMonth),
    pinnacles: calcPinnacles(day, month, year, lifePathBase),
    challenges: calcChallenges(day, month, year, lifePathBase),
    karmicDebt: (() => {
      const KARMIC_NUMBERS = [13, 14, 16, 19];
      const allSteps = [
        ...lifePath.steps,
        ...expression.steps,
        ...soulUrge.steps,
        ...personality.steps,
      ];
      return KARMIC_NUMBERS.filter(n => allSteps.includes(n));
    })(),
    karmicLesson: calcKarmicLessons(inclusionChart),
    hiddenPassion: calcHiddenPassion(inclusionChart),
    birthChart: calcBirthPyramid(day, month, year),
    inclusionChart,
  };
}
