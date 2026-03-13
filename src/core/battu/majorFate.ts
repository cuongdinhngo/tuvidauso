import type { CanChi, FourPillars } from '../types';
import { THIEN_CAN, DIA_CHI } from '../types';
import { getCanIndex } from '../calendar/canChi';
import { getYinYang } from './fiveElements';
import { getJieQiDates } from '../calendar/jieQi';

export interface BatTuMajorFate {
  canChi: CanChi;
  startAge: number;
  endAge: number;
}

/**
 * Calculate Bat Tu Major Fate periods (Dai Van).
 *
 * Rules:
 * - Male + Yang Can year OR Female + Yin Can year → forward (thuan hanh)
 * - Male + Yin Can year OR Female + Yang Can year → reverse (nghich hanh)
 * - Start age = days from birth to nearest Jie Qi / 3
 * - Each period = 10 years
 * - Direction: forward = advance from month pillar, reverse = retreat from month pillar
 */
export function calculateBatTuMajorFates(
  fourPillars: FourPillars,
  gender: 'male' | 'female',
  solarYear: number,
  solarMonth: number,
  solarDay: number
): BatTuMajorFate[] {
  const yearYY = getYinYang(fourPillars.year.can);
  const isForward = (gender === 'male' && yearYY === 'Dương') ||
                    (gender === 'female' && yearYY === 'Âm');

  // Calculate start age: days to nearest Jie Qi / 3
  const startAge = calculateStartAge(solarYear, solarMonth, solarDay, isForward);

  // Get month pillar indices
  const monthCanIdx = getCanIndex(fourPillars.month.can);
  const monthChiIdx = DIA_CHI.indexOf(fourPillars.month.chi as typeof DIA_CHI[number]);

  // Generate 8 major fate periods
  const fates: BatTuMajorFate[] = [];
  for (let i = 1; i <= 8; i++) {
    const offset = isForward ? i : -i;
    const canIdx = ((monthCanIdx + offset) % 10 + 10) % 10;
    const chiIdx = ((monthChiIdx + offset) % 12 + 12) % 12;
    fates.push({
      canChi: { can: THIEN_CAN[canIdx], chi: DIA_CHI[chiIdx] },
      startAge: startAge + (i - 1) * 10,
      endAge: startAge + i * 10 - 1,
    });
  }

  return fates;
}

function calculateStartAge(
  solarYear: number, solarMonth: number, solarDay: number, isForward: boolean
): number {
  // Get Jie terms for the year (only even-indexed terms are Jie)
  const terms = getJieQiDates(solarYear);
  const nextTerms = getJieQiDates(solarYear + 1);
  const prevTerms = getJieQiDates(solarYear - 1);

  // Build list of all Jie dates (even indices)
  const jieDates: Date[] = [];
  // Previous year Dec terms
  for (let i = 0; i < 24; i += 2) {
    jieDates.push(new Date(solarYear - 1, prevTerms[i].month - 1, prevTerms[i].day));
  }
  for (let i = 0; i < 24; i += 2) {
    jieDates.push(new Date(solarYear, terms[i].month - 1, terms[i].day));
  }
  for (let i = 0; i < 24; i += 2) {
    jieDates.push(new Date(solarYear + 1, nextTerms[i].month - 1, nextTerms[i].day));
  }

  const birthDate = new Date(solarYear, solarMonth - 1, solarDay);

  if (isForward) {
    // Find next Jie after birth
    for (const jie of jieDates) {
      if (jie > birthDate) {
        const days = Math.round((jie.getTime() - birthDate.getTime()) / 86400000);
        return Math.round(days / 3);
      }
    }
  } else {
    // Find previous Jie before birth
    for (let i = jieDates.length - 1; i >= 0; i--) {
      if (jieDates[i] < birthDate) {
        const days = Math.round((birthDate.getTime() - jieDates[i].getTime()) / 86400000);
        return Math.round(days / 3);
      }
    }
  }

  return 5; // fallback
}
