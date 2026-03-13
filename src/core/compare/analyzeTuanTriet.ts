import type { PersonProfile, CategoryScore, RelationType } from '../types/compare';
import { RELATION_PALACE_MAP, scoreToRating } from '../../data/compareData';

export function analyzeTuanTriet(
  p1: PersonProfile, p2: PersonProfile, relationType: RelationType
): CategoryScore {
  let score = 60; // Base: slightly positive (no overlap is normal)
  const details: string[] = [];

  const chart1 = p1.tuViChart;
  const chart2 = p2.tuViChart;
  const tt1 = chart1.tuanTriet;
  const tt2 = chart2.tuanTriet;

  const palaceMap = RELATION_PALACE_MAP[relationType];

  // Get positions of key palaces for each person
  const p2Menh = chart2.menh;
  const p1Menh = chart1.menh;
  const p1Target = chart1.palaces.find(p => p.name === palaceMap.p1)?.position;
  const p2Target = chart2.palaces.find(p => p.name === palaceMap.p2)?.position;

  // P1's Tuan/Triet affecting P2's key palaces
  if (tt1.tuan.includes(p2Menh)) {
    score -= 10;
    details.push(`Tuần Không ${p1.name} trùng Mệnh ${p2.name} → giảm phúc đức cho ${p2.name}`);
  }
  if (tt1.triet.includes(p2Menh)) {
    score -= 12;
    details.push(`Triệt Lộ ${p1.name} trùng Mệnh ${p2.name} → cản trở phát triển cho ${p2.name}`);
  }

  // P2's Tuan/Triet affecting P1's key palaces
  if (tt2.tuan.includes(p1Menh)) {
    score -= 10;
    details.push(`Tuần Không ${p2.name} trùng Mệnh ${p1.name} → giảm phúc đức cho ${p1.name}`);
  }
  if (tt2.triet.includes(p1Menh)) {
    score -= 12;
    details.push(`Triệt Lộ ${p2.name} trùng Mệnh ${p1.name} → cản trở phát triển cho ${p1.name}`);
  }

  // Check overlap with relevant palaces
  if (p2Target && tt1.tuan.includes(p2Target)) {
    score -= 8;
    details.push(`Tuần Không ${p1.name} trùng ${palaceMap.p2} ${p2.name}`);
  }
  if (p2Target && tt1.triet.includes(p2Target)) {
    score -= 10;
    details.push(`Triệt Lộ ${p1.name} trùng ${palaceMap.p2} ${p2.name}`);
  }
  if (p1Target && tt2.tuan.includes(p1Target)) {
    score -= 8;
    details.push(`Tuần Không ${p2.name} trùng ${palaceMap.p1} ${p1.name}`);
  }
  if (p1Target && tt2.triet.includes(p1Target)) {
    score -= 10;
    details.push(`Triệt Lộ ${p2.name} trùng ${palaceMap.p1} ${p1.name}`);
  }

  // Bonus: no overlap at all
  if (details.length === 0) {
    score = 70;
    details.push('Tuần Triệt không ảnh hưởng chéo → thuận lợi');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Tuần Triệt',
    score,
    rating: scoreToRating(score),
    analysis: details.join('. ') + '.',
    details,
  };
}
