export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  yearCan: string;
  yearChi: string;
  monthCan: string;
  monthChi: string;
  napAm: string;
}

export interface BirthInfo {
  name?: string;
  solarDate: { year: number; month: number; day: number };
  hour: number; // 0-11: Ty=0, Suu=1, Dan=2, ..., Hoi=11
  unknownHour?: boolean; // true when user doesn't know birth hour
  gender: 'male' | 'female';
  birthplace?: { name: string; lat: number; lng: number };
}

export interface CanChi {
  can: string;
  chi: string;
}

export interface FourPillars {
  year: CanChi;
  month: CanChi;
  day: CanChi;
  hour: CanChi;
}

export type StarType = 'chinh' | 'phu' | 'cat' | 'sat' | 'hoa';
export type BrightnessLevel = 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm' | '';
export type TransformType = 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ';

export interface Star {
  name: string;
  type: StarType;
  brightness?: BrightnessLevel;
  transform?: TransformType;
  group?: string;
}

export interface Palace {
  name: string;
  position: string; // Dia Chi (Ty, Suu, Dan, ...)
  stars: Star[];
  majorPeriod?: { startAge: number; endAge: number; can: string; chi: string };
}

export interface TuanTriet {
  tuan: [string, string];   // 2 cung bị Tuần Không
  triet: [string, string];  // 2 cung bị Triệt Lộ
}

export interface TuViChart {
  birthInfo: BirthInfo;
  lunarDate: LunarDate;
  fourPillars: FourPillars;
  menh: string;       // Dia Chi of Menh cung
  than: string;       // Dia Chi of Than cung
  cuc: { name: string; value: number };
  palaces: Palace[];
  menhPalaceName: string;  // Which palace Menh falls in
  thanPalaceName: string;  // Which palace Than falls in
  tuanTriet: TuanTriet;
}

export const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;

export const DIA_CHI_HOURS = [
  { name: 'Tý', time: '23:00 - 01:00' },
  { name: 'Sửu', time: '01:00 - 03:00' },
  { name: 'Dần', time: '03:00 - 05:00' },
  { name: 'Mão', time: '05:00 - 07:00' },
  { name: 'Thìn', time: '07:00 - 09:00' },
  { name: 'Tị', time: '09:00 - 11:00' },
  { name: 'Ngọ', time: '11:00 - 13:00' },
  { name: 'Mùi', time: '13:00 - 15:00' },
  { name: 'Thân', time: '15:00 - 17:00' },
  { name: 'Dậu', time: '17:00 - 19:00' },
  { name: 'Tuất', time: '19:00 - 21:00' },
  { name: 'Hợi', time: '21:00 - 23:00' },
] as const;

export const PALACE_NAMES = [
  'Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách',
  'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu',
] as const;

// ── Calendar / Good Day Picker types ──

export interface TrucInfo {
  name: string;
  meaning: string;
  rating: 1 | 2 | 3; // 1=xấu, 2=bình, 3=tốt
  goodFor: string[];
  badFor: string[];
}

export interface Sao28Info {
  name: string;
  element: string;
  rating: 1 | 2 | 3;
  goodFor: string[];
  badFor: string[];
}

export interface HourInfo {
  chi: string;
  timeRange: string;
  starName: string;
  isHoangDao: boolean;
}

export interface SpecialDay {
  name: string;
  type: 'good' | 'bad';
  description: string;
}

export interface DailyInfo {
  solar: { year: number; month: number; day: number; dayOfWeek: number };
  lunar: LunarDate;
  canChiDay: CanChi;
  canChiMonth: CanChi;
  canChiYear: CanChi;
  napAmDay: string;
  truc: TrucInfo;
  sao28: Sao28Info;
  hoangDaoHours: HourInfo[];
  goodStars: string[];
  badStars: string[];
  specialDays: SpecialDay[];
  overallRating: 1 | 2 | 3 | 4 | 5;
  goodFor: string[];
  badFor: string[];
}

export type Purpose =
  | 'cuoi_hoi'
  | 'khai_truong'
  | 'dong_tho'
  | 'nhap_trach'
  | 'xuat_hanh'
  | 'ky_ket'
  | 'khai_nghiep'
  | 'mua_xe'
  | 'mua_nha'
  | 'nhap_hoc'
  | 'chuyen_viec'
  | 'kham_benh'
  | 'tang_le'
  | 'cau_phuc';

export interface PurposeFilter {
  label: string;
  requiredTruc: string[];
  forbiddenTruc: string[];
  requiredGoodStars: string[];
  forbiddenBadStars: string[];
  forbiddenSpecial: string[];
  preferHoangDao: boolean;
}

export interface GoodDayResult {
  date: { year: number; month: number; day: number };
  lunar: LunarDate;
  canChiDay: CanChi;
  truc: TrucInfo;
  sao28: Sao28Info;
  score: number;
  rating: 1 | 2 | 3 | 4 | 5;
  goodStars: string[];
  badStars: string[];
  hoangDaoHours: HourInfo[];
  goodFor: string[];
  badFor: string[];
  bestHours: string[];
}

export interface PersonalizedDayInfo {
  chiClash: boolean;
  chiClashNote: string;
  chiHarmony: boolean;
  chiHarmonyNote: string;
  personalScore: number;
  personalAdvice: string;
}
