import type { Purpose, GoodDayResult } from '../types';
import { PURPOSE_FILTERS } from '../../data/calendarData';
import { LUC_XUNG } from '../../data/compareData';
import { getDailyInfo } from './dailyInfo';

function isChiClash(chi1: string, chi2: string): boolean {
  return LUC_XUNG.some(([a, b]) => (a === chi1 && b === chi2) || (a === chi2 && b === chi1));
}

function scoreToRating(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 85) return 5;
  if (score >= 70) return 4;
  if (score >= 55) return 3;
  if (score >= 40) return 2;
  return 1;
}

/**
 * Tìm ngày tốt trong 1 tháng cho mục đích cụ thể.
 *
 * @param year - Năm dương lịch
 * @param month - Tháng dương lịch (1-12)
 * @param purpose - Mục đích (cuoi_hoi, khai_truong, ...)
 * @param userYearChi - Chi năm sinh của user (optional, để lọc xung tuổi)
 */
export function findGoodDays(
  year: number,
  month: number,
  purpose: Purpose,
  userYearChi?: string,
): GoodDayResult[] {
  const filter = PURPOSE_FILTERS[purpose];
  const results: GoodDayResult[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const info = getDailyInfo(year, month, day);

    // Check Trực requirements
    if (filter.requiredTruc.length > 0 && !filter.requiredTruc.includes(info.truc.name)) continue;
    if (filter.forbiddenTruc.includes(info.truc.name)) continue;

    // Check forbidden bad stars
    if (filter.forbiddenBadStars.some(s => info.badStars.includes(s))) continue;

    // Check forbidden special days
    if (filter.forbiddenSpecial.some(s => info.specialDays.some(sd => sd.name === s))) continue;

    // Check xung tuổi
    if (userYearChi && isChiClash(info.canChiDay.chi, userYearChi)) continue;

    // Scoring
    let score = 50;

    // Trực bonus
    if (['Thành', 'Khai'].includes(info.truc.name)) score += 20;
    else if (['Định', 'Mãn'].includes(info.truc.name)) score += 15;
    else if (info.truc.rating === 2) score += 5;

    // Good stars bonus
    if (info.goodStars.includes('Thiên Đức')) score += 15;
    if (info.goodStars.includes('Nguyệt Đức')) score += 15;
    score += info.goodStars.length * 3;

    // Bad stars penalty (light — these passed the filter but still penalize)
    score -= info.badStars.length * 5;

    // Sao28 bonus
    if (info.sao28.rating === 3) score += 10;
    else if (info.sao28.rating === 1) score -= 5;

    // Hoàng Đạo morning hours bonus
    if (filter.preferHoangDao) {
      const morningHoangDao = info.hoangDaoHours
        .filter(h => ['Dần', 'Mão', 'Thìn', 'Tị'].includes(h.chi))
        .filter(h => h.isHoangDao).length;
      score += morningHoangDao * 5;
    }

    score = Math.max(0, Math.min(100, score));

    const bestHours = info.hoangDaoHours
      .filter(h => h.isHoangDao)
      .map(h => `${h.chi} (${h.timeRange}) — ${h.starName}`);

    results.push({
      date: { year, month, day },
      lunar: info.lunar,
      canChiDay: info.canChiDay,
      truc: info.truc,
      sao28: info.sao28,
      score,
      rating: scoreToRating(score),
      goodStars: info.goodStars,
      badStars: info.badStars,
      hoangDaoHours: info.hoangDaoHours,
      goodFor: info.goodFor,
      badFor: info.badFor,
      bestHours,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}
