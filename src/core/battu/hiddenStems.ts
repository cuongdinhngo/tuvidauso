/**
 * Tang Can (Hidden Stems) - each Dia Chi contains hidden Thien Can.
 * The first entry is the primary (main qi), followed by secondary stems.
 */
const HIDDEN_STEMS: Record<string, string[]> = {
  'Tý': ['Quý'],
  'Sửu': ['Kỷ', 'Quý', 'Tân'],
  'Dần': ['Giáp', 'Bính', 'Mậu'],
  'Mão': ['Ất'],
  'Thìn': ['Mậu', 'Ất', 'Quý'],
  'Tị': ['Bính', 'Canh', 'Mậu'],
  'Ngọ': ['Đinh', 'Kỷ'],
  'Mùi': ['Kỷ', 'Đinh', 'Ất'],
  'Thân': ['Canh', 'Nhâm', 'Mậu'],
  'Dậu': ['Tân'],
  'Tuất': ['Mậu', 'Tân', 'Đinh'],
  'Hợi': ['Nhâm', 'Giáp'],
};

/** Get hidden stems for a Dia Chi */
export function getHiddenStems(chi: string): string[] {
  return HIDDEN_STEMS[chi] || [];
}
