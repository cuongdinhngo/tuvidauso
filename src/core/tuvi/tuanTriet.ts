import { getSexagenaryCycleIndex } from '../../data/napAm';

export interface TuanTriet {
  tuan: [string, string];   // 2 cung bị Tuần Không
  triet: [string, string];  // 2 cung bị Triệt Lộ
}

/**
 * Tuần Không — based on year Can Chi position in 60 Giáp Tý cycle.
 * Each group of 10 consecutive entries shares the same Tuần.
 * The 2 Địa Chi NOT represented in that group are the Tuần positions.
 */
const TUAN_MAP: [string, string][] = [
  ['Tuất', 'Hợi'],   // Tuần Giáp Tý (index 0-9)
  ['Thân', 'Dậu'],   // Tuần Giáp Tuất (index 10-19)
  ['Ngọ', 'Mùi'],    // Tuần Giáp Thân (index 20-29)
  ['Thìn', 'Tị'],    // Tuần Giáp Ngọ (index 30-39)
  ['Dần', 'Mão'],    // Tuần Giáp Thìn (index 40-49)
  ['Tý', 'Sửu'],     // Tuần Giáp Dần (index 50-59)
];

export function getTuanKhong(yearCan: string, yearChi: string): [string, string] {
  const cycleIndex = getSexagenaryCycleIndex(yearCan, yearChi);
  const tuanIndex = Math.floor(cycleIndex / 10);
  return TUAN_MAP[tuanIndex];
}

/**
 * Triệt Lộ — based on year Can only (trường phái phổ biến nhất).
 * Five Can-pairs share a Triệt zone; Triệt never falls on Tuất/Hợi.
 * Khẩu quyết: "Giáp Kỷ → Thân Dậu; Ất Canh → Ngọ Mùi; Bính Tân → Thìn Tị;
 *              Đinh Nhâm → Dần Mão; Mậu Quý → Tý Sửu."
 * Nguồn: Tử Vi Đẩu Số Tân Biên (Vân Đằng Thái Thứ Lang); hocvienlyso.org,
 *        vietdich (phép đếm). Pairing is (Giáp,Kỷ),(Ất,Canh),(Bính,Tân),
 *        (Đinh,Nhâm),(Mậu,Quý) — NOT consecutive Can.
 */
const TRIET_MAP: Record<string, [string, string]> = {
  'Giáp': ['Thân', 'Dậu'],
  'Kỷ':   ['Thân', 'Dậu'],
  'Ất':   ['Ngọ', 'Mùi'],
  'Canh': ['Ngọ', 'Mùi'],
  'Bính': ['Thìn', 'Tị'],
  'Tân':  ['Thìn', 'Tị'],
  'Đinh': ['Dần', 'Mão'],
  'Nhâm': ['Dần', 'Mão'],
  'Mậu':  ['Tý', 'Sửu'],
  'Quý':  ['Tý', 'Sửu'],
};

export function getTrietLo(yearCan: string): [string, string] {
  return TRIET_MAP[yearCan];
}

/**
 * Calculate both Tuần Không and Triệt Lộ for a given year.
 */
export function calculateTuanTriet(yearCan: string, yearChi: string): TuanTriet {
  return {
    tuan: getTuanKhong(yearCan, yearChi),
    triet: getTrietLo(yearCan),
  };
}
