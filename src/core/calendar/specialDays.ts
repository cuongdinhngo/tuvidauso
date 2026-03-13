import type { SpecialDay } from '../types';
import { SAT_CHU, THO_TU, THIEN_DUC, NGUYET_DUC } from '../../data/calendarData';

/** Tam Nương — ngày 3, 7, 13, 18, 22, 27 âm lịch */
export function isTamNuong(lunarDay: number): boolean {
  return [3, 7, 13, 18, 22, 27].includes(lunarDay);
}

/** Nguyệt Kỵ — ngày 5, 14, 23 âm lịch */
export function isNguyetKy(lunarDay: number): boolean {
  return [5, 14, 23].includes(lunarDay);
}

/** Sát Chủ — Chi ngày đặc biệt theo tháng âm lịch */
export function isSatChu(lunarMonth: number, dayChi: string): boolean {
  return SAT_CHU[lunarMonth] === dayChi;
}

/** Thọ Tử — Chi ngày đặc biệt theo tháng âm lịch */
export function isThoTu(lunarMonth: number, dayChi: string): boolean {
  return THO_TU[lunarMonth] === dayChi;
}

/** Thiên Đức — Can ngày đặc biệt theo tháng */
export function hasThienDuc(lunarMonth: number, dayCan: string): boolean {
  return THIEN_DUC[lunarMonth] === dayCan;
}

/** Nguyệt Đức — Can ngày đặc biệt theo tháng */
export function hasNguyetDuc(lunarMonth: number, dayCan: string): boolean {
  return NGUYET_DUC[lunarMonth] === dayCan;
}

/**
 * Tổng hợp sao tốt/xấu và ngày đặc biệt cho 1 ngày.
 */
export function getDailyStars(
  lunarMonth: number,
  lunarDay: number,
  dayCan: string,
  dayChi: string,
): { goodStars: string[]; badStars: string[]; specialDays: SpecialDay[] } {
  const goodStars: string[] = [];
  const badStars: string[] = [];
  const specialDays: SpecialDay[] = [];

  // Sao tốt
  if (hasThienDuc(lunarMonth, dayCan)) {
    goodStars.push('Thiên Đức');
    specialDays.push({ name: 'Thiên Đức', type: 'good', description: 'Ngày có Thiên Đức, giải được nhiều hung sát' });
  }
  if (hasNguyetDuc(lunarMonth, dayCan)) {
    goodStars.push('Nguyệt Đức');
    specialDays.push({ name: 'Nguyệt Đức', type: 'good', description: 'Ngày có Nguyệt Đức, rất tốt cho mọi việc' });
  }

  // Sao xấu / ngày đặc biệt
  if (isTamNuong(lunarDay)) {
    badStars.push('Tam Nương');
    specialDays.push({ name: 'Ngày Tam Nương', type: 'bad', description: 'Tránh cưới hỏi, khai trương, khởi công' });
  }
  if (isNguyetKy(lunarDay)) {
    badStars.push('Nguyệt Kỵ');
    specialDays.push({ name: 'Ngày Nguyệt Kỵ', type: 'bad', description: 'Ngày xấu — mùng 5, 14, 23 âm lịch' });
  }
  if (isSatChu(lunarMonth, dayChi)) {
    badStars.push('Sát Chủ');
    specialDays.push({ name: 'Ngày Sát Chủ', type: 'bad', description: 'Ngày rất xấu, tránh mọi việc quan trọng' });
  }
  if (isThoTu(lunarMonth, dayChi)) {
    badStars.push('Thọ Tử');
    specialDays.push({ name: 'Ngày Thọ Tử', type: 'bad', description: 'Ngày xấu, nên tránh khởi sự' });
  }

  return { goodStars, badStars, specialDays };
}
