import type { PersonProfile, CategoryScore } from '../types/compare';
import { TAM_HOP, LUC_HOP, LUC_XUNG, LUC_HAI, TAM_HINH } from '../../data/compareData';

function isPairInList(chi1: string, chi2: string, list: [string, string][]): boolean {
  return list.some(([a, b]) => (a === chi1 && b === chi2) || (a === chi2 && b === chi1));
}

function isInTamHop(chi1: string, chi2: string): boolean {
  return TAM_HOP.some(group => group.includes(chi1) && group.includes(chi2));
}

function isInTamHinh(chi1: string, chi2: string): boolean {
  return TAM_HINH.some(group => group.includes(chi1) && group.includes(chi2));
}

export function analyzeZodiac(p1: PersonProfile, p2: PersonProfile): CategoryScore {
  const chi1 = p1.lunarDate.yearChi;
  const chi2 = p2.lunarDate.yearChi;

  if (isInTamHop(chi1, chi2)) {
    return {
      name: 'Con Giáp',
      score: 90,
      rating: 5,
      analysis: `${chi1} và ${chi2} TAM HỢP → Cực kỳ hòa hợp, hỗ trợ nhau mạnh mẽ, cùng hướng về mục tiêu chung.`,
    };
  }

  if (isPairInList(chi1, chi2, LUC_HOP)) {
    return {
      name: 'Con Giáp',
      score: 85,
      rating: 5,
      analysis: `${chi1} và ${chi2} LỤC HỢP → Rất ăn ý, bổ sung cho nhau, mối quan hệ thuận lợi tự nhiên.`,
    };
  }

  if (isPairInList(chi1, chi2, LUC_XUNG)) {
    return {
      name: 'Con Giáp',
      score: 25,
      rating: 1,
      analysis: `${chi1} và ${chi2} LỤC XUNG → Tính cách đối nghịch, dễ xung đột. Cần rất nhiều thấu hiểu và nhường nhịn. Tuy nhiên xung không hoàn toàn xấu — có thể bổ sung cho nhau nếu biết cách.`,
    };
  }

  if (isPairInList(chi1, chi2, LUC_HAI)) {
    return {
      name: 'Con Giáp',
      score: 35,
      rating: 2,
      analysis: `${chi1} và ${chi2} LỤC HẠI → Dễ gây tổn thương cho nhau trong vô thức. Cần cẩn trọng trong giao tiếp.`,
    };
  }

  if (isInTamHinh(chi1, chi2)) {
    return {
      name: 'Con Giáp',
      score: 30,
      rating: 2,
      analysis: `${chi1} và ${chi2} TAM HÌNH → Dễ có mâu thuẫn, thử thách trong mối quan hệ. Cần kiên nhẫn và bao dung.`,
    };
  }

  return {
    name: 'Con Giáp',
    score: 60,
    rating: 3,
    analysis: `${chi1} và ${chi2} không có quan hệ đặc biệt → Bình thường, không hợp cũng không xung.`,
  };
}
