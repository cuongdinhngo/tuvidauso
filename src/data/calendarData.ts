import type { TrucInfo, Sao28Info, PurposeFilter, Purpose } from '../core/types';

// ── 12 Trực (Kiến Trừ) ──

export const TRUC_DATA: TrucInfo[] = [
  {
    name: 'Kiến', meaning: 'Khởi đầu, xây dựng', rating: 2,
    goodFor: ['Khởi công', 'Động thổ', 'Trồng cây'],
    badFor: ['Kiện tụng', 'Khai trương'],
  },
  {
    name: 'Trừ', meaning: 'Loại bỏ, thanh tẩy', rating: 2,
    goodFor: ['Dọn dẹp', 'Chữa bệnh', 'Trừ tà', 'Phá dỡ'],
    badFor: ['Cưới hỏi', 'Khai trương', 'Ký kết'],
  },
  {
    name: 'Mãn', meaning: 'Đầy đủ, viên mãn', rating: 3,
    goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Ký kết', 'Tiệc mừng'],
    badFor: ['Phá dỡ', 'Kiện tụng'],
  },
  {
    name: 'Bình', meaning: 'Bình yên, ổn định', rating: 2,
    goodFor: ['Đi xa', 'Thăm bệnh', 'Tu sửa nhà'],
    badFor: ['Động thổ lớn', 'Kiện tụng'],
  },
  {
    name: 'Định', meaning: 'Ổn định, an định', rating: 3,
    goodFor: ['Cưới hỏi', 'Ký kết', 'Nhập trạch', 'Khai trương', 'Đàm phán'],
    badFor: ['Đi xa', 'Kiện tụng'],
  },
  {
    name: 'Chấp', meaning: 'Nắm giữ, chấp hành', rating: 2,
    goodFor: ['Xây dựng', 'Trồng trọt', 'Thu hoạch'],
    badFor: ['Di chuyển', 'Khai trương'],
  },
  {
    name: 'Phá', meaning: 'Phá vỡ, hư hại', rating: 1,
    goodFor: ['Phá dỡ', 'Dọn dẹp', 'Điều trị bệnh'],
    badFor: ['Cưới hỏi', 'Khai trương', 'Khởi công', 'Ký kết', 'Nhập trạch'],
  },
  {
    name: 'Nguy', meaning: 'Nguy hiểm, cẩn trọng', rating: 1,
    goodFor: ['Cúng bái', 'Cầu phúc'],
    badFor: ['Đi xa', 'Leo cao', 'Khởi công', 'Khai trương', 'Cưới hỏi'],
  },
  {
    name: 'Thành', meaning: 'Thành công, hoàn thành', rating: 3,
    goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Ký kết', 'Khởi công', 'Xuất hành'],
    badFor: ['Kiện tụng'],
  },
  {
    name: 'Thu', meaning: 'Thu hoạch, gom góp', rating: 2,
    goodFor: ['Thu tiền', 'Thu hoạch', 'Nhập kho'],
    badFor: ['Khai trương', 'Xuất hành xa'],
  },
  {
    name: 'Khai', meaning: 'Mở ra, khai phóng', rating: 3,
    goodFor: ['Khai trương', 'Khởi công', 'Nhập học', 'Ký kết', 'Xuất hành', 'Cưới hỏi'],
    badFor: ['Chôn cất'],
  },
  {
    name: 'Bế', meaning: 'Đóng lại, bế tắc', rating: 1,
    goodFor: ['Chôn cất', 'Tu sửa nhỏ'],
    badFor: ['Cưới hỏi', 'Khai trương', 'Khởi công', 'Ký kết', 'Xuất hành', 'Nhập trạch'],
  },
];

// ── 28 Sao (Nhị Thập Bát Tú) ──
// Cycle: (JDN + offset) % 28
// Offset calibrated: JDN of 01/01/2000 (2451545) → Sao Hư (index 10)
// 2451545 % 28 = 5, so offset = (10 - 5 + 28) % 28 = 5

export const SAO28_JDN_OFFSET = 5;

export const SAO28_DATA: Sao28Info[] = [
  { name: 'Giác', element: 'Mộc', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Khởi công'], badFor: [] },
  { name: 'Cang', element: 'Kim', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Chôn cất', 'Khai trương'] },
  { name: 'Đê', element: 'Thổ', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Xuất hành'] },
  { name: 'Phòng', element: 'Nhật', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Động thổ'], badFor: [] },
  { name: 'Tâm', element: 'Nguyệt', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Xuất hành', 'Khai trương'] },
  { name: 'Vĩ', element: 'Hỏa', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch'], badFor: [] },
  { name: 'Cơ', element: 'Thủy', rating: 3, goodFor: ['Cúng bái', 'Cầu phúc', 'Nhập trạch'], badFor: ['Chôn cất'] },
  { name: 'Đẩu', element: 'Mộc', rating: 3, goodFor: ['Khai trương', 'Động thổ', 'Xây dựng'], badFor: [] },
  { name: 'Ngưu', element: 'Kim', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Xuất hành'] },
  { name: 'Nữ', element: 'Thổ', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch'] },
  { name: 'Hư', element: 'Nhật', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Khởi công'] },
  { name: 'Nguy', element: 'Nguyệt', rating: 1, goodFor: ['Cúng bái'], badFor: ['Cưới hỏi', 'Xuất hành'] },
  { name: 'Thất', element: 'Hỏa', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Động thổ'], badFor: [] },
  { name: 'Bích', element: 'Thủy', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Ký kết'], badFor: [] },
  { name: 'Khuê', element: 'Mộc', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Động thổ'] },
  { name: 'Lâu', element: 'Kim', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Động thổ'], badFor: [] },
  { name: 'Vị', element: 'Thổ', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Ký kết'], badFor: [] },
  { name: 'Mão', element: 'Nhật', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Khởi công'] },
  { name: 'Tất', element: 'Nguyệt', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Động thổ'], badFor: [] },
  { name: 'Chủy', element: 'Hỏa', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Xuất hành'] },
  { name: 'Sâm', element: 'Thủy', rating: 3, goodFor: ['Khai trương', 'Nhập trạch', 'Xuất hành'], badFor: [] },
  { name: 'Tỉnh', element: 'Mộc', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Động thổ', 'Nhập trạch'], badFor: [] },
  { name: 'Quỷ', element: 'Kim', rating: 1, goodFor: ['Cúng bái'], badFor: ['Cưới hỏi', 'Khai trương', 'Xuất hành'] },
  { name: 'Liễu', element: 'Thổ', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch'] },
  { name: 'Tinh', element: 'Nhật', rating: 3, goodFor: ['Khai trương', 'Nhập trạch', 'Ký kết'], badFor: [] },
  { name: 'Trương', element: 'Nguyệt', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch'], badFor: [] },
  { name: 'Dực', element: 'Hỏa', rating: 1, goodFor: [], badFor: ['Cưới hỏi', 'Khai trương', 'Xuất hành'] },
  { name: 'Chẩn', element: 'Thủy', rating: 3, goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Ký kết'], badFor: [] },
];

// ── Giờ Hoàng Đạo ──

export const HOUR_STARS = [
  'Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước',
  'Kim Đường', 'Thiên Đức', 'Bạch Hổ', 'Ngọc Đường',
  'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận',
] as const;

export const HOANG_DAO_STARS = new Set([
  'Thanh Long', 'Minh Đường', 'Kim Đường', 'Thiên Đức', 'Ngọc Đường', 'Tư Mệnh',
]);

// Thanh Long starts at which hour (Dia Chi index) based on day Chi
export const THANH_LONG_START: Record<string, number> = {
  'Tý': 0, 'Ngọ': 0,
  'Sửu': 2, 'Mùi': 2,
  'Dần': 4, 'Thân': 4,
  'Mão': 6, 'Dậu': 6,
  'Thìn': 8, 'Tuất': 8,
  'Tị': 10, 'Hợi': 10,
};

// ── Ngày đặc biệt lookup tables ──

// Sát Chủ: lunar month → day Chi that is Sát Chủ
export const SAT_CHU: Record<number, string> = {
  1: 'Dần', 2: 'Tý', 3: 'Thân', 4: 'Ngọ',
  5: 'Thìn', 6: 'Dần', 7: 'Tý', 8: 'Thân',
  9: 'Ngọ', 10: 'Thìn', 11: 'Dần', 12: 'Tý',
};

// Thọ Tử: lunar month → day Chi that is Thọ Tử
export const THO_TU: Record<number, string> = {
  1: 'Tuất', 2: 'Thìn', 3: 'Hợi', 4: 'Tị',
  5: 'Tý', 6: 'Ngọ', 7: 'Sửu', 8: 'Mùi',
  9: 'Dần', 10: 'Thân', 11: 'Mão', 12: 'Dậu',
};

// Thiên Đức: lunar month → day Can or Chi that has Thiên Đức
export const THIEN_DUC: Record<number, string> = {
  1: 'Đinh', 2: 'Thân', 3: 'Nhâm', 4: 'Tân',
  5: 'Hợi', 6: 'Giáp', 7: 'Quý', 8: 'Dần',
  9: 'Bính', 10: 'Ất', 11: 'Tị', 12: 'Canh',
};

// Nguyệt Đức: lunar month → day Can that has Nguyệt Đức
export const NGUYET_DUC: Record<number, string> = {
  1: 'Bính', 2: 'Giáp', 3: 'Nhâm', 4: 'Canh',
  5: 'Bính', 6: 'Giáp', 7: 'Nhâm', 8: 'Canh',
  9: 'Bính', 10: 'Giáp', 11: 'Nhâm', 12: 'Canh',
};

// ── Purpose Filters ──

export const PURPOSE_FILTERS: Record<Purpose, PurposeFilter> = {
  cuoi_hoi: {
    label: 'Cưới hỏi',
    requiredTruc: ['Thành', 'Khai', 'Định', 'Mãn'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: ['Thiên Đức', 'Nguyệt Đức', 'Thiên Hỉ'],
    forbiddenBadStars: ['Tam Nương', 'Sát Chủ', 'Nguyệt Kỵ'],
    forbiddenSpecial: ['Ngày Tam Nương', 'Ngày Sát Chủ'],
    preferHoangDao: true,
  },
  khai_truong: {
    label: 'Khai trương',
    requiredTruc: ['Khai', 'Thành', 'Mãn', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế', 'Trừ'],
    requiredGoodStars: ['Thiên Đức', 'Nguyệt Đức'],
    forbiddenBadStars: ['Tam Nương', 'Sát Chủ'],
    forbiddenSpecial: ['Ngày Tam Nương'],
    preferHoangDao: true,
  },
  dong_tho: {
    label: 'Động thổ',
    requiredTruc: ['Kiến', 'Thành', 'Khai', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương', 'Thọ Tử', 'Sát Chủ'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
  nhap_trach: {
    label: 'Nhập trạch',
    requiredTruc: ['Thành', 'Khai', 'Mãn', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế', 'Trừ'],
    requiredGoodStars: ['Thiên Đức', 'Nguyệt Đức'],
    forbiddenBadStars: ['Tam Nương', 'Nguyệt Kỵ'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
  xuat_hanh: {
    label: 'Xuất hành',
    requiredTruc: ['Thành', 'Khai', 'Bình', 'Mãn'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương', 'Sát Chủ'],
    forbiddenSpecial: [],
    preferHoangDao: false,
  },
  ky_ket: {
    label: 'Ký hợp đồng',
    requiredTruc: ['Thành', 'Khai', 'Định', 'Mãn'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
  khai_nghiep: {
    label: 'Khởi nghiệp',
    requiredTruc: ['Khai', 'Thành', 'Mãn', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương', 'Sát Chủ'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
  mua_xe: {
    label: 'Mua xe',
    requiredTruc: ['Thành', 'Khai', 'Mãn', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
  mua_nha: {
    label: 'Mua nhà',
    requiredTruc: ['Thành', 'Khai', 'Mãn', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: ['Thiên Đức', 'Nguyệt Đức'],
    forbiddenBadStars: ['Tam Nương', 'Nguyệt Kỵ'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
  nhap_hoc: {
    label: 'Nhập học',
    requiredTruc: ['Khai', 'Thành', 'Mãn', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương'],
    forbiddenSpecial: [],
    preferHoangDao: false,
  },
  chuyen_viec: {
    label: 'Chuyển việc',
    requiredTruc: ['Khai', 'Thành', 'Định'],
    forbiddenTruc: ['Phá', 'Nguy', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương', 'Sát Chủ'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
  kham_benh: {
    label: 'Khám bệnh',
    requiredTruc: ['Trừ', 'Khai', 'Thành', 'Bình'],
    forbiddenTruc: ['Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: [],
    forbiddenSpecial: [],
    preferHoangDao: false,
  },
  tang_le: {
    label: 'Tang lễ',
    requiredTruc: ['Bế', 'Thu', 'Trừ'],
    forbiddenTruc: ['Khai', 'Thành'],
    requiredGoodStars: [],
    forbiddenBadStars: [],
    forbiddenSpecial: [],
    preferHoangDao: false,
  },
  cau_phuc: {
    label: 'Cầu phúc',
    requiredTruc: ['Thành', 'Khai', 'Mãn', 'Định'],
    forbiddenTruc: ['Phá', 'Bế'],
    requiredGoodStars: [],
    forbiddenBadStars: ['Tam Nương'],
    forbiddenSpecial: [],
    preferHoangDao: true,
  },
};

// ── Purpose display info ──

export const PURPOSE_ICONS: Record<Purpose, string> = {
  cuoi_hoi: '💒',
  khai_truong: '🏪',
  dong_tho: '🏗️',
  nhap_trach: '🏠',
  xuat_hanh: '✈️',
  ky_ket: '📝',
  khai_nghiep: '🚀',
  mua_xe: '🚗',
  mua_nha: '🏡',
  nhap_hoc: '📚',
  chuyen_viec: '💼',
  kham_benh: '🏥',
  tang_le: '🕯️',
  cau_phuc: '🙏',
};
