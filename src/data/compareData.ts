import type { RelationType } from '../core/types/compare';

/** Tam Hợp — 4 nhóm tam hợp */
export const TAM_HOP: [string, string, string][] = [
  ['Thân', 'Tý', 'Thìn'],
  ['Dần', 'Ngọ', 'Tuất'],
  ['Tị', 'Dậu', 'Sửu'],
  ['Hợi', 'Mão', 'Mùi'],
];

/** Lục Hợp — 6 cặp lục hợp */
export const LUC_HOP: [string, string][] = [
  ['Tý', 'Sửu'], ['Dần', 'Hợi'], ['Mão', 'Tuất'],
  ['Thìn', 'Dậu'], ['Tị', 'Thân'], ['Ngọ', 'Mùi'],
];

/** Lục Xung — 6 cặp xung */
export const LUC_XUNG: [string, string][] = [
  ['Tý', 'Ngọ'], ['Sửu', 'Mùi'], ['Dần', 'Thân'],
  ['Mão', 'Dậu'], ['Thìn', 'Tuất'], ['Tị', 'Hợi'],
];

/** Lục Hại — 6 cặp hại */
export const LUC_HAI: [string, string][] = [
  ['Tý', 'Mùi'], ['Sửu', 'Ngọ'], ['Dần', 'Tị'],
  ['Mão', 'Thìn'], ['Thân', 'Hợi'], ['Dậu', 'Tuất'],
];

/** Tam Hình — nhóm hình phạt */
export const TAM_HINH: string[][] = [
  ['Dần', 'Tị', 'Thân'],   // Hình vô ân
  ['Sửu', 'Tuất', 'Mùi'],  // Hình trì thế
  ['Tý', 'Mão'],            // Hình vô lễ
];

/** Thiên Can hợp (Ngũ Hợp) */
export const CAN_HOP: [string, string][] = [
  ['Giáp', 'Kỷ'], ['Ất', 'Canh'], ['Bính', 'Tân'],
  ['Đinh', 'Nhâm'], ['Mậu', 'Quý'],
];

/** Trọng số từng hạng mục theo loại quan hệ (tổng = 100) */
export const RELATION_WEIGHTS: Record<RelationType, Record<string, number>> = {
  lover: {
    napAm: 15, conGiap: 15, cungMenh: 10, cungLienQuan: 25,
    tuHoa: 20, batTu: 10, tuanTriet: 5,
  },
  business: {
    napAm: 10, conGiap: 10, cungMenh: 15, cungLienQuan: 25,
    tuHoa: 25, batTu: 10, tuanTriet: 5,
  },
  child: {
    napAm: 15, conGiap: 10, cungMenh: 15, cungLienQuan: 20,
    tuHoa: 15, batTu: 20, tuanTriet: 5,
  },
  parent: {
    napAm: 15, conGiap: 10, cungMenh: 15, cungLienQuan: 20,
    tuHoa: 15, batTu: 20, tuanTriet: 5,
  },
  sibling: {
    napAm: 15, conGiap: 15, cungMenh: 15, cungLienQuan: 15,
    tuHoa: 15, batTu: 15, tuanTriet: 10,
  },
  friend: {
    napAm: 15, conGiap: 15, cungMenh: 20, cungLienQuan: 15,
    tuHoa: 15, batTu: 15, tuanTriet: 5,
  },
};

/** Cung liên quan theo loại mối quan hệ */
export const RELATION_PALACE_MAP: Record<RelationType, { p1: string; p2: string; label: string }> = {
  lover:    { p1: 'Phu Thê',   p2: 'Phu Thê',   label: 'Phu Thê' },
  business: { p1: 'Quan Lộc',  p2: 'Quan Lộc',   label: 'Quan Lộc + Tài Bạch' },
  child:    { p1: 'Tử Tức',    p2: 'Phụ Mẫu',    label: 'Tử Tức ↔ Phụ Mẫu' },
  parent:   { p1: 'Phụ Mẫu',  p2: 'Tử Tức',     label: 'Phụ Mẫu ↔ Tử Tức' },
  sibling:  { p1: 'Huynh Đệ',  p2: 'Huynh Đệ',   label: 'Huynh Đệ' },
  friend:   { p1: 'Nô Bộc',    p2: 'Nô Bộc',     label: 'Nô Bộc (Giao Hữu)' },
};

/** Label tiếng Việt cho từng loại quan hệ */
export const RELATION_LABELS: Record<RelationType, string> = {
  lover: 'Người yêu / Vợ chồng',
  business: 'Đối tác làm ăn',
  child: 'Con cái',
  parent: 'Cha mẹ',
  sibling: 'Anh chị em',
  friend: 'Bạn bè / Đồng nghiệp',
};

/** Rating label theo điểm */
export function getRatingLabel(score: number): string {
  if (score >= 85) return 'Rất hợp';
  if (score >= 70) return 'Khá hợp';
  if (score >= 50) return 'Trung bình';
  if (score >= 30) return 'Nhiều thử thách';
  return 'Rất khó hòa hợp';
}

/** Score -> rating 1-5 */
export function scoreToRating(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 85) return 5;
  if (score >= 70) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  return 1;
}
