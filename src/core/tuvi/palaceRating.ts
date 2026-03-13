import type { Palace, TuanTriet } from '../types';

export interface PalaceRating {
  score: number;       // 1-5
  factors: string[];
}

/**
 * Rate a palace from 1-5 based on star quality, brightness, transforms, and Tuần/Triệt.
 */
export function ratePalace(palace: Palace, tuanTriet?: TuanTriet): PalaceRating {
  let score = 3;
  const factors: string[] = [];

  const mainStars = palace.stars.filter(s => s.type === 'chinh');
  const catStars = palace.stars.filter(s => s.type === 'cat');
  const satStars = palace.stars.filter(s => s.type === 'sat');

  // Brightness scoring
  for (const star of mainStars) {
    switch (star.brightness) {
      case 'Miếu': score += 1; factors.push(`${star.name} Miếu (+1)`); break;
      case 'Vượng': score += 0.7; factors.push(`${star.name} Vượng (+0.7)`); break;
      case 'Đắc': score += 0.3; factors.push(`${star.name} Đắc (+0.3)`); break;
      case 'Bình': break;
      case 'Hãm': score -= 1; factors.push(`${star.name} Hãm (-1)`); break;
    }
  }

  // No main stars = weaker
  if (mainStars.length === 0) {
    score -= 0.5;
    factors.push('Vô chính diệu (-0.5)');
  }

  // Cat tinh bonus (max +1.5)
  const catBonus = Math.min(catStars.length * 0.3, 1.5);
  if (catBonus > 0) {
    score += catBonus;
    factors.push(`${catStars.length} cát tinh (+${catBonus.toFixed(1)})`);
  }

  // Sat tinh penalty (max -1.5)
  const satPenalty = Math.min(satStars.length * 0.3, 1.5);
  if (satPenalty > 0) {
    score -= satPenalty;
    factors.push(`${satStars.length} sát tinh (-${satPenalty.toFixed(1)})`);
  }

  // Transform scoring
  for (const star of palace.stars) {
    switch (star.transform) {
      case 'Hóa Lộc': score += 0.5; factors.push(`${star.name} Hóa Lộc (+0.5)`); break;
      case 'Hóa Quyền': score += 0.3; factors.push(`${star.name} Hóa Quyền (+0.3)`); break;
      case 'Hóa Khoa': score += 0.3; factors.push(`${star.name} Hóa Khoa (+0.3)`); break;
      case 'Hóa Kỵ': score -= 0.5; factors.push(`${star.name} Hóa Kỵ (-0.5)`); break;
    }
  }

  // Tuần/Triệt penalty
  if (tuanTriet) {
    if (tuanTriet.tuan.includes(palace.position)) {
      score -= 0.3;
      factors.push('Bị Tuần Không (-0.3)');
    }
    if (tuanTriet.triet.includes(palace.position)) {
      score -= 0.5;
      factors.push('Bị Triệt Lộ (-0.5)');
    }
  }

  return {
    score: Math.max(1, Math.min(5, Math.round(score))),
    factors,
  };
}
