import { DIA_CHI } from '../types';

export interface AuxStarPosition {
  star: string;
  position: string;
  group: string;
}

function chiIndex(chi: string): number {
  return DIA_CHI.indexOf(chi as typeof DIA_CHI[number]);
}

function offsetChi(base: number, offset: number): string {
  return DIA_CHI[((base + offset) % 12 + 12) % 12];
}

// === Group 1: Loc Ton (by year Can) ===
export const LOC_TON: Record<string, string> = {
  'Giáp': 'Dần', 'Ất': 'Mão', 'Bính': 'Tị', 'Đinh': 'Ngọ',
  'Mậu': 'Tị', 'Kỷ': 'Ngọ', 'Canh': 'Thân', 'Tân': 'Dậu',
  'Nhâm': 'Hợi', 'Quý': 'Tý',
};

// === Group 5: Thien Khoi & Thien Viet (by year Can) ===
const THIEN_KHOI: Record<string, string> = {
  'Giáp': 'Sửu', 'Ất': 'Tý', 'Bính': 'Hợi', 'Đinh': 'Hợi',
  'Mậu': 'Sửu', 'Kỷ': 'Tý', 'Canh': 'Ngọ', 'Tân': 'Ngọ',
  'Nhâm': 'Mão', 'Quý': 'Mão',
};

const THIEN_VIET: Record<string, string> = {
  'Giáp': 'Mùi', 'Ất': 'Thân', 'Bính': 'Dậu', 'Đinh': 'Dậu',
  'Mậu': 'Mùi', 'Kỷ': 'Thân', 'Canh': 'Dần', 'Tân': 'Dần',
  'Nhâm': 'Tị', 'Quý': 'Tị',
};

// === Group 6: Hoa Tinh & Linh Tinh (by year Chi group + hour) ===
function getChiGroup(yearChi: string): number {
  const groups: Record<string, number> = {
    'Dần': 0, 'Ngọ': 0, 'Tuất': 0,
    'Thân': 1, 'Tý': 1, 'Thìn': 1,
    'Tị': 2, 'Dậu': 2, 'Sửu': 2,
    'Hợi': 3, 'Mão': 3, 'Mùi': 3,
  };
  return groups[yearChi] ?? 0;
}

const HOA_TINH_START = [
  chiIndex('Sửu'), chiIndex('Dần'), chiIndex('Mão'), chiIndex('Dậu'),
];

const LINH_TINH_START = [
  chiIndex('Mão'), chiIndex('Tuất'), chiIndex('Tuất'), chiIndex('Tuất'),
];

// === Group 7: Stars by year Chi ===
export const THIEN_MA: Record<string, string> = {
  'Dần': 'Thân', 'Ngọ': 'Thân', 'Tuất': 'Thân',
  'Thân': 'Dần', 'Tý': 'Dần', 'Thìn': 'Dần',
  'Tị': 'Hợi', 'Dậu': 'Hợi', 'Sửu': 'Hợi',
  'Hợi': 'Tị', 'Mão': 'Tị', 'Mùi': 'Tị',
};

const DAO_HOA: Record<string, string> = {
  'Dần': 'Mão', 'Ngọ': 'Mão', 'Tuất': 'Mão',
  'Thân': 'Dậu', 'Tý': 'Dậu', 'Thìn': 'Dậu',
  'Tị': 'Ngọ', 'Dậu': 'Ngọ', 'Sửu': 'Ngọ',
  'Hợi': 'Tý', 'Mão': 'Tý', 'Mùi': 'Tý',
};

function getHongLoan(yearChi: string): string {
  const yearChiIdx = chiIndex(yearChi);
  return DIA_CHI[((chiIndex('Mão') - yearChiIdx) % 12 + 12) % 12];
}

// === NEW: Stars by year Chi ===
const CO_THAN: Record<string, string> = {
  'Dần': 'Dần', 'Mão': 'Dần', 'Thìn': 'Dần',
  'Tị': 'Tị', 'Ngọ': 'Tị', 'Mùi': 'Tị',
  'Thân': 'Thân', 'Dậu': 'Thân', 'Tuất': 'Thân',
  'Hợi': 'Hợi', 'Tý': 'Hợi', 'Sửu': 'Hợi',
};

const QUA_TU: Record<string, string> = {
  'Dần': 'Tuất', 'Mão': 'Tuất', 'Thìn': 'Tuất',
  'Tị': 'Sửu', 'Ngọ': 'Sửu', 'Mùi': 'Sửu',
  'Thân': 'Thìn', 'Dậu': 'Thìn', 'Tuất': 'Thìn',
  'Hợi': 'Mùi', 'Tý': 'Mùi', 'Sửu': 'Mùi',
};

const PHA_TOAI: Record<string, string> = {
  'Tý': 'Dậu', 'Sửu': 'Dậu', 'Dần': 'Tị', 'Mão': 'Tị',
  'Thìn': 'Sửu', 'Tị': 'Sửu', 'Ngọ': 'Dậu', 'Mùi': 'Dậu',
  'Thân': 'Tị', 'Dậu': 'Tị', 'Tuất': 'Sửu', 'Hợi': 'Sửu',
};

const THIEN_KHONG_CHI: Record<string, string> = {
  'Tý': 'Sửu', 'Sửu': 'Dần', 'Dần': 'Mão', 'Mão': 'Thìn',
  'Thìn': 'Tị', 'Tị': 'Ngọ', 'Ngọ': 'Mùi', 'Mùi': 'Thân',
  'Thân': 'Dậu', 'Dậu': 'Tuất', 'Tuất': 'Hợi', 'Hợi': 'Tý',
};

// === NEW: Stars by year Can ===
const THIEN_QUAN: Record<string, string> = {
  'Giáp': 'Mùi', 'Ất': 'Thìn', 'Bính': 'Tý', 'Đinh': 'Dậu',
  'Mậu': 'Ngọ', 'Kỷ': 'Mão', 'Canh': 'Hợi', 'Tân': 'Thân',
  'Nhâm': 'Tị', 'Quý': 'Dần',
};

const THIEN_PHUC: Record<string, string> = {
  'Giáp': 'Dậu', 'Ất': 'Thân', 'Bính': 'Tý', 'Đinh': 'Hợi',
  'Mậu': 'Mão', 'Kỷ': 'Dần', 'Canh': 'Ngọ', 'Tân': 'Tị',
  'Nhâm': 'Dậu', 'Quý': 'Thân',
};

const THIEN_TRU: Record<string, string> = {
  'Giáp': 'Tị', 'Ất': 'Ngọ', 'Bính': 'Tị', 'Đinh': 'Ngọ',
  'Mậu': 'Mùi', 'Kỷ': 'Thân', 'Canh': 'Mùi', 'Tân': 'Thân',
  'Nhâm': 'Dậu', 'Quý': 'Tuất',
};

const QUOC_AN: Record<string, string> = {
  'Giáp': 'Tuất', 'Ất': 'Hợi', 'Bính': 'Sửu', 'Đinh': 'Dần',
  'Mậu': 'Sửu', 'Kỷ': 'Dần', 'Canh': 'Thìn', 'Tân': 'Tị',
  'Nhâm': 'Thìn', 'Quý': 'Tị',
};

const DUONG_PHU: Record<string, string> = {
  'Giáp': 'Sửu', 'Ất': 'Dần', 'Bính': 'Thìn', 'Đinh': 'Tị',
  'Mậu': 'Thìn', 'Kỷ': 'Tị', 'Canh': 'Mùi', 'Tân': 'Thân',
  'Nhâm': 'Mùi', 'Quý': 'Thân',
};

// === NEW: Stars by lunar month ===
const THIEN_HINH_MONTH = [
  'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần',
  'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân',
];

const THIEN_RIEU_MONTH = [
  'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ',
  'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý',
];

/**
 * Place all auxiliary stars (~40 stars across 10+ groups).
 */
export function placeAuxStars(
  yearCan: string,
  yearChi: string,
  lunarMonth: number,
  lunarDay: number,
  hourIndex: number
): AuxStarPosition[] {
  const stars: AuxStarPosition[] = [];

  // Group 1: Loc Ton
  const locTonPos = LOC_TON[yearCan];
  stars.push({ star: 'Lộc Tồn', position: locTonPos, group: 'Lộc Tồn' });

  // Group 2: Kinh Duong & Da La (relative to Loc Ton)
  const locTonIdx = chiIndex(locTonPos);
  stars.push({ star: 'Kình Dương', position: offsetChi(locTonIdx, 1), group: 'Tứ Sát' });
  stars.push({ star: 'Đà La', position: offsetChi(locTonIdx, -1), group: 'Tứ Sát' });

  // Group 3: Ta Phu & Huu Bat (by lunar month)
  stars.push({ star: 'Tả Phụ', position: offsetChi(chiIndex('Thìn'), lunarMonth - 1), group: 'Lục Cát' });
  stars.push({ star: 'Hữu Bật', position: offsetChi(chiIndex('Tuất'), -(lunarMonth - 1)), group: 'Lục Cát' });

  // Group 4: Van Xuong & Van Khuc (by hour)
  const vanXuongPos = offsetChi(chiIndex('Tuất'), -hourIndex);
  const vanKhucPos = offsetChi(chiIndex('Thìn'), hourIndex);
  stars.push({ star: 'Văn Xương', position: vanXuongPos, group: 'Lục Cát' });
  stars.push({ star: 'Văn Khúc', position: vanKhucPos, group: 'Lục Cát' });

  // Group 5: Thien Khoi & Thien Viet
  stars.push({ star: 'Thiên Khôi', position: THIEN_KHOI[yearCan], group: 'Lục Cát' });
  stars.push({ star: 'Thiên Việt', position: THIEN_VIET[yearCan], group: 'Lục Cát' });

  // Group 6: Hoa Tinh & Linh Tinh
  const group = getChiGroup(yearChi);
  stars.push({ star: 'Hỏa Tinh', position: offsetChi(HOA_TINH_START[group], hourIndex), group: 'Tứ Sát' });
  stars.push({ star: 'Linh Tinh', position: offsetChi(LINH_TINH_START[group], hourIndex), group: 'Tứ Sát' });

  // Group 7: Stars by year Chi (existing)
  stars.push({ star: 'Thiên Mã', position: THIEN_MA[yearChi], group: 'Phụ tinh' });
  stars.push({ star: 'Đào Hoa', position: DAO_HOA[yearChi], group: 'Phụ tinh' });

  const hongLoanPos = getHongLoan(yearChi);
  stars.push({ star: 'Hồng Loan', position: hongLoanPos, group: 'Phụ tinh' });
  stars.push({ star: 'Thiên Hỉ', position: offsetChi(chiIndex(hongLoanPos), 6), group: 'Phụ tinh' });

  // Group 8: Dia Khong & Dia Kiep (by hour)
  stars.push({ star: 'Địa Không', position: offsetChi(chiIndex('Hợi'), -hourIndex), group: 'Sát tinh' });
  stars.push({ star: 'Địa Kiếp', position: offsetChi(chiIndex('Hợi'), hourIndex), group: 'Sát tinh' });

  // === NEW STARS ===

  // By year Chi
  stars.push({ star: 'Cô Thần', position: CO_THAN[yearChi], group: 'Phụ tinh' });
  stars.push({ star: 'Quả Tú', position: QUA_TU[yearChi], group: 'Phụ tinh' });
  stars.push({ star: 'Phá Toái', position: PHA_TOAI[yearChi], group: 'Sát tinh' });
  stars.push({ star: 'Thiên Không', position: THIEN_KHONG_CHI[yearChi], group: 'Sát tinh' });
  const yearChiIdx = chiIndex(yearChi);
  stars.push({ star: 'Đại Hao', position: yearChi, group: 'Sát tinh' });
  stars.push({ star: 'Tiểu Hao', position: offsetChi(yearChiIdx, 1), group: 'Sát tinh' });

  // By year Can
  stars.push({ star: 'Thiên Quan', position: THIEN_QUAN[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Thiên Phúc', position: THIEN_PHUC[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Thiên Trù', position: THIEN_TRU[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Quốc Ấn', position: QUOC_AN[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Đường Phù', position: DUONG_PHU[yearCan], group: 'Phụ tinh' });

  // By lunar month
  stars.push({ star: 'Thiên Hình', position: THIEN_HINH_MONTH[lunarMonth - 1], group: 'Sát tinh' });
  stars.push({ star: 'Thiên Riêu', position: THIEN_RIEU_MONTH[lunarMonth - 1], group: 'Phụ tinh' });

  // By lunar day
  stars.push({ star: 'Tam Thai', position: DIA_CHI[(lunarDay - 1) % 12], group: 'Phụ tinh' });
  stars.push({ star: 'Bát Tọa', position: DIA_CHI[(12 - (lunarDay - 1) % 12) % 12], group: 'Phụ tinh' });

  // Fixed positions
  stars.push({ star: 'Thiên La', position: 'Thìn', group: 'Sát tinh' });
  stars.push({ star: 'Địa Võng', position: 'Tuất', group: 'Sát tinh' });

  // Derived (opposite of Văn Xương / Văn Khúc)
  stars.push({ star: 'Thiên Thương', position: offsetChi(chiIndex(vanXuongPos), 6), group: 'Sát tinh' });
  stars.push({ star: 'Thiên Sứ', position: offsetChi(chiIndex(vanKhucPos), 6), group: 'Sát tinh' });

  return stars;
}
