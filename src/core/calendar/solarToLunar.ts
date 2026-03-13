import type { LunarDate } from '../types';
import { lunarYearDays, leapMonth, leapMonthDays, lunarMonthDays } from './lunarData';
import { getYearCanChi, getMonthCanChi, getCanIndex } from './canChi';
import { getNapAm } from '../../data/napAm';

/**
 * Convert solar (Gregorian) date to lunar date.
 * Base: Jan 31, 1900 = Lunar 1/1/1900 (Canh Ty)
 */
export function solarToLunar(year: number, month: number, day: number): LunarDate {
  // Validate range
  if (year < 1900 || year > 2100) {
    throw new Error(`Year ${year} out of range (1900-2100)`);
  }

  // Calculate days from base date (Jan 31, 1900)
  const baseDate = new Date(1900, 0, 31); // Jan 31, 1900
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.round((targetDate.getTime() - baseDate.getTime()) / 86400000);

  if (offset < 0) {
    throw new Error('Date before 1900-01-31 not supported');
  }

  // Iterate through lunar years to find the target year
  let lunarYear = 1900;
  let daysInYear: number;
  for (; lunarYear < 2101 && offset > 0; lunarYear++) {
    daysInYear = lunarYearDays(lunarYear);
    if (offset < daysInYear) break;
    offset -= daysInYear;
  }

  // Iterate through lunar months to find target month
  const leap = leapMonth(lunarYear);
  let isLeapMonth = false;
  let lunarMonth = 1;

  for (; lunarMonth <= 12; lunarMonth++) {
    // Regular month days
    let daysInMonth: number;

    if (leap > 0 && lunarMonth === leap + 1 && !isLeapMonth) {
      // We just passed the regular month that has a leap twin.
      // Check if offset falls in the leap month.
      --lunarMonth; // go back to check leap
      isLeapMonth = true;
      daysInMonth = leapMonthDays(lunarYear);
    } else {
      daysInMonth = lunarMonthDays(lunarYear, lunarMonth);
    }

    if (offset < daysInMonth) break;
    offset -= daysInMonth;

    if (isLeapMonth && lunarMonth === leap) {
      isLeapMonth = false;
      lunarMonth++; // move past the leap month
      if (lunarMonth > 12) break;
      // Check this regular month too
      daysInMonth = lunarMonthDays(lunarYear, lunarMonth);
      if (offset < daysInMonth) break;
      offset -= daysInMonth;
    }
  }

  const lunarDay = offset + 1;

  const yearCanChi = getYearCanChi(lunarYear);
  const yearCanIndex = getCanIndex(yearCanChi.can);
  const monthCanChi = getMonthCanChi(yearCanIndex, lunarMonth);
  const napAm = getNapAm(yearCanChi.can, yearCanChi.chi);

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeapMonth,
    yearCan: yearCanChi.can,
    yearChi: yearCanChi.chi,
    monthCan: monthCanChi.can,
    monthChi: monthCanChi.chi,
    napAm,
  };
}
