import { THIEN_CAN, DIA_CHI } from '../types';

/**
 * Determine Cuc (Five Element Bureau) from year Can and Menh Cung position.
 *
 * 5 Cuc:
 *   2 = Thuy Nhi Cuc
 *   3 = Moc Tam Cuc
 *   4 = Kim Tu Cuc
 *   5 = Tho Ngu Cuc
 *   6 = Hoa Luc Cuc
 *
 * Lookup table: rows = Can pairs (Giap/Ky, At/Canh, Binh/Tan, Dinh/Nham, Mau/Quy)
 *               cols = 12 Dia Chi (Ty, Suu, Dan, ..., Hoi)
 */

// CUC_TABLE[canPairIndex][chiIndex] = cuc value
const CUC_TABLE: number[][] = [
  // Giap/Ky:  Ty  Suu Dan Mao Thin Ti  Ngo Mui Than Dau Tuat Hoi
  /*Giáp/Kỷ*/ [2,  6,  3,  4,  5,  2,  6,  3,  4,   5,  2,   6],
  /*Ất/Canh*/  [6,  2,  4,  3,  6,  5,  2,  4,  3,   6,  5,   2],
  /*Bính/Tân*/ [3,  4,  5,  2,  6,  3,  4,  5,  2,   6,  3,   4],
  /*Đinh/Nhâm*/[4,  3,  6,  5,  2,  4,  3,  6,  5,   2,  4,   3],
  /*Mậu/Quý*/ [5,  5,  2,  6,  3,  5,  5,  2,  6,   3,  5,   5],
];

const CUC_NAMES: Record<number, string> = {
  2: 'Thủy Nhị Cục',
  3: 'Mộc Tam Cục',
  4: 'Kim Tứ Cục',
  5: 'Thổ Ngũ Cục',
  6: 'Hỏa Lục Cục',
};

/**
 * Get Cuc from year Can and Menh Cung position.
 */
export function getCuc(yearCan: string, menhCung: string): { name: string; value: number } {
  const canIndex = THIEN_CAN.indexOf(yearCan as typeof THIEN_CAN[number]);
  const chiIndex = DIA_CHI.indexOf(menhCung as typeof DIA_CHI[number]);

  if (canIndex < 0 || chiIndex < 0) {
    throw new Error(`Invalid yearCan "${yearCan}" or menhCung "${menhCung}"`);
  }

  const canPairIndex = canIndex % 5; // Giap/Ky=0, At/Canh=1, ...
  const value = CUC_TABLE[canPairIndex][chiIndex];

  return { name: CUC_NAMES[value], value };
}
