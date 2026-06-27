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

// CUC_TABLE[canPairIndex][chiIndex] = cuc value.
// Cục = ngũ-hành nạp âm của Can-Chi cung Mệnh (Can lấy theo Ngũ Hổ Độn từ Can năm).
// Vì nạp âm gán 1 hành cho mỗi cặp Can-Chi liền nhau, mỗi hàng gồm 6 cặp địa-chi
// liền kề bằng nhau; riêng Tuất/Hợi lấy theo Dần/Mão ("Tuất Hợi... Cục tòng Dần Mão").
// Nguồn: tuvi.cohoc.net (bảng lập cục, dạng text); tuvisaigon.vn bài 6 (khẩu quyết).
const CUC_TABLE: number[][] = [
  //            Tý Sửu Dần Mão Thìn Tị Ngọ Mùi Thân Dậu Tuất Hợi
  /*Giáp/Kỷ*/  [ 2,  2,  6,  6,   3,  3,  5,   5,   4,  4,   6,   6],
  /*Ất/Canh*/  [ 6,  6,  5,  5,   4,  4,  3,   3,   2,  2,   5,   5],
  /*Bính/Tân*/ [ 5,  5,  3,  3,   2,  2,  4,   4,   6,  6,   3,   3],
  /*Đinh/Nhâm*/[ 3,  3,  4,  4,   6,  6,  2,   2,   5,  5,   4,   4],
  /*Mậu/Quý*/  [ 4,  4,  2,  2,   5,  5,  6,   6,   3,  3,   2,   2],
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
