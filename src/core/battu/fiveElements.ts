import type { FourPillars } from '../types';
import { getHiddenStems } from './hiddenStems';

/** Ngu Hanh (Five Elements) */
export type Element = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

/** Thien Can -> Ngu Hanh */
const CAN_ELEMENT: Record<string, Element> = {
  'Giáp': 'Mộc', 'Ất': 'Mộc',
  'Bính': 'Hỏa', 'Đinh': 'Hỏa',
  'Mậu': 'Thổ', 'Kỷ': 'Thổ',
  'Canh': 'Kim', 'Tân': 'Kim',
  'Nhâm': 'Thủy', 'Quý': 'Thủy',
};

/** Dia Chi -> Ngu Hanh */
const CHI_ELEMENT: Record<string, Element> = {
  'Tý': 'Thủy', 'Sửu': 'Thổ',
  'Dần': 'Mộc', 'Mão': 'Mộc',
  'Thìn': 'Thổ', 'Tị': 'Hỏa',
  'Ngọ': 'Hỏa', 'Mùi': 'Thổ',
  'Thân': 'Kim', 'Dậu': 'Kim',
  'Tuất': 'Thổ', 'Hợi': 'Thủy',
};

/** Get element of a Can or Chi */
export function getElement(canOrChi: string): Element {
  return CAN_ELEMENT[canOrChi] || CHI_ELEMENT[canOrChi] || 'Thổ';
}

/** Check if Can is Yin (Am) or Yang (Duong) */
export function getYinYang(can: string): 'Dương' | 'Âm' {
  const yangCans = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'];
  return yangCans.includes(can) ? 'Dương' : 'Âm';
}

/** Count elements from Four Pillars including hidden stems */
export function countElements(fourPillars: FourPillars): Record<Element, number> {
  const counts: Record<Element, number> = { 'Kim': 0, 'Mộc': 0, 'Thủy': 0, 'Hỏa': 0, 'Thổ': 0 };

  const pillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];
  for (const pillar of pillars) {
    // Count Can
    const canEl = CAN_ELEMENT[pillar.can];
    if (canEl) counts[canEl]++;

    // Count Chi
    const chiEl = CHI_ELEMENT[pillar.chi];
    if (chiEl) counts[chiEl]++;

    // Count hidden stems
    const hidden = getHiddenStems(pillar.chi);
    for (const h of hidden) {
      const hEl = CAN_ELEMENT[h];
      if (hEl) counts[hEl]++;
    }
  }

  return counts;
}

/** Element generation cycle (tuong sinh) */
export const GENERATION_CYCLE: Record<Element, Element> = {
  'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim',
};

/** Element overcoming cycle (tuong khac) */
export const OVERCOMING_CYCLE: Record<Element, Element> = {
  'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim',
};
