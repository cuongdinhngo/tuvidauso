import { DIA_CHI, THIEN_CAN } from '../types';

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

// === Cô Thần / Quả Tú (by year Chi) ===
// Cô Thần = tứ Sinh (Dần/Tị/Thân/Hợi) ngay SAU tam hợp mùa của tuổi;
// Quả Tú = tứ Mộ (Thìn/Tuất/Sửu/Mùi) ngay TRƯỚC. Bộ "Cô Quả".
// Hợi-Tý-Sửu → Cô Dần / Quả Tuất; Dần-Mão-Thìn → Cô Tị / Quả Sửu;
// Tị-Ngọ-Mùi → Cô Thân / Quả Thìn; Thân-Dậu-Tuất → Cô Hợi / Quả Mùi.
// Nguồn: tuvi.cohoc.net, tracuutuvi.com; TVĐS Tân Biên.
const CO_THAN: Record<string, string> = {
  'Dần': 'Tị', 'Mão': 'Tị', 'Thìn': 'Tị',
  'Tị': 'Thân', 'Ngọ': 'Thân', 'Mùi': 'Thân',
  'Thân': 'Hợi', 'Dậu': 'Hợi', 'Tuất': 'Hợi',
  'Hợi': 'Dần', 'Tý': 'Dần', 'Sửu': 'Dần',
};

const QUA_TU: Record<string, string> = {
  'Dần': 'Sửu', 'Mão': 'Sửu', 'Thìn': 'Sửu',
  'Tị': 'Thìn', 'Ngọ': 'Thìn', 'Mùi': 'Thìn',
  'Thân': 'Mùi', 'Dậu': 'Mùi', 'Tuất': 'Mùi',
  'Hợi': 'Tuất', 'Tý': 'Tuất', 'Sửu': 'Tuất',
};

// Phá Toái — Tý/Ngọ/Mão/Dậu → Tị; Dần/Thân/Tị/Hợi → Dậu; Thìn/Tuất/Sửu/Mùi → Sửu.
// Nguồn: tuvi.cohoc.net, tracuulasotuvi.com.
const PHA_TOAI: Record<string, string> = {
  'Tý': 'Tị', 'Ngọ': 'Tị', 'Mão': 'Tị', 'Dậu': 'Tị',
  'Dần': 'Dậu', 'Thân': 'Dậu', 'Tị': 'Dậu', 'Hợi': 'Dậu',
  'Thìn': 'Sửu', 'Tuất': 'Sửu', 'Sửu': 'Sửu', 'Mùi': 'Sửu',
};

// Thiên Không — đồng cung Thiếu Dương = năm Chi + 1 (sau Thái Tuế). verified ✓ tracuutuvi.com.
const THIEN_KHONG_CHI: Record<string, string> = {
  'Tý': 'Sửu', 'Sửu': 'Dần', 'Dần': 'Mão', 'Mão': 'Thìn',
  'Thìn': 'Tị', 'Tị': 'Ngọ', 'Ngọ': 'Mùi', 'Mùi': 'Thân',
  'Thân': 'Dậu', 'Dậu': 'Tuất', 'Tuất': 'Hợi', 'Hợi': 'Tý',
};

// === NEW: Stars by year Can ===
// Thiên Quan Quý Nhân (by year Can). Nguồn: tracuutuvi.com, tuvi.cohoc.net.
const THIEN_QUAN: Record<string, string> = {
  'Giáp': 'Mùi', 'Ất': 'Mùi', 'Bính': 'Thìn', 'Đinh': 'Dần',
  'Mậu': 'Mão', 'Kỷ': 'Dậu', 'Canh': 'Hợi', 'Tân': 'Dậu',
  'Nhâm': 'Tuất', 'Quý': 'Ngọ',
};

// Thiên Phúc Quý Nhân (by year Can). Nguồn: tracuutuvi.com, tracuulasotuvi.com.
// Lưu ý: can Bính theo trường phái (Tý vs Thân); giữ Tý — nguồn chưa thống nhất.
const THIEN_PHUC: Record<string, string> = {
  'Giáp': 'Dậu', 'Ất': 'Thân', 'Bính': 'Tý', 'Đinh': 'Hợi',
  'Mậu': 'Mão', 'Kỷ': 'Dần', 'Canh': 'Ngọ', 'Tân': 'Tị',
  'Nhâm': 'Ngọ', 'Quý': 'Thân',
};

// Thiên Trù (by year Can). Nguồn: tracuutuvi.com, tracuulasotuvi.com.
const THIEN_TRU: Record<string, string> = {
  'Giáp': 'Tị', 'Ất': 'Ngọ', 'Bính': 'Tý', 'Đinh': 'Tị',
  'Mậu': 'Ngọ', 'Kỷ': 'Thân', 'Canh': 'Dần', 'Tân': 'Ngọ',
  'Nhâm': 'Dậu', 'Quý': 'Tuất',
};

// Quốc Ấn (by year Can). Nguồn: tracuutuvi.com, tuvi.cohoc.net.
const QUOC_AN: Record<string, string> = {
  'Giáp': 'Tuất', 'Ất': 'Hợi', 'Bính': 'Sửu', 'Đinh': 'Dần',
  'Mậu': 'Sửu', 'Kỷ': 'Dần', 'Canh': 'Thìn', 'Tân': 'Tị',
  'Nhâm': 'Mùi', 'Quý': 'Thân',
};

// Đường Phù (by year Can) = Quốc Ấn − 3 (cặp bộ). Nguồn: tracuutuvi.com, tracuulasotuvi.com.
const DUONG_PHU: Record<string, string> = {
  'Giáp': 'Mùi', 'Ất': 'Thân', 'Bính': 'Tuất', 'Đinh': 'Hợi',
  'Mậu': 'Tuất', 'Kỷ': 'Hợi', 'Canh': 'Sửu', 'Tân': 'Dần',
  'Nhâm': 'Thìn', 'Quý': 'Tị',
};

// === Stars by lunar month ===
// Thiên Hình — khởi Dậu tháng 1, đếm thuận theo tháng. verified ✓ tracuutuvi.com.
const THIEN_HINH_MONTH = [
  'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần',
  'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân',
];

// Thiên Riêu — khởi Sửu tháng 1, đếm thuận theo tháng. verified ✓ tracuutuvi.com.
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
  hourIndex: number,
  gender: 'male' | 'female',
  menhCung: string
): AuxStarPosition[] {
  const stars: AuxStarPosition[] = [];

  // Dương Nam / Âm Nữ predicate (year-Can parity × gender) — drives Hỏa/Linh & Song Hao direction.
  // Dương Can = Giáp/Bính/Mậu/Canh/Nhâm (index chẵn). Same split as Đại Hạn direction.
  const yangYear = THIEN_CAN.indexOf(yearCan as typeof THIEN_CAN[number]) % 2 === 0;
  const dnan = (yangYear && gender === 'male') || (!yangYear && gender === 'female');

  // Group 1: Loc Ton
  const locTonPos = LOC_TON[yearCan];
  stars.push({ star: 'Lộc Tồn', position: locTonPos, group: 'Lộc Tồn' });

  // Group 2: Kinh Duong & Da La (relative to Loc Ton)
  const locTonIdx = chiIndex(locTonPos);
  stars.push({ star: 'Kình Dương', position: offsetChi(locTonIdx, 1), group: 'Tứ Sát' });
  stars.push({ star: 'Đà La', position: offsetChi(locTonIdx, -1), group: 'Tứ Sát' });

  // Group 3: Ta Phu & Huu Bat (by lunar month)
  const taPhuPos = offsetChi(chiIndex('Thìn'), lunarMonth - 1);
  const huuBatPos = offsetChi(chiIndex('Tuất'), -(lunarMonth - 1));
  stars.push({ star: 'Tả Phụ', position: taPhuPos, group: 'Lục Cát' });
  stars.push({ star: 'Hữu Bật', position: huuBatPos, group: 'Lục Cát' });

  // Group 4: Van Xuong & Van Khuc (by hour)
  const vanXuongPos = offsetChi(chiIndex('Tuất'), -hourIndex);
  const vanKhucPos = offsetChi(chiIndex('Thìn'), hourIndex);
  stars.push({ star: 'Văn Xương', position: vanXuongPos, group: 'Lục Cát' });
  stars.push({ star: 'Văn Khúc', position: vanKhucPos, group: 'Lục Cát' });

  // Group 5: Thien Khoi & Thien Viet
  stars.push({ star: 'Thiên Khôi', position: THIEN_KHOI[yearCan], group: 'Lục Cát' });
  stars.push({ star: 'Thiên Việt', position: THIEN_VIET[yearCan], group: 'Lục Cát' });

  // Group 6: Hoa Tinh & Linh Tinh — start by year-Chi group; direction by Dương Nam/Âm Nữ.
  // Dương Nam/Âm Nữ: Hỏa thuận, Linh nghịch; Âm Nam/Dương Nữ: ngược lại (Hỏa & Linh luôn trái chiều).
  // Nguồn: tracuutuvi.com, hoctuvi (trường phái Thái Thứ Lang).
  const group = getChiGroup(yearChi);
  const hoaDir = dnan ? 1 : -1;
  const linhDir = dnan ? -1 : 1;
  stars.push({ star: 'Hỏa Tinh', position: offsetChi(HOA_TINH_START[group], hoaDir * hourIndex), group: 'Tứ Sát' });
  stars.push({ star: 'Linh Tinh', position: offsetChi(LINH_TINH_START[group], linhDir * hourIndex), group: 'Tứ Sát' });

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
  // Đại Hao / Tiểu Hao — vòng Bác Sĩ, neo theo Lộc Tồn; chiều theo Dương Nam/Âm Nữ.
  // Tiểu Hao = Lộc Tồn + 3·d (bước 3), Đại Hao = Lộc Tồn + 9·d (bước 9); luôn đối cung (bộ Song Hao).
  // Nguồn: tuvi.cohoc.net (vòng Lộc Tồn), tracuutuvi.com.
  const haoDir = dnan ? 1 : -1;
  stars.push({ star: 'Đại Hao', position: offsetChi(locTonIdx, 9 * haoDir), group: 'Sát tinh' });
  stars.push({ star: 'Tiểu Hao', position: offsetChi(locTonIdx, 3 * haoDir), group: 'Sát tinh' });

  // By year Can
  stars.push({ star: 'Thiên Quan', position: THIEN_QUAN[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Thiên Phúc', position: THIEN_PHUC[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Thiên Trù', position: THIEN_TRU[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Quốc Ấn', position: QUOC_AN[yearCan], group: 'Phụ tinh' });
  stars.push({ star: 'Đường Phù', position: DUONG_PHU[yearCan], group: 'Phụ tinh' });

  // By lunar month
  stars.push({ star: 'Thiên Hình', position: THIEN_HINH_MONTH[lunarMonth - 1], group: 'Sát tinh' });
  stars.push({ star: 'Thiên Riêu', position: THIEN_RIEU_MONTH[lunarMonth - 1], group: 'Phụ tinh' });

  // By lunar day — Tam Thai từ Tả Phụ đếm thuận (ngày−1); Bát Tọa từ Hữu Bật đếm nghịch (ngày−1).
  // Nguồn: tracuutuvi.com, tuvi.cohoc.net, tracuulasotuvi.com.
  stars.push({ star: 'Tam Thai', position: offsetChi(chiIndex(taPhuPos), lunarDay - 1), group: 'Phụ tinh' });
  stars.push({ star: 'Bát Tọa', position: offsetChi(chiIndex(huuBatPos), -(lunarDay - 1)), group: 'Phụ tinh' });

  // Fixed positions — Thiên La luôn Thìn, Địa Võng luôn Tuất. verified ✓ tuvi.cohoc.net.
  stars.push({ star: 'Thiên La', position: 'Thìn', group: 'Sát tinh' });
  stars.push({ star: 'Địa Võng', position: 'Tuất', group: 'Sát tinh' });

  // Thiên Thương luôn ở cung Nô Bộc (Mệnh−7), Thiên Sứ luôn ở cung Tật Ách (Mệnh−5);
  // hai sao giáp cung Thiên Di (Mệnh−6). Nguồn: hocvienlyso.org, tracuutuvi.com.
  const menhIdx = chiIndex(menhCung);
  stars.push({ star: 'Thiên Thương', position: offsetChi(menhIdx, -7), group: 'Sát tinh' });
  stars.push({ star: 'Thiên Sứ', position: offsetChi(menhIdx, -5), group: 'Sát tinh' });

  return stars;
}
