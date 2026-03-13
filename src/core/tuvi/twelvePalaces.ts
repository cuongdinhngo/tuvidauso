import { DIA_CHI, PALACE_NAMES } from '../types';

export interface PalacePosition {
  palace: string;   // Palace name
  position: string; // Dia Chi
}

/**
 * Arrange 12 palaces starting from Menh Cung, going COUNTER-CLOCKWISE
 * (decreasing Dia Chi index).
 *
 * Order: Menh, Huynh De, Phu The, Tu Tuc, Tai Bach, Tat Ach,
 *        Thien Di, No Boc, Quan Loc, Dien Trach, Phuc Duc, Phu Mau
 */
export function arrangePalaces(menhCung: string): PalacePosition[] {
  const menhIndex = DIA_CHI.indexOf(menhCung as typeof DIA_CHI[number]);
  if (menhIndex < 0) throw new Error(`Invalid menhCung: ${menhCung}`);

  const palaces: PalacePosition[] = [];
  for (let i = 0; i < 12; i++) {
    // Counter-clockwise = decreasing index
    const chiIndex = ((menhIndex - i) % 12 + 12) % 12;
    palaces.push({
      palace: PALACE_NAMES[i],
      position: DIA_CHI[chiIndex],
    });
  }

  return palaces;
}
