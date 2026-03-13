import type { PersonProfile, CategoryScore, RelationType } from '../types/compare';
import { ratePalace } from '../tuvi/palaceRating';
import { RELATION_PALACE_MAP, scoreToRating } from '../../data/compareData';

export function analyzeRelatedPalaces(
  p1: PersonProfile, p2: PersonProfile, relationType: RelationType
): CategoryScore {
  const palaceMap = RELATION_PALACE_MAP[relationType];
  const chart1 = p1.tuViChart;
  const chart2 = p2.tuViChart;

  const p1Palace = chart1.palaces.find(p => p.name === palaceMap.p1);
  const p2Palace = chart2.palaces.find(p => p.name === palaceMap.p2);

  if (!p1Palace || !p2Palace) {
    return {
      name: `Cung ${palaceMap.label}`,
      score: 50, rating: 3,
      analysis: `Không tìm thấy cung ${palaceMap.label}.`,
    };
  }

  let score = 50;
  const details: string[] = [];

  // Main star brightness in relevant palaces
  for (const star of p1Palace.stars.filter(s => s.type === 'chinh')) {
    if (star.brightness === 'Miếu' || star.brightness === 'Vượng') {
      score += 8;
      details.push(`${p1.name}: ${star.name} [${star.brightness}] tại ${palaceMap.p1} → tốt`);
    } else if (star.brightness === 'Hãm') {
      score -= 8;
      details.push(`${p1.name}: ${star.name} [Hãm] tại ${palaceMap.p1} → bất lợi`);
    }
  }
  for (const star of p2Palace.stars.filter(s => s.type === 'chinh')) {
    if (star.brightness === 'Miếu' || star.brightness === 'Vượng') {
      score += 8;
      details.push(`${p2.name}: ${star.name} [${star.brightness}] tại ${palaceMap.p2} → tốt`);
    } else if (star.brightness === 'Hãm') {
      score -= 8;
      details.push(`${p2.name}: ${star.name} [Hãm] tại ${palaceMap.p2} → bất lợi`);
    }
  }

  // Cat tinh bonus
  const p1Cat = p1Palace.stars.filter(s => s.type === 'cat').length;
  const p2Cat = p2Palace.stars.filter(s => s.type === 'cat').length;
  score += (p1Cat + p2Cat) * 4;

  // Sat tinh penalty
  const p1Sat = p1Palace.stars.filter(s => s.type === 'sat').length;
  const p2Sat = p2Palace.stars.filter(s => s.type === 'sat').length;
  score -= (p1Sat + p2Sat) * 4;

  // Tu Hoa in relevant palaces
  for (const star of [...p1Palace.stars, ...p2Palace.stars]) {
    if (star.transform === 'Hóa Lộc') {
      score += 10;
      details.push(`${star.name} Hóa Lộc → rất thuận lợi`);
    }
    if (star.transform === 'Hóa Quyền') { score += 6; }
    if (star.transform === 'Hóa Khoa') { score += 5; }
    if (star.transform === 'Hóa Kỵ') {
      score -= 10;
      details.push(`${star.name} Hóa Kỵ → cần lưu ý trở ngại`);
    }
  }

  // Special check for lover: Co Than / Qua Tu in Phu The
  if (relationType === 'lover') {
    for (const [palace, person] of [[p1Palace, p1] as const, [p2Palace, p2] as const]) {
      if (palace.stars.some(s => s.name === 'Cô Thần' || s.name === 'Quả Tú')) {
        score -= 10;
        details.push(`${person.name} có Cô Thần/Quả Tú tại Phu Thê → hôn nhân có thử thách`);
      }
    }
  }

  // Also check Tai Bach for business
  if (relationType === 'business') {
    const p1TaiBach = chart1.palaces.find(p => p.name === 'Tài Bạch');
    const p2TaiBach = chart2.palaces.find(p => p.name === 'Tài Bạch');
    if (p1TaiBach && p2TaiBach) {
      const r1 = ratePalace(p1TaiBach, chart1.tuanTriet);
      const r2 = ratePalace(p2TaiBach, chart2.tuanTriet);
      if (r1.score >= 4 && r2.score >= 4) {
        score += 10;
        details.push('Cung Tài Bạch cả hai đều tốt → triển vọng tài chính thuận lợi');
      }
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: `Cung ${palaceMap.label}`,
    score,
    rating: scoreToRating(score),
    analysis: details.length > 0
      ? `Phân tích ${palaceMap.label}: ${details.slice(0, 3).join('. ')}.`
      : `Không có tương tác đặc biệt tại cung ${palaceMap.label}.`,
    details,
  };
}
