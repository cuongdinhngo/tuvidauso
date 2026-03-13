import { DIA_CHI } from '../types';

export interface StarPosition {
  star: string;
  position: string; // Dia Chi
  system: 'tuViHe' | 'thienPhuHe';
}

/**
 * Tu Vi star position lookup table.
 * Key = Cuc value (2,3,4,5,6), Value = array of 30 Dia Chi (for lunar day 1-30).
 */
const TU_VI_TABLE: Record<number, string[]> = {
  2: [ // Thuy Nhi Cuc
    'Dần','Mão','Thìn','Tị','Ngọ','Mùi',
    'Thân','Dậu','Tuất','Hợi','Tý','Sửu',
    'Dần','Mão','Thìn','Tị','Ngọ','Mùi',
    'Thân','Dậu','Tuất','Hợi','Tý','Sửu',
    'Dần','Mão','Thìn','Tị','Ngọ','Mùi',
  ],
  3: [ // Moc Tam Cuc
    'Thìn','Thìn','Tị','Tị','Tị','Ngọ',
    'Ngọ','Ngọ','Mùi','Mùi','Mùi','Thân',
    'Thân','Thân','Dậu','Dậu','Dậu','Tuất',
    'Tuất','Tuất','Hợi','Hợi','Hợi','Tý',
    'Tý','Tý','Sửu','Sửu','Sửu','Dần',
  ],
  4: [ // Kim Tu Cuc
    'Tị','Tị','Tị','Ngọ','Ngọ','Ngọ',
    'Ngọ','Mùi','Mùi','Mùi','Mùi','Thân',
    'Thân','Thân','Thân','Dậu','Dậu','Dậu',
    'Dậu','Tuất','Tuất','Tuất','Tuất','Hợi',
    'Hợi','Hợi','Hợi','Tý','Tý','Tý',
  ],
  5: [ // Tho Ngu Cuc
    'Thìn','Thìn','Thìn','Tị','Tị','Tị',
    'Tị','Tị','Ngọ','Ngọ','Ngọ','Ngọ',
    'Ngọ','Mùi','Mùi','Mùi','Mùi','Mùi',
    'Thân','Thân','Thân','Thân','Thân','Dậu',
    'Dậu','Dậu','Dậu','Dậu','Tuất','Tuất',
  ],
  6: [ // Hoa Luc Cuc
    'Dần','Dần','Dần','Dần','Dần','Mão',
    'Mão','Mão','Mão','Mão','Mão','Thìn',
    'Thìn','Thìn','Thìn','Thìn','Thìn','Tị',
    'Tị','Tị','Tị','Tị','Tị','Ngọ',
    'Ngọ','Ngọ','Ngọ','Ngọ','Ngọ','Mùi',
  ],
};

/**
 * Thien Phu mirror table: Tu Vi position -> Thien Phu position.
 * Symmetric across Dan-Than axis.
 */
const THIEN_PHU_MIRROR: Record<string, string> = {
  'Dần': 'Dần',
  'Mão': 'Sửu',
  'Thìn': 'Tý',
  'Tị': 'Hợi',
  'Ngọ': 'Tuất',
  'Mùi': 'Dậu',
  'Thân': 'Thân',
  'Dậu': 'Mùi',
  'Tuất': 'Ngọ',
  'Hợi': 'Tị',
  'Tý': 'Thìn',
  'Sửu': 'Mão',
};

/**
 * Get the position offset (counter-clockwise = decreasing index).
 */
function offsetChi(position: string, offset: number): string {
  const idx = DIA_CHI.indexOf(position as typeof DIA_CHI[number]);
  return DIA_CHI[((idx + offset) % 12 + 12) % 12];
}

/**
 * Place all 14 main stars based on Cuc value and lunar day.
 */
export function placeMainStars(cucValue: number, lunarDay: number): StarPosition[] {
  const stars: StarPosition[] = [];

  // === Tu Vi position from lookup table ===
  const tuViPos = TU_VI_TABLE[cucValue]?.[lunarDay - 1];
  if (!tuViPos) throw new Error(`Invalid cucValue ${cucValue} or lunarDay ${lunarDay}`);

  // === Tu Vi system (6 stars) - go counter-clockwise from Tu Vi ===
  // Tu Vi -> (-1) Thien Co -> (-1 skip) -> (-1) Thai Duong -> (-1) Vu Khuc -> (-1) Thien Dong -> (-2) Liem Trinh
  stars.push({ star: 'Tử Vi', position: tuViPos, system: 'tuViHe' });
  stars.push({ star: 'Thiên Cơ', position: offsetChi(tuViPos, -1), system: 'tuViHe' });
  // Skip one position (-2 from Tu Vi)
  stars.push({ star: 'Thái Dương', position: offsetChi(tuViPos, -3), system: 'tuViHe' });
  stars.push({ star: 'Vũ Khúc', position: offsetChi(tuViPos, -4), system: 'tuViHe' });
  stars.push({ star: 'Thiên Đồng', position: offsetChi(tuViPos, -5), system: 'tuViHe' });
  // Skip one position (-6 from Tu Vi), Liem Trinh at -7
  stars.push({ star: 'Liêm Trinh', position: offsetChi(tuViPos, -7), system: 'tuViHe' });

  // === Thien Phu position (mirror of Tu Vi) ===
  const thienPhuPos = THIEN_PHU_MIRROR[tuViPos];

  // === Thien Phu system (8 stars) - go clockwise from Thien Phu ===
  // Thien Phu -> (+1) Thai Am -> (+1) Tham Lang -> (+1) Cu Mon -> (+1) Thien Tuong
  // -> (+1) Thien Luong -> (+1) That Sat -> (+2, skip 1) Pha Quan
  stars.push({ star: 'Thiên Phủ', position: thienPhuPos, system: 'thienPhuHe' });
  stars.push({ star: 'Thái Âm', position: offsetChi(thienPhuPos, 1), system: 'thienPhuHe' });
  stars.push({ star: 'Tham Lang', position: offsetChi(thienPhuPos, 2), system: 'thienPhuHe' });
  stars.push({ star: 'Cự Môn', position: offsetChi(thienPhuPos, 3), system: 'thienPhuHe' });
  stars.push({ star: 'Thiên Tướng', position: offsetChi(thienPhuPos, 4), system: 'thienPhuHe' });
  stars.push({ star: 'Thiên Lương', position: offsetChi(thienPhuPos, 5), system: 'thienPhuHe' });
  stars.push({ star: 'Thất Sát', position: offsetChi(thienPhuPos, 6), system: 'thienPhuHe' });
  // Skip one, Pha Quan at +8
  stars.push({ star: 'Phá Quân', position: offsetChi(thienPhuPos, 8), system: 'thienPhuHe' });

  return stars;
}
