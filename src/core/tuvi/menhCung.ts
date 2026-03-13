import { DIA_CHI } from '../types';

/**
 * Determine Menh Cung (Life Palace) from lunar month and birth hour.
 *
 * Algorithm:
 * 1. Start at Dan (index 2) for month 1
 * 2. Count forward by month: month 1=Dan, 2=Mao, 3=Thin, ..., 12=Suu
 * 3. From that position, count backward by hour: Ty=stay, Suu=back 1, Dan=back 2, ...
 *
 * Formula: chiIndex = (lunarMonth + 1 - hourIndex + 24) % 12
 */
export function getMenhCung(lunarMonth: number, hourIndex: number): string {
  // lunarMonth: 1-12
  // hourIndex: 0=Ty, 1=Suu, 2=Dan, ..., 11=Hoi
  const chiIndex = ((lunarMonth + 1) - hourIndex + 24) % 12;
  return DIA_CHI[chiIndex];
}
