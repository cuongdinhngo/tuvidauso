import type { Sao28Info } from '../types';
import { julianDayNumber } from './canChi';
import { SAO28_DATA, SAO28_JDN_OFFSET } from '../../data/calendarData';

/**
 * Tính 28 Sao (Nhị Thập Bát Tú) cho 1 ngày dương lịch.
 * 28 Sao luân phiên theo chu kỳ 28 ngày, dựa trên Julian Day Number.
 */
export function getSao28(solarYear: number, solarMonth: number, solarDay: number): Sao28Info {
  const jdn = julianDayNumber(solarYear, solarMonth, solarDay);
  const idx = (jdn + SAO28_JDN_OFFSET) % 28;
  return SAO28_DATA[idx];
}
