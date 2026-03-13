import { THIEN_CAN, DIA_CHI } from '../types';
import { getCanIndex, getChiIndex } from '../calendar/canChi';
import { isYangCan } from '../calendar/canChi';
import type { PalacePosition } from './twelvePalaces';

export interface MajorPeriod {
  position: string;   // Dia Chi of the palace
  palace: string;     // Palace name at that position
  can: string;        // Thien Can of the period
  chi: string;        // Dia Chi of the period
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
}

/**
 * Get the Can of each palace position, derived from year Can + Ngu Ho Don.
 * The Can of Dan palace is determined by Ngu Ho Don from year Can.
 * Then count forward through the positions.
 */
function getPalaceCan(yearCan: string, position: string): string {
  const yearCanIdx = getCanIndex(yearCan);
  // Ngu Ho Don: starting Can for Dan position
  const startCanMap = [2, 4, 6, 8, 0]; // same as month calculation
  const danCan = startCanMap[yearCanIdx % 5];

  // Dan = index 2. Position's index relative to Dan.
  const posIdx = getChiIndex(position);
  const offset = ((posIdx - 2) % 12 + 12) % 12;
  return THIEN_CAN[(danCan + offset) % 10];
}

/**
 * Calculate Tu Vi Major Periods (Dai Han).
 *
 * Rules:
 * - Start age = Cuc value
 * - Start from Menh palace
 * - Duong Nam / Am Nu -> forward (thuan)
 * - Am Nam / Duong Nu -> reverse (nghich)
 * - Each period = 10 years
 */
export function calculateMajorPeriods(
  menhCung: string,
  cucValue: number,
  yearCan: string,
  gender: 'male' | 'female',
  birthYear: number,
  palaces: PalacePosition[]
): MajorPeriod[] {
  const isYang = isYangCan(yearCan);
  const isForward = (gender === 'male' && isYang) || (gender === 'female' && !isYang);

  const menhIdx = getChiIndex(menhCung);
  const periods: MajorPeriod[] = [];

  // Build a map from position to palace name
  const positionToPalace: Record<string, string> = {};
  for (const p of palaces) {
    positionToPalace[p.position] = p.palace;
  }

  for (let i = 0; i < 12; i++) {
    const offset = isForward ? i : -i;
    const posIdx = ((menhIdx + offset) % 12 + 12) % 12;
    const position = DIA_CHI[posIdx];
    const can = getPalaceCan(yearCan, position);
    const startAge = cucValue + i * 10;
    const endAge = startAge + 9;

    periods.push({
      position,
      palace: positionToPalace[position] || '',
      can,
      chi: position,
      startAge,
      endAge,
      startYear: birthYear + startAge - 1,
      endYear: birthYear + endAge - 1,
    });
  }

  return periods;
}
