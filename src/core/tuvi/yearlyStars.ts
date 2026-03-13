import { getYearCanChi } from '../calendar/canChi';
import { LOC_TON, THIEN_MA } from './auxStars';

export interface YearlyStar {
  star: string;
  position: string;
}

/**
 * Compute key lưu tinh (yearly transiting stars) for a given year.
 * Uses the year's Can/Chi (not birth year's).
 */
export function getYearlyStars(year: number): YearlyStar[] {
  const { can, chi } = getYearCanChi(year);
  const stars: YearlyStar[] = [];

  // Lộc Tồn lưu niên (by year Can)
  const locTonPos = LOC_TON[can];
  if (locTonPos) {
    stars.push({ star: 'Lộc Tồn (lưu)', position: locTonPos });
  }

  // Thiên Mã lưu niên (by year Chi)
  const thienMaPos = THIEN_MA[chi];
  if (thienMaPos) {
    stars.push({ star: 'Thiên Mã (lưu)', position: thienMaPos });
  }

  return stars;
}
