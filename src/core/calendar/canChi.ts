import { THIEN_CAN, DIA_CHI, type CanChi } from '../types';

/** Get Can Chi of a lunar year */
export function getYearCanChi(lunarYear: number): CanChi {
  const canIndex = (lunarYear - 4) % 10;
  const chiIndex = (lunarYear - 4) % 12;
  return { can: THIEN_CAN[canIndex], chi: DIA_CHI[chiIndex] };
}

/**
 * Get Can Chi of a lunar month using Ngu Ho Don formula.
 * yearCanIndex: index of year's Thien Can (0=Giap, 1=At, ...)
 * lunarMonth: 1-12
 */
export function getMonthCanChi(yearCanIndex: number, lunarMonth: number): CanChi {
  // Ngu Ho Don: determines the starting Can for month 1 (Dan)
  // Giap/Ky -> Binh Dan, At/Canh -> Mau Dan, Binh/Tan -> Canh Dan,
  // Dinh/Nham -> Nham Dan, Mau/Quy -> Giap Dan
  const startCanMap = [2, 4, 6, 8, 0]; // Binh=2, Mau=4, Canh=6, Nham=8, Giap=0
  const startCan = startCanMap[yearCanIndex % 5];
  const canIndex = (startCan + lunarMonth - 1) % 10;
  // Month 1 = Dan(2), Month 2 = Mao(3), ..., Month 11 = Ty(0), Month 12 = Suu(1)
  const chiIndex = (lunarMonth + 1) % 12;
  return { can: THIEN_CAN[canIndex], chi: DIA_CHI[chiIndex] };
}

/**
 * Get Can Chi of a solar day using Julian Day Number.
 */
export function getDayCanChi(solarYear: number, solarMonth: number, solarDay: number): CanChi {
  const jdn = julianDayNumber(solarYear, solarMonth, solarDay);
  // Can and Chi use separate offsets from JDN:
  // Heavenly Stem (Can): (JDN + 9) % 10, where 0 = Giap
  // Earthly Branch (Chi): (JDN + 1) % 12, where 0 = Ty
  const canIndex = (jdn + 9) % 10;
  const chiIndex = (jdn + 1) % 12;
  return { can: THIEN_CAN[canIndex], chi: DIA_CHI[chiIndex] };
}

/**
 * Get Can Chi of a birth hour using Ngu Thu Don formula.
 * dayCanIndex: index of day's Thien Can (0=Giap, 1=At, ...)
 * hourIndex: 0=Ty, 1=Suu, ..., 11=Hoi
 */
export function getHourCanChi(dayCanIndex: number, hourIndex: number): CanChi {
  // Ngu Thu Don: determines starting Can for hour Ty
  // Giap/Ky -> Giap Ty, At/Canh -> Binh Ty, Binh/Tan -> Mau Ty,
  // Dinh/Nham -> Canh Ty, Mau/Quy -> Nham Ty
  const startCanMap = [0, 2, 4, 6, 8]; // Giap=0, Binh=2, Mau=4, Canh=6, Nham=8
  const startCan = startCanMap[dayCanIndex % 5];
  const canIndex = (startCan + hourIndex) % 10;
  return { can: THIEN_CAN[canIndex], chi: DIA_CHI[hourIndex] };
}

/** Calculate Julian Day Number for a date */
export function julianDayNumber(year: number, month: number, day: number): number {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Get Can index from Can name */
export function getCanIndex(can: string): number {
  return THIEN_CAN.indexOf(can as typeof THIEN_CAN[number]);
}

/** Get Chi index from Chi name */
export function getChiIndex(chi: string): number {
  return DIA_CHI.indexOf(chi as typeof DIA_CHI[number]);
}

/** Check if a Can is Yang (Duong) */
export function isYangCan(can: string): boolean {
  const idx = getCanIndex(can);
  return idx % 2 === 0; // Giap, Binh, Mau, Canh, Nham = even indices
}
