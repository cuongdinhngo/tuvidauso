/**
 * 24 Solar Terms (Jie Qi / Tiết Khí) calculation.
 * Uses the Shouzheng Sun algorithm approximation for the period 1900-2100.
 *
 * The 24 terms divide the year into periods. Each "Jie" (節) marks a month boundary for Bat Tu.
 * Only the 12 "Jie" terms matter for month determination:
 *   Lap Xuan (Feb ~4), Kinh Trap (Mar ~6), Thanh Minh (Apr ~5),
 *   Lap Ha (May ~6), Mang Chung (Jun ~6), Tieu Thu (Jul ~7),
 *   Lap Thu (Aug ~7), Bach Lo (Sep ~8), Han Lo (Oct ~8),
 *   Lap Dong (Nov ~7), Dai Tuyet (Dec ~7), Tieu Han (Jan ~6)
 */

// Solar longitude for each of the 24 terms (0-360 degrees)
const TERM_NAMES = [
  'Tiểu Hàn', 'Đại Hàn',       // Jan
  'Lập Xuân', 'Vũ Thủy',       // Feb
  'Kinh Trập', 'Xuân Phân',     // Mar
  'Thanh Minh', 'Cốc Vũ',       // Apr
  'Lập Hạ', 'Tiểu Mãn',        // May
  'Mang Chủng', 'Hạ Chí',       // Jun
  'Tiểu Thử', 'Đại Thử',       // Jul
  'Lập Thu', 'Xử Thử',         // Aug
  'Bạch Lộ', 'Thu Phân',        // Sep
  'Hàn Lộ', 'Sương Giáng',     // Oct
  'Lập Đông', 'Tiểu Tuyết',     // Nov
  'Đại Tuyết', 'Đông Chí',      // Dec
];

// The 12 Jie terms (odd indices in the pair) that define month boundaries
// Index in TERM_NAMES: 0,2,4,6,8,10,12,14,16,18,20,22
// Tieu Han(0), Lap Xuan(2), Kinh Trap(4), Thanh Minh(6), Lap Ha(8), Mang Chung(10)
// Tieu Thu(12), Lap Thu(14), Bach Lo(16), Han Lo(18), Lap Dong(20), Dai Tuyet(22)


/**
 * Get the Jie Qi (solar term) dates for a given year.
 * Returns an array of 24 dates (as {month, day} in solar calendar).
 */
export function getJieQiDates(year: number): Array<{ name: string; month: number; day: number }> {
  const result: Array<{ name: string; month: number; day: number }> = [];

  for (let i = 0; i < 24; i++) {
    const monthBase = Math.floor(i / 2) + 1;
    const Y = year % 100;
    const L = Math.floor(Y / 4);

    const BASE_DAYS_21C = [
      5.4055, 20.12, 3.87, 18.73, 5.63, 20.646,
      4.81, 20.1, 5.52, 21.04, 5.678, 21.37,
      7.108, 22.83, 7.5, 23.13, 7.646, 23.042,
      8.318, 23.438, 7.438, 22.36, 7.18, 21.94,
    ];

    const BASE_DAYS_20C = [
      6.11, 20.84, 4.6295, 19.4599, 6.3826, 21.4155,
      5.59, 20.888, 6.318, 21.86, 6.5, 22.2,
      7.928, 23.65, 8.35, 23.95, 8.44, 23.822,
      9.098, 24.218, 8.218, 23.08, 7.9, 22.6,
    ];

    const BASE_DAYS = year >= 2000 ? BASE_DAYS_21C : BASE_DAYS_20C;
    const day = Math.floor(Y * 0.2422 + BASE_DAYS[i]) - L;

    result.push({ name: TERM_NAMES[i], month: monthBase, day });
  }

  return result;
}

/**
 * Get Lap Xuan (Start of Spring) date for a given year.
 * This is critical: the Bat Tu year changes at Lap Xuan, NOT lunar new year.
 */
export function getLapXuanDate(year: number): { month: number; day: number } {
  const terms = getJieQiDates(year);
  return { month: terms[2].month, day: terms[2].day }; // Index 2 = Lap Xuan
}

/**
 * Get the Bat Tu month number (1-12) for a given solar date based on Jie Qi boundaries.
 *
 * The 12 Jie terms (even indices in our array) define month boundaries:
 *   Month 1 (Dan):  Lap Xuan (idx 2, ~Feb 4)  to before Kinh Trap
 *   Month 2 (Mao):  Kinh Trap (idx 4, ~Mar 6)  to before Thanh Minh
 *   Month 3 (Thin): Thanh Minh (idx 6, ~Apr 5) to before Lap Ha
 *   Month 4 (Ti):   Lap Ha (idx 8, ~May 6)     to before Mang Chung
 *   Month 5 (Ngo):  Mang Chung (idx 10, ~Jun 6) to before Tieu Thu
 *   Month 6 (Mui):  Tieu Thu (idx 12, ~Jul 7)  to before Lap Thu
 *   Month 7 (Than): Lap Thu (idx 14, ~Aug 7)   to before Bach Lo
 *   Month 8 (Dau):  Bach Lo (idx 16, ~Sep 8)   to before Han Lo
 *   Month 9 (Tuat): Han Lo (idx 18, ~Oct 8)    to before Lap Dong
 *   Month 10 (Hoi): Lap Dong (idx 20, ~Nov 7)  to before Dai Tuyet
 *   Month 11 (Ty):  Dai Tuyet (idx 22, ~Dec 7) to before Tieu Han
 *   Month 12 (Suu): Tieu Han (idx 0, ~Jan 6)   to before Lap Xuan
 */
export function getJieQiMonth(solarYear: number, solarMonth: number, solarDay: number): number {
  const terms = getJieQiDates(solarYear);
  const dateNum = solarMonth * 100 + solarDay;

  // Jie term indices and their corresponding Bat Tu months
  // Check from latest to earliest in the year
  const boundaries: Array<{ termIdx: number; month: number }> = [
    { termIdx: 22, month: 11 }, // Dai Tuyet (~Dec 7)
    { termIdx: 20, month: 10 }, // Lap Dong (~Nov 7)
    { termIdx: 18, month: 9 },  // Han Lo (~Oct 8)
    { termIdx: 16, month: 8 },  // Bach Lo (~Sep 8)
    { termIdx: 14, month: 7 },  // Lap Thu (~Aug 7)
    { termIdx: 12, month: 6 },  // Tieu Thu (~Jul 7)
    { termIdx: 10, month: 5 },  // Mang Chung (~Jun 6)
    { termIdx: 8, month: 4 },   // Lap Ha (~May 6)
    { termIdx: 6, month: 3 },   // Thanh Minh (~Apr 5)
    { termIdx: 4, month: 2 },   // Kinh Trap (~Mar 6)
    { termIdx: 2, month: 1 },   // Lap Xuan (~Feb 4)
    { termIdx: 0, month: 12 },  // Tieu Han (~Jan 6)
  ];

  for (const { termIdx, month } of boundaries) {
    const t = terms[termIdx];
    const termDateNum = t.month * 100 + t.day;
    if (dateNum >= termDateNum) {
      return month;
    }
  }

  // Before Tieu Han of current year -> still month 11 (from previous year's Dai Tuyet)
  return 11;
}

export { TERM_NAMES };
