import type { DailyInfo } from '../types';
import { solarToLunar } from './solarToLunar';
import { getDayCanChi } from './canChi';
import { getNapAm } from '../../data/napAm';
import { getTruc } from './twelveStages';
import { getSao28 } from './sao28';
import { getHoangDaoHours } from './hoangDao';
import { getDailyStars } from './specialDays';

/**
 * Tính toán đầy đủ thông tin cho 1 ngày dương lịch.
 */
export function getDailyInfo(year: number, month: number, day: number): DailyInfo {
  // Lunar conversion
  const lunar = solarToLunar(year, month, day);

  // Can Chi of day
  const canChiDay = getDayCanChi(year, month, day);

  // Can Chi of month (from lunar)
  const canChiMonth = { can: lunar.monthCan, chi: lunar.monthChi };

  // Can Chi of year (from lunar)
  const canChiYear = { can: lunar.yearCan, chi: lunar.yearChi };

  // Nạp Âm of day Can Chi
  const napAmDay = getNapAm(canChiDay.can, canChiDay.chi);

  // 12 Trực
  const truc = getTruc(lunar.monthChi, canChiDay.chi);

  // 28 Sao
  const sao28 = getSao28(year, month, day);

  // Giờ Hoàng Đạo
  const hoangDaoHours = getHoangDaoHours(canChiDay.chi);

  // Sao tốt/xấu & ngày đặc biệt
  const { goodStars, badStars, specialDays } = getDailyStars(
    lunar.month, lunar.day, canChiDay.can, canChiDay.chi,
  );

  // Tính overall rating (1-5)
  let score = 50;

  // Trực rating contribution
  if (truc.rating === 3) score += 20;
  else if (truc.rating === 2) score += 5;
  else score -= 15;

  // Sao28 rating contribution
  if (sao28.rating === 3) score += 10;
  else if (sao28.rating === 1) score -= 10;

  // Good stars bonus
  if (goodStars.includes('Thiên Đức')) score += 15;
  if (goodStars.includes('Nguyệt Đức')) score += 15;

  // Bad stars penalty
  if (badStars.includes('Tam Nương')) score -= 20;
  if (badStars.includes('Nguyệt Kỵ')) score -= 15;
  if (badStars.includes('Sát Chủ')) score -= 20;
  if (badStars.includes('Thọ Tử')) score -= 10;

  score = Math.max(0, Math.min(100, score));

  const overallRating: 1 | 2 | 3 | 4 | 5 =
    score >= 80 ? 5 :
    score >= 65 ? 4 :
    score >= 50 ? 3 :
    score >= 35 ? 2 : 1;

  // Combine goodFor/badFor from Trực + Sao28
  const goodForSet = new Set([...truc.goodFor, ...sao28.goodFor]);
  const badForSet = new Set([...truc.badFor, ...sao28.badFor]);
  // Remove from goodFor anything that also appears in badFor
  for (const item of badForSet) goodForSet.delete(item);

  const dayOfWeek = new Date(year, month - 1, day).getDay();

  return {
    solar: { year, month, day, dayOfWeek },
    lunar,
    canChiDay,
    canChiMonth,
    canChiYear,
    napAmDay,
    truc,
    sao28,
    hoangDaoHours,
    goodStars,
    badStars,
    specialDays,
    overallRating,
    goodFor: [...goodForSet],
    badFor: [...badForSet],
  };
}
