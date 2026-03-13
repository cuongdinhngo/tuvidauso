import type { ZodiacSign, RulingPlanet, SunSignResult } from './types';
import { ZODIAC_SIGNS } from '../../data/zodiacData';

interface DateRange {
  sign: ZodiacSign;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

const ZODIAC_DATE_RANGES: DateRange[] = [
  { sign: 'aries',       startMonth: 3,  startDay: 21, endMonth: 4,  endDay: 19 },
  { sign: 'taurus',      startMonth: 4,  startDay: 20, endMonth: 5,  endDay: 20 },
  { sign: 'gemini',      startMonth: 5,  startDay: 21, endMonth: 6,  endDay: 20 },
  { sign: 'cancer',      startMonth: 6,  startDay: 21, endMonth: 7,  endDay: 22 },
  { sign: 'leo',         startMonth: 7,  startDay: 23, endMonth: 8,  endDay: 22 },
  { sign: 'virgo',       startMonth: 8,  startDay: 23, endMonth: 9,  endDay: 22 },
  { sign: 'libra',       startMonth: 9,  startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'scorpio',     startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'capricorn',   startMonth: 12, startDay: 22, endMonth: 1,  endDay: 19 },
  { sign: 'aquarius',    startMonth: 1,  startDay: 20, endMonth: 2,  endDay: 18 },
  { sign: 'pisces',      startMonth: 2,  startDay: 19, endMonth: 3,  endDay: 20 },
];

// Decan rulers — mỗi cung chia 3 phần 10°, mỗi phần do 1 hành tinh cai quản
const DECAN_RULERS: Record<ZodiacSign, [RulingPlanet, RulingPlanet, RulingPlanet]> = {
  'aries':       ['mars', 'sun', 'jupiter'],
  'taurus':      ['venus', 'mercury', 'saturn'],
  'gemini':      ['mercury', 'venus', 'uranus'],
  'cancer':      ['moon', 'pluto', 'neptune'],
  'leo':         ['sun', 'jupiter', 'mars'],
  'virgo':       ['mercury', 'saturn', 'venus'],
  'libra':       ['venus', 'uranus', 'mercury'],
  'scorpio':     ['pluto', 'neptune', 'moon'],
  'sagittarius': ['jupiter', 'mars', 'sun'],
  'capricorn':   ['saturn', 'venus', 'mercury'],
  'aquarius':    ['uranus', 'mercury', 'venus'],
  'pisces':      ['neptune', 'moon', 'pluto'],
};

function isDateInRange(month: number, day: number, range: DateRange): boolean {
  // Trường hợp đặc biệt: Capricorn vượt qua năm mới (12/22 - 1/19)
  if (range.startMonth > range.endMonth) {
    return (month === range.startMonth && day >= range.startDay) ||
           (month === range.endMonth && day <= range.endDay);
  }
  return (month === range.startMonth && day >= range.startDay) ||
         (month === range.endMonth && day <= range.endDay) ||
         (month > range.startMonth && month < range.endMonth);
}

/** Day-of-year using Date (handles leap years automatically) */
function getDayOfYear(year: number, month: number, day: number): number {
  const date = new Date(year, month - 1, day);
  const jan1 = new Date(year, 0, 1);
  return Math.floor((date.getTime() - jan1.getTime()) / 86400000) + 1;
}

function getDaysInYear(year: number): number {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
}

/**
 * Tính vị trí (degree) trong cung, từ 0 đến ~30°.
 * Sử dụng nội suy tuyến tính dựa trên ngày trong khoảng date range.
 */
function calculateDegree(year: number, month: number, day: number, range: DateRange): number {
  const totalDaysInYear = getDaysInYear(year);
  const doy = getDayOfYear(year, month, day);

  // For cross-year signs (Capricorn), use the appropriate year for start date
  const startYear = range.startMonth > range.endMonth && month <= range.endMonth ? year - 1 : year;
  const startDoy = getDayOfYear(startYear, range.startMonth, range.startDay);

  let diff: number;
  if (startYear < year) {
    // Cross-year: days from start to end of startYear + days into current year
    diff = (getDaysInYear(startYear) - startDoy) + doy;
  } else {
    diff = doy - startDoy;
    if (diff < 0) diff += totalDaysInYear;
  }

  // Total days in sign range
  const endYear = range.startMonth > range.endMonth ? startYear + 1 : startYear;
  const endDoy = getDayOfYear(endYear, range.endMonth, range.endDay);
  let totalDays: number;
  if (range.startMonth > range.endMonth) {
    totalDays = (getDaysInYear(startYear) - startDoy) + endDoy;
  } else {
    totalDays = endDoy - startDoy;
  }

  return Math.min((diff / totalDays) * 30, 29.99);
}

/**
 * Kiểm tra ngày giáp ranh (cusp) — ngày đầu hoặc cuối của mỗi cung.
 * Ngày chuyển cung có thể lệch ±1 ngày tùy năm.
 */
function isCuspDate(month: number, day: number): boolean {
  for (const range of ZODIAC_DATE_RANGES) {
    if ((month === range.startMonth && Math.abs(day - range.startDay) <= 1) ||
        (month === range.endMonth && Math.abs(day - range.endDay) <= 1)) {
      return true;
    }
  }
  return false;
}

export function getSunSign(year: number, month: number, day: number): SunSignResult {
  // 1. Tìm cung
  let matchedRange = ZODIAC_DATE_RANGES[0];
  for (const range of ZODIAC_DATE_RANGES) {
    if (isDateInRange(month, day, range)) {
      matchedRange = range;
      break;
    }
  }
  const sign = matchedRange.sign;

  // 2. Tính degree (vị trí trong cung, 0-30°)
  const degree = calculateDegree(year, month, day, matchedRange);

  // 3. Tính Decan
  const decan: 1 | 2 | 3 = degree < 10 ? 1 : degree < 20 ? 2 : 3;

  // 4. Kiểm tra cusp (giáp ranh)
  const cuspDate = isCuspDate(month, day);

  return {
    sign: ZODIAC_SIGNS[sign],
    degree,
    decan,
    decanRuler: DECAN_RULERS[sign][decan - 1],
    cuspDate,
  };
}
