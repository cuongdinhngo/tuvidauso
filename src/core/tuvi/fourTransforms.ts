/**
 * Tu Hoa (Four Transformations) based on year's Thien Can.
 * Each Can maps to 4 stars that receive transformations:
 *   Hoa Loc, Hoa Quyen, Hoa Khoa, Hoa Ky
 */

export interface FourTransforms {
  loc: string;    // Hoa Loc
  quyen: string;  // Hoa Quyen
  khoa: string;   // Hoa Khoa
  ky: string;     // Hoa Ky
}

const TU_HOA: Record<string, FourTransforms> = {
  'Giáp': { loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' },
  'Ất':   { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
  'Bính': { loc: 'Thiên Đồng', quyen: 'Thiên Cơ', khoa: 'Văn Xương', ky: 'Liêm Trinh' },
  'Đinh': { loc: 'Thái Âm', quyen: 'Thiên Đồng', khoa: 'Thiên Cơ', ky: 'Cự Môn' },
  'Mậu':  { loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
  'Kỷ':   { loc: 'Vũ Khúc', quyen: 'Tham Lang', khoa: 'Thiên Lương', ky: 'Văn Khúc' },
  'Canh':  { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
  'Tân':  { loc: 'Cự Môn', quyen: 'Thái Dương', khoa: 'Văn Khúc', ky: 'Văn Xương' },
  'Nhâm': { loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Tả Phụ', ky: 'Vũ Khúc' },
  'Quý':  { loc: 'Phá Quân', quyen: 'Cự Môn', khoa: 'Thái Âm', ky: 'Tham Lang' },
};

/** Get the Four Transforms for a given year Can */
export function getFourTransforms(yearCan: string): FourTransforms {
  return TU_HOA[yearCan] || { loc: '', quyen: '', khoa: '', ky: '' };
}

/** Get transform type for a specific star name, given year Can */
export function getStarTransform(yearCan: string, starName: string): string | undefined {
  const transforms = TU_HOA[yearCan];
  if (!transforms) return undefined;
  if (transforms.loc === starName) return 'Hóa Lộc';
  if (transforms.quyen === starName) return 'Hóa Quyền';
  if (transforms.khoa === starName) return 'Hóa Khoa';
  if (transforms.ky === starName) return 'Hóa Kỵ';
  return undefined;
}
