import type { HourInfo } from '../types';
import { DIA_CHI, DIA_CHI_HOURS } from '../types';
import { HOUR_STARS, HOANG_DAO_STARS, THANH_LONG_START } from '../../data/calendarData';

/**
 * Tính Giờ Hoàng Đạo cho 1 ngày dựa trên Chi ngày.
 *
 * 12 giờ trong ngày, mỗi giờ ứng với 1 sao (Thanh Long, Minh Đường, ...).
 * 6 sao Hoàng Đạo (tốt) xen kẽ 6 sao Hắc Đạo (xấu).
 * Vị trí bắt đầu (Thanh Long ở giờ nào) tùy thuộc Chi ngày.
 */
export function getHoangDaoHours(dayChi: string): HourInfo[] {
  const startIdx = THANH_LONG_START[dayChi] ?? 0;

  return DIA_CHI.map((chi, hourIdx) => {
    const starIdx = (hourIdx - startIdx + 12) % 12;
    const starName = HOUR_STARS[starIdx];
    return {
      chi,
      timeRange: DIA_CHI_HOURS[hourIdx].time,
      starName,
      isHoangDao: HOANG_DAO_STARS.has(starName),
    };
  });
}
