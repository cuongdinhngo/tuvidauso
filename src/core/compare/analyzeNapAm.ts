import type { PersonProfile, CategoryScore } from '../types/compare';
import type { Element } from '../battu/fiveElements';
import { GENERATION_CYCLE, OVERCOMING_CYCLE } from '../battu/fiveElements';
import { scoreToRating } from '../../data/compareData';

/** Extract the element from a Nạp Âm string (last word) */
function extractNapAmElement(napAm: string): Element {
  const parts = napAm.split(' ');
  const last = parts[parts.length - 1];
  const map: Record<string, Element> = {
    'Kim': 'Kim', 'Mộc': 'Mộc', 'Thủy': 'Thủy', 'Hỏa': 'Hỏa', 'Thổ': 'Thổ',
  };
  return map[last] || 'Thổ';
}

type ElementRelation = 'tuong_sinh' | 'bi_sinh' | 'tuong_hoa' | 'tuong_khac' | 'bi_khac';

function getElementRelation(e1: Element, e2: Element): ElementRelation {
  if (e1 === e2) return 'tuong_hoa';
  if (GENERATION_CYCLE[e1] === e2) return 'tuong_sinh';
  if (GENERATION_CYCLE[e2] === e1) return 'bi_sinh';
  if (OVERCOMING_CYCLE[e1] === e2) return 'tuong_khac';
  if (OVERCOMING_CYCLE[e2] === e1) return 'bi_khac';
  return 'tuong_hoa';
}

export function analyzeNapAm(p1: PersonProfile, p2: PersonProfile): CategoryScore {
  const element1 = extractNapAmElement(p1.lunarDate.napAm);
  const element2 = extractNapAmElement(p2.lunarDate.napAm);
  const relation = getElementRelation(element1, element2);

  let score: number;
  let analysis: string;

  switch (relation) {
    case 'tuong_sinh':
      score = 85;
      analysis = `${p1.name} (${p1.lunarDate.napAm} - ${element1}) sinh ${p2.name} (${p2.lunarDate.napAm} - ${element2}) → Mối quan hệ hỗ trợ, ${p1.name} là người cho đi, nâng đỡ.`;
      break;
    case 'bi_sinh':
      score = 80;
      analysis = `${p2.name} (${element2}) sinh ${p1.name} (${element1}) → ${p1.name} được hỗ trợ, nâng đỡ bởi ${p2.name}.`;
      break;
    case 'tuong_hoa':
      score = 70;
      analysis = `Cùng hành ${element1} → Hiểu nhau, đồng điệu, nhưng dễ thiếu sự bổ sung.`;
      break;
    case 'tuong_khac':
      score = 35;
      analysis = `${p1.name} (${element1}) khắc ${p2.name} (${element2}) → ${p1.name} có xu hướng áp đảo, kiểm soát. Cần ý thức để cân bằng.`;
      break;
    case 'bi_khac':
      score = 30;
      analysis = `${p2.name} (${element2}) khắc ${p1.name} (${element1}) → ${p1.name} dễ bị chèn ép, mất tự chủ trong mối quan hệ.`;
      break;
  }

  return { name: 'Nạp Âm', score, rating: scoreToRating(score), analysis };
}
