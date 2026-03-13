import type { FourPillars } from '../types';
import { getYearCanChi, getMonthCanChi, getDayCanChi, getHourCanChi, getCanIndex } from '../calendar/canChi';
import { getLapXuanDate, getJieQiMonth } from '../calendar/jieQi';

/**
 * Calculate the Four Pillars (Tu Tru / Bat Tu) from solar date and hour.
 *
 * IMPORTANT:
 * - Year pillar changes at Lap Xuan (Start of Spring), NOT at lunar new year
 * - Month pillar uses Jie Qi boundaries, NOT lunar months
 * - Day pillar uses Julian Day Number (solar calendar)
 * - Hour pillar derived from day's Can using Ngu Thu Don
 */
export function calculateFourPillars(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  hourIndex: number // 0=Ty, 1=Suu, ..., 11=Hoi
): FourPillars {
  // === YEAR PILLAR ===
  // Year changes at Lap Xuan, not Tet
  const lapXuan = getLapXuanDate(solarYear);
  let batTuYear = solarYear;
  if (solarMonth < lapXuan.month || (solarMonth === lapXuan.month && solarDay < lapXuan.day)) {
    batTuYear = solarYear - 1;
  }
  const yearCanChi = getYearCanChi(batTuYear);

  // === MONTH PILLAR ===
  // Month determined by Jie Qi (solar terms), not lunar month
  const jieQiMonth = getJieQiMonth(solarYear, solarMonth, solarDay);
  const yearCanIndex = getCanIndex(yearCanChi.can);
  const monthCanChi = getMonthCanChi(yearCanIndex, jieQiMonth);

  // === DAY PILLAR ===
  const dayCanChi = getDayCanChi(solarYear, solarMonth, solarDay);

  // === HOUR PILLAR ===
  const dayCanIndex = getCanIndex(dayCanChi.can);
  const hourCanChi = getHourCanChi(dayCanIndex, hourIndex);

  return {
    year: yearCanChi,
    month: monthCanChi,
    day: dayCanChi,
    hour: hourCanChi,
  };
}

/**
 * Get the Bat Tu year Can index, accounting for Lap Xuan boundary.
 */
export function getBatTuYearCanIndex(solarYear: number, solarMonth: number, solarDay: number): number {
  const lapXuan = getLapXuanDate(solarYear);
  let batTuYear = solarYear;
  if (solarMonth < lapXuan.month || (solarMonth === lapXuan.month && solarDay < lapXuan.day)) {
    batTuYear = solarYear - 1;
  }
  const yearCanChi = getYearCanChi(batTuYear);
  return getCanIndex(yearCanChi.can);
}
