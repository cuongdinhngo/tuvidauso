import type { PersonProfile, CategoryScore } from '../types/compare';
import { getElement, GENERATION_CYCLE, OVERCOMING_CYCLE } from '../battu/fiveElements';
import { ratePalace } from '../tuvi/palaceRating';
import { scoreToRating } from '../../data/compareData';

export function analyzeMenhCung(p1: PersonProfile, p2: PersonProfile): CategoryScore {
  const chart1 = p1.tuViChart;
  const chart2 = p2.tuViChart;

  const menhPalace1 = chart1.palaces.find(p => p.position === chart1.menh);
  const menhPalace2 = chart2.palaces.find(p => p.position === chart2.menh);

  if (!menhPalace1 || !menhPalace2) {
    return { name: 'Cung Mệnh', score: 50, rating: 3, analysis: 'Không thể xác định cung Mệnh.' };
  }

  const details: string[] = [];
  let score = 50;

  // 1. Element of Menh position
  const el1 = getElement(chart1.menh);
  const el2 = getElement(chart2.menh);

  if (el1 === el2) {
    score += 10;
    details.push(`Cùng hành ${el1} tại Mệnh → đồng điệu`);
  } else if (GENERATION_CYCLE[el1] === el2 || GENERATION_CYCLE[el2] === el1) {
    score += 15;
    details.push(`${el1} và ${el2} tương sinh → hỗ trợ lẫn nhau`);
  } else if (OVERCOMING_CYCLE[el1] === el2 || OVERCOMING_CYCLE[el2] === el1) {
    score -= 10;
    details.push(`${el1} và ${el2} tương khắc → dễ xung đột`);
  }

  // 2. Palace ratings
  const rating1 = ratePalace(menhPalace1, chart1.tuanTriet);
  const rating2 = ratePalace(menhPalace2, chart2.tuanTriet);
  const avgRating = (rating1.score + rating2.score) / 2;

  if (avgRating >= 4) {
    score += 15;
    details.push(`Cung Mệnh cả hai đều tốt (${rating1.score}★ & ${rating2.score}★)`);
  } else if (avgRating >= 3) {
    score += 5;
    details.push(`Cung Mệnh trung bình (${rating1.score}★ & ${rating2.score}★)`);
  } else {
    score -= 5;
    details.push(`Cung Mệnh yếu (${rating1.score}★ & ${rating2.score}★)`);
  }

  // 3. Check for shared main stars
  const main1 = menhPalace1.stars.filter(s => s.type === 'chinh').map(s => s.name);
  const main2 = menhPalace2.stars.filter(s => s.type === 'chinh').map(s => s.name);
  const shared = main1.filter(s => main2.includes(s));
  if (shared.length > 0) {
    score += 8;
    details.push(`Cùng có ${shared.join(', ')} tại Mệnh → tính cách tương đồng`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Cung Mệnh',
    score,
    rating: scoreToRating(score),
    analysis: details.join('. ') + '.',
    details,
  };
}
