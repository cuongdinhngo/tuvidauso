import { DIA_CHI } from '../types';
import type { Palace, Star } from '../types';

/**
 * Tam Hợp — 4 groups of 3 branches that form triangles.
 */
const TAM_HOP_GROUPS: string[][] = [
  ['Thân', 'Tý', 'Thìn'],   // Thủy cục
  ['Dần', 'Ngọ', 'Tuất'],   // Hỏa cục
  ['Tị', 'Dậu', 'Sửu'],    // Kim cục
  ['Hợi', 'Mão', 'Mùi'],   // Mộc cục
];

/**
 * Get the other 2 Tam Hợp positions for a given Địa Chi.
 */
export function getTamHopPositions(position: string): [string, string] {
  for (const group of TAM_HOP_GROUPS) {
    const idx = group.indexOf(position);
    if (idx >= 0) {
      const others = group.filter((_, i) => i !== idx);
      return [others[0], others[1]];
    }
  }
  return ['', ''];
}

/**
 * Get the Đối Cung (opposite palace, 6 positions apart).
 */
export function getDoiCung(position: string): string {
  const idx = DIA_CHI.indexOf(position as typeof DIA_CHI[number]);
  return DIA_CHI[(idx + 6) % 12];
}

/**
 * Get the 2 Giáp Cung (adjacent palaces).
 */
export function getGiapCung(position: string): [string, string] {
  const idx = DIA_CHI.indexOf(position as typeof DIA_CHI[number]);
  const prev = DIA_CHI[((idx - 1) + 12) % 12];
  const next = DIA_CHI[(idx + 1) % 12];
  return [prev, next];
}

export interface PalaceInfluence {
  palace: Palace;
  tamHop: { positions: [string, string]; palaces: Palace[]; stars: Star[] };
  doiCung: { position: string; palace: Palace | null; stars: Star[] };
  giapCung: { positions: [string, string]; palaces: [Palace | null, Palace | null]; stars: Star[] };
}

/**
 * Compute all palace influences (tam hợp, đối cung, giáp cung) for a target palace.
 */
export function getPalaceInfluence(
  targetPosition: string,
  allPalaces: Palace[]
): PalaceInfluence {
  const findPalace = (pos: string) => allPalaces.find(p => p.position === pos) || null;
  const getStars = (pos: string) => findPalace(pos)?.stars || [];

  const palace = findPalace(targetPosition)!;
  const tamHopPos = getTamHopPositions(targetPosition);
  const doiCungPos = getDoiCung(targetPosition);
  const giapPos = getGiapCung(targetPosition);

  return {
    palace,
    tamHop: {
      positions: tamHopPos,
      palaces: [findPalace(tamHopPos[0]), findPalace(tamHopPos[1])].filter(Boolean) as Palace[],
      stars: [...getStars(tamHopPos[0]), ...getStars(tamHopPos[1])],
    },
    doiCung: {
      position: doiCungPos,
      palace: findPalace(doiCungPos),
      stars: getStars(doiCungPos),
    },
    giapCung: {
      positions: giapPos,
      palaces: [findPalace(giapPos[0]), findPalace(giapPos[1])],
      stars: [...getStars(giapPos[0]), ...getStars(giapPos[1])],
    },
  };
}
