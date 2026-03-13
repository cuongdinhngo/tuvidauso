import { DIA_CHI } from '../types';

/**
 * Determine Than Cung (Body Palace) from lunar month and birth hour.
 *
 * Algorithm:
 * 1. Start at Dan (index 2) for month 1
 * 2. Count forward by month: month 1=Dan, 2=Mao, 3=Thin, ..., 12=Suu
 * 3. From that position, count FORWARD by hour (opposite of Menh)
 *
 * Formula: chiIndex = (lunarMonth + 1 + hourIndex) % 12
 */
export function getThanCung(lunarMonth: number, hourIndex: number): string {
  const chiIndex = (lunarMonth + 1 + hourIndex) % 12;
  return DIA_CHI[chiIndex];
}
