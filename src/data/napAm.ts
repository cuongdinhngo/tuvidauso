import { THIEN_CAN, DIA_CHI } from '../core/types';

/**
 * 60 Giap Ty Nap Am - each pair of consecutive Can-Chi shares one Nap Am.
 * Index = sexagenary cycle index (0-59), every 2 consecutive indices share 1 Nap Am.
 */
const NAP_AM_LIST: string[] = [
  'Hải Trung Kim',   // Giáp Tý, Ất Sửu
  'Lô Trung Hỏa',   // Bính Dần, Đinh Mão
  'Đại Lâm Mộc',    // Mậu Thìn, Kỷ Tị
  'Lộ Bàng Thổ',    // Canh Ngọ, Tân Mùi
  'Kiếm Phong Kim',  // Nhâm Thân, Quý Dậu
  'Sơn Đầu Hỏa',   // Giáp Tuất, Ất Hợi
  'Giản Hạ Thủy',   // Bính Tý, Đinh Sửu
  'Thành Đầu Thổ',  // Mậu Dần, Kỷ Mão
  'Bạch Lạp Kim',   // Canh Thìn, Tân Tị
  'Dương Liễu Mộc', // Nhâm Ngọ, Quý Mùi
  'Tuyền Trung Thủy', // Giáp Thân, Ất Dậu
  'Ốc Thượng Thổ',  // Bính Tuất, Đinh Hợi
  'Tích Lịch Hỏa',  // Mậu Tý, Kỷ Sửu
  'Tùng Bách Mộc',  // Canh Dần, Tân Mão
  'Trường Lưu Thủy', // Nhâm Thìn, Quý Tị
  'Sa Trung Kim',    // Giáp Ngọ, Ất Mùi
  'Sơn Hạ Hỏa',    // Bính Thân, Đinh Dậu
  'Bình Địa Mộc',   // Mậu Tuất, Kỷ Hợi
  'Bích Thượng Thổ', // Canh Tý, Tân Sửu
  'Kim Bạch Kim',   // Nhâm Dần, Quý Mão
  'Phúc Đăng Hỏa',  // Giáp Thìn, Ất Tị
  'Thiên Hà Thủy',  // Bính Ngọ, Đinh Mùi
  'Đại Dịch Thổ',   // Mậu Thân, Kỷ Dậu
  'Thoa Xuyến Kim',  // Canh Tuất, Tân Hợi
  'Tang Đố Mộc',    // Nhâm Tý, Quý Sửu
  'Đại Khê Thủy',   // Giáp Dần, Ất Mão
  'Sa Trung Thổ',   // Bính Thìn, Đinh Tị
  'Thiên Thượng Hỏa', // Mậu Ngọ, Kỷ Mùi
  'Thạch Lựu Mộc',  // Canh Thân, Tân Dậu
  'Đại Hải Thủy',   // Nhâm Tuất, Quý Hợi
];

/**
 * Get the sexagenary cycle index (0-59) from Can and Chi.
 */
export function getSexagenaryCycleIndex(can: string, chi: string): number {
  const canIdx = THIEN_CAN.indexOf(can as typeof THIEN_CAN[number]);
  const chiIdx = DIA_CHI.indexOf(chi as typeof DIA_CHI[number]);
  if (canIdx < 0 || chiIdx < 0) return -1;

  // Can and Chi must have same parity (both even or both odd)
  // Cycle index formula: find n in [0,59] where n%10=canIdx and n%12=chiIdx
  // Using: n = (6*canIdx - 5*chiIdx) % 60
  let n = (6 * canIdx - 5 * chiIdx) % 60;
  if (n < 0) n += 60;
  return n;
}

/**
 * Get Nap Am for a given Can-Chi pair.
 */
export function getNapAm(can: string, chi: string): string {
  const cycleIndex = getSexagenaryCycleIndex(can, chi);
  if (cycleIndex < 0) return '';
  return NAP_AM_LIST[Math.floor(cycleIndex / 2)];
}
