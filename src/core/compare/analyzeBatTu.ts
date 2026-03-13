import type { PersonProfile, CategoryScore } from '../types/compare';
import { getElement, countElements, GENERATION_CYCLE, OVERCOMING_CYCLE } from '../battu/fiveElements';
import type { Element } from '../battu/fiveElements';
import { CAN_HOP, scoreToRating } from '../../data/compareData';

function isElementGenerating(e1: Element, e2: Element): boolean {
  return GENERATION_CYCLE[e1] === e2;
}

function isElementDestroying(e1: Element, e2: Element): boolean {
  return OVERCOMING_CYCLE[e1] === e2;
}

function isCanHop(can1: string, can2: string): boolean {
  return CAN_HOP.some(([a, b]) => (a === can1 && b === can2) || (a === can2 && b === can1));
}

export function analyzeBatTu(p1: PersonProfile, p2: PersonProfile): CategoryScore {
  let score = 50;
  const details: string[] = [];

  const p1DayElement = getElement(p1.fourPillars.day.can);
  const p2DayElement = getElement(p2.fourPillars.day.can);

  // Element counts for complementarity check
  const p1Counts = countElements(p1.fourPillars);
  const p2Counts = countElements(p2.fourPillars);

  // Complementary elements: one person's weak is the other's strong
  const elements: Element[] = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
  let complementary = 0;
  for (const el of elements) {
    if (p1Counts[el] <= 1 && p2Counts[el] >= 3) complementary++;
    if (p2Counts[el] <= 1 && p1Counts[el] >= 3) complementary++;
  }
  if (complementary >= 2) {
    score += 15;
    details.push('Ngũ Hành bổ sung lẫn nhau — thiếu/thừa bù đắp tốt');
  } else if (complementary === 1) {
    score += 8;
    details.push('Ngũ Hành có phần bổ trợ nhau');
  }

  // Day element relation
  if (isElementGenerating(p1DayElement, p2DayElement)) {
    score += 10;
    details.push(`${p1DayElement} sinh ${p2DayElement} → mối quan hệ cho-nhận tự nhiên`);
  } else if (isElementGenerating(p2DayElement, p1DayElement)) {
    score += 10;
    details.push(`${p2DayElement} sinh ${p1DayElement} → mối quan hệ cho-nhận tự nhiên`);
  } else if (isElementDestroying(p1DayElement, p2DayElement)) {
    score -= 10;
    details.push(`${p1DayElement} khắc ${p2DayElement} → dễ có xung đột về quan điểm`);
  } else if (isElementDestroying(p2DayElement, p1DayElement)) {
    score -= 10;
    details.push(`${p2DayElement} khắc ${p1DayElement} → dễ có xung đột về quan điểm`);
  } else if (p1DayElement === p2DayElement) {
    score += 5;
    details.push(`Cùng hành ${p1DayElement} → đồng điệu`);
  }

  // Can ngay hop
  if (isCanHop(p1.fourPillars.day.can, p2.fourPillars.day.can)) {
    score += 15;
    details.push(`Can ngày ${p1.fourPillars.day.can} hợp ${p2.fourPillars.day.can} → tâm đầu ý hợp, dễ thấu hiểu`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Ngũ Hành Bát Tự',
    score,
    rating: scoreToRating(score),
    analysis: details.length > 0 ? details.join('. ') + '.' : 'Bát Tự không có tương tác đặc biệt.',
    details,
  };
}
