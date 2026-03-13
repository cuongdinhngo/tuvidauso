// 12 cung Hoàng Đạo
export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

// 4 nguyên tố
export type Element = 'fire' | 'earth' | 'air' | 'water';

// 3 phẩm chất
export type Modality = 'cardinal' | 'fixed' | 'mutable';

// Hành tinh cai quản
export type RulingPlanet = 'mars' | 'venus' | 'mercury' | 'moon' | 'sun'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

export interface ZodiacSignInfo {
  id: ZodiacSign;
  name: string;           // "Bạch Dương"
  nameEn: string;         // "Aries"
  symbol: string;         // "♈"
  dateRange: string;      // "21/03 - 19/04"
  element: Element;
  modality: Modality;
  rulingPlanet: RulingPlanet;
  polarity: 'positive' | 'negative';  // Dương / Âm
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDay: string;
  bodyPart: string;       // Bộ phận cơ thể liên quan

  // Nội dung
  personality: string;
  strengths: string[];
  weaknesses: string[];
  career: string;
  love: string;
  health: string;
  celebrities: string[];

  // Tương hợp
  bestMatch: ZodiacSign[];
  goodMatch: ZodiacSign[];
  challengeMatch: ZodiacSign[];
}

// Kết quả tính toán
export interface SunSignResult {
  sign: ZodiacSignInfo;
  degree: number;          // Vị trí chính xác (0-29.99 độ trong cung)
  decan: 1 | 2 | 3;       // Decan (mỗi cung chia 3 phần, mỗi phần 10°)
  decanRuler: RulingPlanet;
  cuspDate: boolean;       // Sinh ngày giáp ranh 2 cung?
}

// Moon Sign result
export interface MoonSignResult {
  sign: ZodiacSignInfo;
  degree: number;
}

// Rising Sign (Ascendant) result
export interface RisingSignResult {
  sign: ZodiacSignInfo;
  degree: number;
}

// Big 3 kết hợp
export interface Big3Result {
  sun: SunSignResult;
  moon: MoonSignResult | null;    // null nếu không biết giờ sinh
  rising: RisingSignResult | null; // null nếu không có nơi sinh
}

// Tương hợp giữa 2 cung
export interface ZodiacCompatibility {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  score: number;           // 0-100
  level: string;           // "Rất hợp", "Hợp", "Trung bình", "Thử thách"
}
