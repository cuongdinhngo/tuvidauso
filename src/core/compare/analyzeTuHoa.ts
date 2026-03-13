import type { PersonProfile, CategoryScore, RelationType } from '../types/compare';
import { getFourTransforms } from '../tuvi/fourTransforms';
import { RELATION_PALACE_MAP, scoreToRating } from '../../data/compareData';

export function analyzeTuHoa(
  p1: PersonProfile, p2: PersonProfile, relationType: RelationType
): CategoryScore {
  let score = 50;
  const details: string[] = [];

  const p1TH = getFourTransforms(p1.lunarDate.yearCan);
  const p2TH = getFourTransforms(p2.lunarDate.yearCan);

  const chart1 = p1.tuViChart;
  const chart2 = p2.tuViChart;

  // Find where a star sits in a chart
  function findStarPosition(palaces: typeof chart1.palaces, starName: string): string | null {
    for (const palace of palaces) {
      if (palace.stars.some(s => s.name === starName)) {
        return palace.position;
      }
    }
    return null;
  }

  // Check Hoa Loc P1 -> Menh P2
  const p1LocPos = findStarPosition(chart1.palaces, p1TH.loc);
  if (p1LocPos && p1LocPos === chart2.menh) {
    score += 15;
    details.push(`Hóa Lộc ${p1.name} (${p1TH.loc}) chiếu vào Mệnh ${p2.name} → ${p1.name} mang lại may mắn cho ${p2.name}`);
  }

  // Check Hoa Loc P2 -> Menh P1
  const p2LocPos = findStarPosition(chart2.palaces, p2TH.loc);
  if (p2LocPos && p2LocPos === chart1.menh) {
    score += 15;
    details.push(`Hóa Lộc ${p2.name} (${p2TH.loc}) chiếu vào Mệnh ${p1.name} → ${p2.name} mang lại may mắn cho ${p1.name}`);
  }

  // Check Hoa Ky P1 -> Menh P2 (bad)
  const p1KyPos = findStarPosition(chart1.palaces, p1TH.ky);
  if (p1KyPos && p1KyPos === chart2.menh) {
    score -= 12;
    details.push(`Hóa Kỵ ${p1.name} (${p1TH.ky}) chiếu vào Mệnh ${p2.name} → dễ gây khó khăn cho ${p2.name}`);
  }

  // Check Hoa Ky P2 -> Menh P1 (bad)
  const p2KyPos = findStarPosition(chart2.palaces, p2TH.ky);
  if (p2KyPos && p2KyPos === chart1.menh) {
    score -= 12;
    details.push(`Hóa Kỵ ${p2.name} (${p2TH.ky}) chiếu vào Mệnh ${p1.name} → dễ gây khó khăn cho ${p1.name}`);
  }

  // Check Hoa Loc -> relevant palace
  const palaceMap = RELATION_PALACE_MAP[relationType];
  const targetPalace1 = chart1.palaces.find(p => p.name === palaceMap.p1);
  const targetPalace2 = chart2.palaces.find(p => p.name === palaceMap.p2);

  if (p2LocPos && targetPalace1 && p2LocPos === targetPalace1.position) {
    score += 12;
    details.push(`Hóa Lộc ${p2.name} vào ${palaceMap.p1} ${p1.name} → rất thuận lợi cho mối quan hệ`);
  }
  if (p1LocPos && targetPalace2 && p1LocPos === targetPalace2.position) {
    score += 12;
    details.push(`Hóa Lộc ${p1.name} vào ${palaceMap.p2} ${p2.name} → rất thuận lợi cho mối quan hệ`);
  }

  // Check Hoa Ky -> relevant palace
  if (p2KyPos && targetPalace1 && p2KyPos === targetPalace1.position) {
    score -= 10;
    details.push(`Hóa Kỵ ${p2.name} vào ${palaceMap.p1} ${p1.name} → trở ngại trong mối quan hệ`);
  }
  if (p1KyPos && targetPalace2 && p1KyPos === targetPalace2.position) {
    score -= 10;
    details.push(`Hóa Kỵ ${p1.name} vào ${palaceMap.p2} ${p2.name} → trở ngại trong mối quan hệ`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: 'Tứ Hóa Chéo',
    score,
    rating: scoreToRating(score),
    analysis: details.length > 0
      ? details.join('. ') + '.'
      : 'Tứ Hóa không có tương tác đặc biệt giữa 2 lá số.',
    details,
  };
}
