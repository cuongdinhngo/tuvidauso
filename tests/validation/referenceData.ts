/**
 * Reference data for cross-validation.
 * Expected values are bootstrapped from our engine.
 * Set `verified: true` after cross-checking with tuvilyso.net or other trusted source.
 *
 * Coverage:
 * - 5 Cục: Thủy(2)×3, Mộc(3)×2, Kim(4)×7, Thổ(5)×2, Hỏa(6)×6
 * - Female: cases 2, 4, 8, 11, 13, 16, 19 (7 cases)
 * - Leap month: case 19
 * - Early year (Jan-Feb solar): cases 2, 4, 5, 14, 17 (5 cases)
 * - Tý hour: cases 2, 5, 18 (3 cases)
 * - Decades: 1960s(3), 1970s(3), 1980s(3), 1990s(5), 2000s(2), 2010s(3), 2020s(1)
 */

export interface ReferenceCase {
  id: number;
  label: string;
  input: {
    solarYear: number;
    solarMonth: number;
    solarDay: number;
    hourIndex: number; // 0=Tý, 1=Sửu, ..., 11=Hợi
    gender: 'male' | 'female';
  };
  expected: {
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    isLeapMonth: boolean;
    yearCan: string;
    yearChi: string;
    napAm: string;
    menh: string;
    than: string;
    cucName: string;
    cucValue: number;
    tuHoa: { loc: string; quyen: string; khoa: string; ky: string };
    mainStars: Record<string, string>;
    mainStarCount: number;
    palaceCount: number;
  };
  verified: boolean;
}

export const REFERENCE_CASES: ReferenceCase[] = [
  {
    id: 1,
    label: 'Nam 15/04/1988 Ngọ - Mậu Thìn',
    input: { solarYear: 1988, solarMonth: 4, solarDay: 15, hourIndex: 6, gender: 'male' },
    expected: {
      lunarYear: 1988, lunarMonth: 2, lunarDay: 29, isLeapMonth: false,
      yearCan: 'Mậu', yearChi: 'Thìn', napAm: 'Đại Lâm Mộc',
      menh: 'Dậu', than: 'Dậu', cucName: 'Mộc Tam Cục', cucValue: 3,
      tuHoa: { loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
      mainStars: { 'Tử Vi': 'Sửu', 'Thiên Cơ': 'Tý', 'Thái Dương': 'Tuất', 'Vũ Khúc': 'Dậu', 'Thiên Đồng': 'Thân', 'Liêm Trinh': 'Ngọ', 'Thiên Phủ': 'Mão', 'Thái Âm': 'Thìn', 'Tham Lang': 'Tị', 'Cự Môn': 'Ngọ', 'Thiên Tướng': 'Mùi', 'Thiên Lương': 'Thân', 'Thất Sát': 'Dậu', 'Phá Quân': 'Hợi' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 2,
    label: 'Nữ 01/01/2000 Tý - Kỷ Mão (early year + Tý hour)',
    input: { solarYear: 2000, solarMonth: 1, solarDay: 1, hourIndex: 0, gender: 'female' },
    expected: {
      lunarYear: 1999, lunarMonth: 11, lunarDay: 25, isLeapMonth: false,
      yearCan: 'Kỷ', yearChi: 'Mão', napAm: 'Thành Đầu Thổ',
      menh: 'Tý', than: 'Tý', cucName: 'Thủy Nhị Cục', cucValue: 2,
      tuHoa: { loc: 'Vũ Khúc', quyen: 'Tham Lang', khoa: 'Thiên Lương', ky: 'Văn Khúc' },
      mainStars: { 'Tử Vi': 'Dần', 'Thiên Cơ': 'Sửu', 'Thái Dương': 'Hợi', 'Vũ Khúc': 'Tuất', 'Thiên Đồng': 'Dậu', 'Liêm Trinh': 'Mùi', 'Thiên Phủ': 'Dần', 'Thái Âm': 'Mão', 'Tham Lang': 'Thìn', 'Cự Môn': 'Tị', 'Thiên Tướng': 'Ngọ', 'Thiên Lương': 'Mùi', 'Thất Sát': 'Thân', 'Phá Quân': 'Tuất' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 3,
    label: 'Nam 22/06/1985 Dần - Ất Sửu',
    input: { solarYear: 1985, solarMonth: 6, solarDay: 22, hourIndex: 2, gender: 'male' },
    expected: {
      lunarYear: 1985, lunarMonth: 5, lunarDay: 5, isLeapMonth: false,
      yearCan: 'Ất', yearChi: 'Sửu', napAm: 'Hải Trung Kim',
      menh: 'Thìn', than: 'Thân', cucName: 'Hỏa Lục Cục', cucValue: 6,
      tuHoa: { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
      mainStars: { 'Tử Vi': 'Dần', 'Thiên Cơ': 'Sửu', 'Thái Dương': 'Hợi', 'Vũ Khúc': 'Tuất', 'Thiên Đồng': 'Dậu', 'Liêm Trinh': 'Mùi', 'Thiên Phủ': 'Dần', 'Thái Âm': 'Mão', 'Tham Lang': 'Thìn', 'Cự Môn': 'Tị', 'Thiên Tướng': 'Ngọ', 'Thiên Lương': 'Mùi', 'Thất Sát': 'Thân', 'Phá Quân': 'Tuất' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 4,
    label: 'Nữ 14/02/1990 Mùi (early year)',
    input: { solarYear: 1990, solarMonth: 2, solarDay: 14, hourIndex: 7, gender: 'female' },
    expected: {
      lunarYear: 1990, lunarMonth: 1, lunarDay: 19, isLeapMonth: false,
      yearCan: 'Canh', yearChi: 'Ngọ', napAm: 'Lộ Bàng Thổ',
      menh: 'Mùi', than: 'Dậu', cucName: 'Kim Tứ Cục', cucValue: 4,
      tuHoa: { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
      mainStars: { 'Tử Vi': 'Dậu', 'Thiên Cơ': 'Thân', 'Thái Dương': 'Ngọ', 'Vũ Khúc': 'Tị', 'Thiên Đồng': 'Thìn', 'Liêm Trinh': 'Dần', 'Thiên Phủ': 'Mùi', 'Thái Âm': 'Thân', 'Tham Lang': 'Dậu', 'Cự Môn': 'Tuất', 'Thiên Tướng': 'Hợi', 'Thiên Lương': 'Tý', 'Thất Sát': 'Sửu', 'Phá Quân': 'Mão' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 5,
    label: 'Nam 25/01/2020 Tý - Canh Tý (Tết + Tý hour)',
    input: { solarYear: 2020, solarMonth: 1, solarDay: 25, hourIndex: 0, gender: 'male' },
    expected: {
      lunarYear: 2020, lunarMonth: 1, lunarDay: 1, isLeapMonth: false,
      yearCan: 'Canh', yearChi: 'Tý', napAm: 'Bích Thượng Thổ',
      menh: 'Dần', than: 'Dần', cucName: 'Kim Tứ Cục', cucValue: 4,
      tuHoa: { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
      mainStars: { 'Tử Vi': 'Tị', 'Thiên Cơ': 'Thìn', 'Thái Dương': 'Dần', 'Vũ Khúc': 'Sửu', 'Thiên Đồng': 'Tý', 'Liêm Trinh': 'Tuất', 'Thiên Phủ': 'Hợi', 'Thái Âm': 'Tý', 'Tham Lang': 'Sửu', 'Cự Môn': 'Dần', 'Thiên Tướng': 'Mão', 'Thiên Lương': 'Thìn', 'Thất Sát': 'Tị', 'Phá Quân': 'Mùi' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 6,
    label: 'Nam 15/03/1965 Thìn - Ất Tỵ',
    input: { solarYear: 1965, solarMonth: 3, solarDay: 15, hourIndex: 4, gender: 'male' },
    expected: {
      lunarYear: 1965, lunarMonth: 2, lunarDay: 13, isLeapMonth: false,
      yearCan: 'Ất', yearChi: 'Tị', napAm: 'Phúc Đăng Hỏa',
      menh: 'Hợi', than: 'Mùi', cucName: 'Thủy Nhị Cục', cucValue: 2,
      tuHoa: { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
      mainStars: { 'Tử Vi': 'Dần', 'Thiên Cơ': 'Sửu', 'Thái Dương': 'Hợi', 'Vũ Khúc': 'Tuất', 'Thiên Đồng': 'Dậu', 'Liêm Trinh': 'Mùi', 'Thiên Phủ': 'Dần', 'Thái Âm': 'Mão', 'Tham Lang': 'Thìn', 'Cự Môn': 'Tị', 'Thiên Tướng': 'Ngọ', 'Thiên Lương': 'Mùi', 'Thất Sát': 'Thân', 'Phá Quân': 'Tuất' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 7,
    label: 'Nam 20/08/1972 Thân - Nhâm Tý',
    input: { solarYear: 1972, solarMonth: 8, solarDay: 20, hourIndex: 8, gender: 'male' },
    expected: {
      lunarYear: 1972, lunarMonth: 7, lunarDay: 12, isLeapMonth: false,
      yearCan: 'Nhâm', yearChi: 'Tý', napAm: 'Tang Đố Mộc',
      menh: 'Tý', than: 'Thìn', cucName: 'Kim Tứ Cục', cucValue: 4,
      tuHoa: { loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Tả Phụ', ky: 'Vũ Khúc' },
      mainStars: { 'Tử Vi': 'Thân', 'Thiên Cơ': 'Mùi', 'Thái Dương': 'Tị', 'Vũ Khúc': 'Thìn', 'Thiên Đồng': 'Mão', 'Liêm Trinh': 'Sửu', 'Thiên Phủ': 'Thân', 'Thái Âm': 'Dậu', 'Tham Lang': 'Tuất', 'Cự Môn': 'Hợi', 'Thiên Tướng': 'Tý', 'Thiên Lương': 'Sửu', 'Thất Sát': 'Dần', 'Phá Quân': 'Thìn' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 8,
    label: 'Nữ 03/11/1978 Tuất - Mậu Ngọ',
    input: { solarYear: 1978, solarMonth: 11, solarDay: 3, hourIndex: 10, gender: 'female' },
    expected: {
      lunarYear: 1978, lunarMonth: 10, lunarDay: 3, isLeapMonth: false,
      yearCan: 'Mậu', yearChi: 'Ngọ', napAm: 'Thiên Thượng Hỏa',
      menh: 'Sửu', than: 'Dậu', cucName: 'Thổ Ngũ Cục', cucValue: 5,
      tuHoa: { loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
      mainStars: { 'Tử Vi': 'Thìn', 'Thiên Cơ': 'Mão', 'Thái Dương': 'Sửu', 'Vũ Khúc': 'Tý', 'Thiên Đồng': 'Hợi', 'Liêm Trinh': 'Dậu', 'Thiên Phủ': 'Tý', 'Thái Âm': 'Sửu', 'Tham Lang': 'Dần', 'Cự Môn': 'Mão', 'Thiên Tướng': 'Thìn', 'Thiên Lương': 'Tị', 'Thất Sát': 'Ngọ', 'Phá Quân': 'Thân' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 9,
    label: 'Nam 10/05/1983 Sửu - Quý Hợi',
    input: { solarYear: 1983, solarMonth: 5, solarDay: 10, hourIndex: 1, gender: 'male' },
    expected: {
      lunarYear: 1983, lunarMonth: 3, lunarDay: 28, isLeapMonth: false,
      yearCan: 'Quý', yearChi: 'Hợi', napAm: 'Đại Hải Thủy',
      menh: 'Mão', than: 'Tị', cucName: 'Hỏa Lục Cục', cucValue: 6,
      tuHoa: { loc: 'Phá Quân', quyen: 'Cự Môn', khoa: 'Thái Âm', ky: 'Tham Lang' },
      mainStars: { 'Tử Vi': 'Ngọ', 'Thiên Cơ': 'Tị', 'Thái Dương': 'Mão', 'Vũ Khúc': 'Dần', 'Thiên Đồng': 'Sửu', 'Liêm Trinh': 'Hợi', 'Thiên Phủ': 'Tuất', 'Thái Âm': 'Hợi', 'Tham Lang': 'Tý', 'Cự Môn': 'Sửu', 'Thiên Tướng': 'Dần', 'Thiên Lương': 'Mão', 'Thất Sát': 'Thìn', 'Phá Quân': 'Ngọ' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 10,
    label: 'Nam 18/07/1995 Tỵ - Ất Hợi',
    input: { solarYear: 1995, solarMonth: 7, solarDay: 18, hourIndex: 5, gender: 'male' },
    expected: {
      lunarYear: 1995, lunarMonth: 6, lunarDay: 21, isLeapMonth: false,
      yearCan: 'Ất', yearChi: 'Hợi', napAm: 'Sơn Đầu Hỏa',
      menh: 'Dần', than: 'Tý', cucName: 'Kim Tứ Cục', cucValue: 4,
      tuHoa: { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
      mainStars: { 'Tử Vi': 'Tuất', 'Thiên Cơ': 'Dậu', 'Thái Dương': 'Mùi', 'Vũ Khúc': 'Ngọ', 'Thiên Đồng': 'Tị', 'Liêm Trinh': 'Mão', 'Thiên Phủ': 'Ngọ', 'Thái Âm': 'Mùi', 'Tham Lang': 'Thân', 'Cự Môn': 'Dậu', 'Thiên Tướng': 'Tuất', 'Thiên Lương': 'Hợi', 'Thất Sát': 'Tý', 'Phá Quân': 'Dần' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 11,
    label: 'Nữ 25/09/2001 Mão - Tân Tỵ',
    input: { solarYear: 2001, solarMonth: 9, solarDay: 25, hourIndex: 3, gender: 'female' },
    expected: {
      lunarYear: 2001, lunarMonth: 8, lunarDay: 9, isLeapMonth: false,
      yearCan: 'Tân', yearChi: 'Tị', napAm: 'Bạch Lạp Kim',
      menh: 'Ngọ', than: 'Tý', cucName: 'Kim Tứ Cục', cucValue: 4,
      tuHoa: { loc: 'Cự Môn', quyen: 'Thái Dương', khoa: 'Văn Khúc', ky: 'Văn Xương' },
      mainStars: { 'Tử Vi': 'Mùi', 'Thiên Cơ': 'Ngọ', 'Thái Dương': 'Thìn', 'Vũ Khúc': 'Mão', 'Thiên Đồng': 'Dần', 'Liêm Trinh': 'Tý', 'Thiên Phủ': 'Dậu', 'Thái Âm': 'Tuất', 'Tham Lang': 'Hợi', 'Cự Môn': 'Tý', 'Thiên Tướng': 'Sửu', 'Thiên Lương': 'Dần', 'Thất Sát': 'Mão', 'Phá Quân': 'Tị' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 12,
    label: 'Nam 01/12/2005 Dậu - Ất Dậu',
    input: { solarYear: 2005, solarMonth: 12, solarDay: 1, hourIndex: 9, gender: 'male' },
    expected: {
      lunarYear: 2005, lunarMonth: 11, lunarDay: 1, isLeapMonth: false,
      yearCan: 'Ất', yearChi: 'Dậu', napAm: 'Tuyền Trung Thủy',
      menh: 'Mão', than: 'Dậu', cucName: 'Mộc Tam Cục', cucValue: 3,
      tuHoa: { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
      mainStars: { 'Tử Vi': 'Thìn', 'Thiên Cơ': 'Mão', 'Thái Dương': 'Sửu', 'Vũ Khúc': 'Tý', 'Thiên Đồng': 'Hợi', 'Liêm Trinh': 'Dậu', 'Thiên Phủ': 'Tý', 'Thái Âm': 'Sửu', 'Tham Lang': 'Dần', 'Cự Môn': 'Mão', 'Thiên Tướng': 'Thìn', 'Thiên Lương': 'Tị', 'Thất Sát': 'Ngọ', 'Phá Quân': 'Thân' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 13,
    label: 'Nữ 15/06/2010 Ngọ - Canh Dần',
    input: { solarYear: 2010, solarMonth: 6, solarDay: 15, hourIndex: 6, gender: 'female' },
    expected: {
      lunarYear: 2010, lunarMonth: 5, lunarDay: 4, isLeapMonth: false,
      yearCan: 'Canh', yearChi: 'Dần', napAm: 'Tùng Bách Mộc',
      menh: 'Tý', than: 'Tý', cucName: 'Hỏa Lục Cục', cucValue: 6,
      tuHoa: { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
      mainStars: { 'Tử Vi': 'Dần', 'Thiên Cơ': 'Sửu', 'Thái Dương': 'Hợi', 'Vũ Khúc': 'Tuất', 'Thiên Đồng': 'Dậu', 'Liêm Trinh': 'Mùi', 'Thiên Phủ': 'Dần', 'Thái Âm': 'Mão', 'Tham Lang': 'Thìn', 'Cự Môn': 'Tị', 'Thiên Tướng': 'Ngọ', 'Thiên Lương': 'Mùi', 'Thất Sát': 'Thân', 'Phá Quân': 'Tuất' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 14,
    label: 'Nam 10/02/1968 Hợi (early year)',
    input: { solarYear: 1968, solarMonth: 2, solarDay: 10, hourIndex: 11, gender: 'male' },
    expected: {
      lunarYear: 1968, lunarMonth: 1, lunarDay: 12, isLeapMonth: false,
      yearCan: 'Mậu', yearChi: 'Thân', napAm: 'Đại Dịch Thổ',
      menh: 'Mão', than: 'Sửu', cucName: 'Hỏa Lục Cục', cucValue: 6,
      tuHoa: { loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
      mainStars: { 'Tử Vi': 'Thìn', 'Thiên Cơ': 'Mão', 'Thái Dương': 'Sửu', 'Vũ Khúc': 'Tý', 'Thiên Đồng': 'Hợi', 'Liêm Trinh': 'Dậu', 'Thiên Phủ': 'Tý', 'Thái Âm': 'Sửu', 'Tham Lang': 'Dần', 'Cự Môn': 'Mão', 'Thiên Tướng': 'Thìn', 'Thiên Lương': 'Tị', 'Thất Sát': 'Ngọ', 'Phá Quân': 'Thân' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 15,
    label: 'Nam 25/04/1975 Dần - Ất Mão',
    input: { solarYear: 1975, solarMonth: 4, solarDay: 25, hourIndex: 2, gender: 'male' },
    expected: {
      lunarYear: 1975, lunarMonth: 3, lunarDay: 14, isLeapMonth: false,
      yearCan: 'Ất', yearChi: 'Mão', napAm: 'Đại Khê Thủy',
      menh: 'Dần', than: 'Ngọ', cucName: 'Kim Tứ Cục', cucValue: 4,
      tuHoa: { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
      mainStars: { 'Tử Vi': 'Thân', 'Thiên Cơ': 'Mùi', 'Thái Dương': 'Tị', 'Vũ Khúc': 'Thìn', 'Thiên Đồng': 'Mão', 'Liêm Trinh': 'Sửu', 'Thiên Phủ': 'Thân', 'Thái Âm': 'Dậu', 'Tham Lang': 'Tuất', 'Cự Môn': 'Hợi', 'Thiên Tướng': 'Tý', 'Thiên Lương': 'Sửu', 'Thất Sát': 'Dần', 'Phá Quân': 'Thìn' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 16,
    label: 'Nữ 20/03/1999 Thìn - Kỷ Mão',
    input: { solarYear: 1999, solarMonth: 3, solarDay: 20, hourIndex: 4, gender: 'female' },
    expected: {
      lunarYear: 1999, lunarMonth: 2, lunarDay: 3, isLeapMonth: false,
      yearCan: 'Kỷ', yearChi: 'Mão', napAm: 'Thành Đầu Thổ',
      menh: 'Hợi', than: 'Mùi', cucName: 'Hỏa Lục Cục', cucValue: 6,
      tuHoa: { loc: 'Vũ Khúc', quyen: 'Tham Lang', khoa: 'Thiên Lương', ky: 'Văn Khúc' },
      mainStars: { 'Tử Vi': 'Dần', 'Thiên Cơ': 'Sửu', 'Thái Dương': 'Hợi', 'Vũ Khúc': 'Tuất', 'Thiên Đồng': 'Dậu', 'Liêm Trinh': 'Mùi', 'Thiên Phủ': 'Dần', 'Thái Âm': 'Mão', 'Tham Lang': 'Thìn', 'Cự Môn': 'Tị', 'Thiên Tướng': 'Ngọ', 'Thiên Lương': 'Mùi', 'Thất Sát': 'Thân', 'Phá Quân': 'Tuất' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 17,
    label: 'Nam 28/01/2015 Mùi (early year)',
    input: { solarYear: 2015, solarMonth: 1, solarDay: 28, hourIndex: 7, gender: 'male' },
    expected: {
      lunarYear: 2014, lunarMonth: 12, lunarDay: 9, isLeapMonth: false,
      yearCan: 'Giáp', yearChi: 'Ngọ', napAm: 'Sa Trung Kim',
      menh: 'Ngọ', than: 'Thân', cucName: 'Hỏa Lục Cục', cucValue: 6,
      tuHoa: { loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' },
      mainStars: { 'Tử Vi': 'Mão', 'Thiên Cơ': 'Dần', 'Thái Dương': 'Tý', 'Vũ Khúc': 'Hợi', 'Thiên Đồng': 'Tuất', 'Liêm Trinh': 'Thân', 'Thiên Phủ': 'Sửu', 'Thái Âm': 'Dần', 'Tham Lang': 'Mão', 'Cự Môn': 'Thìn', 'Thiên Tướng': 'Tị', 'Thiên Lương': 'Ngọ', 'Thất Sát': 'Mùi', 'Phá Quân': 'Dậu' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 18,
    label: 'Nam 10/10/1960 Tý - Canh Tý',
    input: { solarYear: 1960, solarMonth: 10, solarDay: 10, hourIndex: 0, gender: 'male' },
    expected: {
      lunarYear: 1960, lunarMonth: 8, lunarDay: 20, isLeapMonth: false,
      yearCan: 'Canh', yearChi: 'Tý', napAm: 'Bích Thượng Thổ',
      menh: 'Dậu', than: 'Dậu', cucName: 'Hỏa Lục Cục', cucValue: 6,
      tuHoa: { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
      mainStars: { 'Tử Vi': 'Tị', 'Thiên Cơ': 'Thìn', 'Thái Dương': 'Dần', 'Vũ Khúc': 'Sửu', 'Thiên Đồng': 'Tý', 'Liêm Trinh': 'Tuất', 'Thiên Phủ': 'Hợi', 'Thái Âm': 'Tý', 'Tham Lang': 'Sửu', 'Cự Môn': 'Dần', 'Thiên Tướng': 'Mão', 'Thiên Lương': 'Thìn', 'Thất Sát': 'Tị', 'Phá Quân': 'Mùi' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 19,
    label: 'Nữ 22/05/2012 Thân - Nhâm Thìn (leap month 4)',
    input: { solarYear: 2012, solarMonth: 5, solarDay: 22, hourIndex: 8, gender: 'female' },
    expected: {
      lunarYear: 2012, lunarMonth: 4, lunarDay: 2, isLeapMonth: true,
      yearCan: 'Nhâm', yearChi: 'Thìn', napAm: 'Trường Lưu Thủy',
      menh: 'Dậu', than: 'Sửu', cucName: 'Thủy Nhị Cục', cucValue: 2,
      tuHoa: { loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Tả Phụ', ky: 'Vũ Khúc' },
      mainStars: { 'Tử Vi': 'Mão', 'Thiên Cơ': 'Dần', 'Thái Dương': 'Tý', 'Vũ Khúc': 'Hợi', 'Thiên Đồng': 'Tuất', 'Liêm Trinh': 'Thân', 'Thiên Phủ': 'Sửu', 'Thái Âm': 'Dần', 'Tham Lang': 'Mão', 'Cự Môn': 'Thìn', 'Thiên Tướng': 'Tị', 'Thiên Lương': 'Ngọ', 'Thất Sát': 'Mùi', 'Phá Quân': 'Dậu' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
  {
    id: 20,
    label: 'Nam 14/04/1993 Ngọ - Quý Dậu',
    input: { solarYear: 1993, solarMonth: 4, solarDay: 14, hourIndex: 6, gender: 'male' },
    expected: {
      lunarYear: 1993, lunarMonth: 3, lunarDay: 23, isLeapMonth: false,
      yearCan: 'Quý', yearChi: 'Dậu', napAm: 'Kiếm Phong Kim',
      menh: 'Tuất', than: 'Tuất', cucName: 'Thổ Ngũ Cục', cucValue: 5,
      tuHoa: { loc: 'Phá Quân', quyen: 'Cự Môn', khoa: 'Thái Âm', ky: 'Tham Lang' },
      mainStars: { 'Tử Vi': 'Thân', 'Thiên Cơ': 'Mùi', 'Thái Dương': 'Tị', 'Vũ Khúc': 'Thìn', 'Thiên Đồng': 'Mão', 'Liêm Trinh': 'Sửu', 'Thiên Phủ': 'Thân', 'Thái Âm': 'Dậu', 'Tham Lang': 'Tuất', 'Cự Môn': 'Hợi', 'Thiên Tướng': 'Tý', 'Thiên Lương': 'Sửu', 'Thất Sát': 'Dần', 'Phá Quân': 'Thìn' },
      mainStarCount: 14, palaceCount: 12,
    },
    verified: false,
  },
];
