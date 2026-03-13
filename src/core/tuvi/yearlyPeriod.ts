import { DIA_CHI } from '../types';
import { getChiIndex } from '../calendar/canChi';
import { getYearCanChi } from '../calendar/canChi';
import { getFourTransforms, type FourTransforms } from './fourTransforms';
import type { PalacePosition } from './twelvePalaces';

export interface YearlyFortune {
  year: number;
  age: number;
  position: string;     // Dia Chi of Tieu Han palace
  palace: string;       // Palace name at that position
  yearCan: string;
  yearChi: string;
  transforms: FourTransforms;
}

/**
 * Tieu Han (Yearly Fortune) starting positions.
 * Based on year Chi group and gender.
 */
const TIEU_HAN_START: Record<string, { male: string; female: string }> = {
  // Dan Ngo Tuat group
  'Dần': { male: 'Thìn', female: 'Tuất' },
  'Ngọ': { male: 'Thìn', female: 'Tuất' },
  'Tuất': { male: 'Thìn', female: 'Tuất' },
  // Than Ty Thin group
  'Thân': { male: 'Tuất', female: 'Thìn' },
  'Tý': { male: 'Tuất', female: 'Thìn' },
  'Thìn': { male: 'Tuất', female: 'Thìn' },
  // Ti Dau Suu group
  'Tị': { male: 'Mùi', female: 'Sửu' },
  'Dậu': { male: 'Mùi', female: 'Sửu' },
  'Sửu': { male: 'Mùi', female: 'Sửu' },
  // Hoi Mao Mui group
  'Hợi': { male: 'Sửu', female: 'Mùi' },
  'Mão': { male: 'Sửu', female: 'Mùi' },
  'Mùi': { male: 'Sửu', female: 'Mùi' },
};

/**
 * Calculate yearly fortune (Tieu Han) for a range of years.
 */
export function calculateYearlyFortune(
  yearChi: string,
  gender: 'male' | 'female',
  birthYear: number,
  palaces: PalacePosition[],
  fromYear: number,
  toYear: number
): YearlyFortune[] {
  const startConfig = TIEU_HAN_START[yearChi];
  if (!startConfig) return [];

  const startPos = gender === 'male' ? startConfig.male : startConfig.female;
  const startIdx = getChiIndex(startPos);
  const isForward = gender === 'male'; // Male forward, Female reverse

  // Build position -> palace map
  const positionToPalace: Record<string, string> = {};
  for (const p of palaces) {
    positionToPalace[p.position] = p.palace;
  }

  const results: YearlyFortune[] = [];

  for (let year = fromYear; year <= toYear; year++) {
    const age = year - birthYear + 1; // Vietnamese age (tuoi am lich)
    if (age < 1) continue;

    const offset = age - 1; // Age 1 = start position
    const posIdx = isForward
      ? ((startIdx + offset) % 12 + 12) % 12
      : ((startIdx - offset) % 12 + 12) % 12;
    const position = DIA_CHI[posIdx];

    const yearCanChi = getYearCanChi(year);
    const transforms = getFourTransforms(yearCanChi.can);

    results.push({
      year,
      age,
      position,
      palace: positionToPalace[position] || '',
      yearCan: yearCanChi.can,
      yearChi: yearCanChi.chi,
      transforms,
    });
  }

  return results;
}
