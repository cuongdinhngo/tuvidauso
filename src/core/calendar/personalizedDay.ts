import type { DailyInfo, PersonalizedDayInfo } from '../types';
import { TAM_HOP, LUC_HOP, LUC_XUNG } from '../../data/compareData';

function isChiClash(chi1: string, chi2: string): boolean {
  return LUC_XUNG.some(([a, b]) => (a === chi1 && b === chi2) || (a === chi2 && b === chi1));
}

function isTamHop(chi1: string, chi2: string): boolean {
  return TAM_HOP.some(group => group.includes(chi1) && group.includes(chi2));
}

function isLucHop(chi1: string, chi2: string): boolean {
  return LUC_HOP.some(([a, b]) => (a === chi1 && b === chi2) || (a === chi2 && b === chi1));
}

/**
 * Cá nhân hóa đánh giá ngày theo tuổi người dùng.
 *
 * @param dailyInfo - Thông tin ngày
 * @param userYearChi - Chi năm sinh (e.g. "Thìn", "Tý")
 */
export function personalizeDay(dailyInfo: DailyInfo, userYearChi: string): PersonalizedDayInfo {
  const dayChi = dailyInfo.canChiDay.chi;
  const clash = isChiClash(dayChi, userYearChi);
  const tamHop = isTamHop(dayChi, userYearChi);
  const lucHop = isLucHop(dayChi, userYearChi);
  const harmony = tamHop || lucHop;

  let personalScore = 0;
  let personalAdvice = '';

  if (clash) {
    personalScore = -20;
    personalAdvice = `Ngày ${dayChi} XUNG tuổi ${userYearChi} — nên tránh việc quan trọng`;
  } else if (tamHop) {
    personalScore = 15;
    personalAdvice = `Ngày ${dayChi} TAM HỢP tuổi ${userYearChi} — rất thuận lợi`;
  } else if (lucHop) {
    personalScore = 10;
    personalAdvice = `Ngày ${dayChi} LỤC HỢP tuổi ${userYearChi} — thuận lợi`;
  } else {
    personalScore = 0;
    personalAdvice = `Ngày ${dayChi} không xung tuổi ${userYearChi}`;
  }

  return {
    chiClash: clash,
    chiClashNote: clash
      ? `Ngày ${dayChi} XUNG tuổi ${userYearChi} → nên tránh việc quan trọng`
      : `Ngày ${dayChi} không xung tuổi ${userYearChi} ✓`,
    chiHarmony: harmony,
    chiHarmonyNote: tamHop
      ? `Tam Hợp tuổi ${userYearChi} — rất tốt`
      : lucHop
        ? `Lục Hợp tuổi ${userYearChi} — tốt`
        : '',
    personalScore,
    personalAdvice,
  };
}
