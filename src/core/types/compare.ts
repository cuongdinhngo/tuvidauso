import type { BirthInfo, LunarDate, FourPillars, TuViChart } from './index';

/** Loại mối quan hệ */
export type RelationType =
  | 'lover'      // Người yêu / Vợ chồng
  | 'business'   // Đối tác làm ăn
  | 'child'      // Con cái (user là cha/mẹ)
  | 'parent'     // Cha mẹ (user là con)
  | 'sibling'    // Anh chị em
  | 'friend';    // Bạn bè / Đồng nghiệp

/** Hồ sơ 1 người */
export interface PersonProfile {
  id: string;
  name: string;
  birthInfo: BirthInfo;
  lunarDate: LunarDate;
  fourPillars: FourPillars;
  tuViChart: TuViChart;
  createdAt: number;
}

/** Mối quan hệ giữa 2 người */
export interface Relationship {
  id: string;
  person1Id: string;       // Hồ sơ chính (bản thân)
  person2Id: string;
  relationType: RelationType;
  result?: CompatibilityResult;
}

/** Điểm từng hạng mục */
export interface CategoryScore {
  name: string;
  score: number;           // 0-100
  rating: 1 | 2 | 3 | 4 | 5;
  analysis: string;
  details?: string[];
}

/** Kết quả so sánh tổng hợp */
export interface CompatibilityResult {
  overallScore: number;    // 0-100
  overallRating: 1 | 2 | 3 | 4 | 5;
  ratingLabel: string;     // "Rất hợp", "Khá hợp", etc.
  categories: CategoryScore[];
  strengths: string[];
  challenges: string[];
  advice: string[];
  relationSpecific: Record<string, string>;
}
