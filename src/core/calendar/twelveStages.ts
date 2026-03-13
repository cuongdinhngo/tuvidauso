import type { TrucInfo } from '../types';
import { getChiIndex } from './canChi';
import { TRUC_DATA } from '../../data/calendarData';

/**
 * Tính Trực (Kiến Trừ) cho 1 ngày.
 * Quy tắc: Trực Kiến luôn rơi vào ngày có Chi trùng Chi tháng.
 * Từ đó đếm thuận qua 12 Trực theo Chi ngày.
 *
 * @param monthChi - Chi of the lunar month (e.g. "Dần" for month 1)
 * @param dayChi - Chi of the day
 */
export function getTruc(monthChi: string, dayChi: string): TrucInfo {
  const monthChiIdx = getChiIndex(monthChi);
  const dayChiIdx = getChiIndex(dayChi);
  const trucIdx = (dayChiIdx - monthChiIdx + 12) % 12;
  return TRUC_DATA[trucIdx];
}
