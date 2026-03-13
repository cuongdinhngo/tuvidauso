import { describe, it, expect } from 'vitest';
import { solarToLunar } from '../src/core/calendar/solarToLunar';

describe('Solar to Lunar conversion', () => {
  const testCases = [
    {
      solar: { year: 1988, month: 4, day: 15 },
      expected: { year: 1988, month: 2, day: 29, yearCan: 'Mậu', yearChi: 'Thìn', napAm: 'Đại Lâm Mộc' },
    },
    {
      solar: { year: 2000, month: 1, day: 1 },
      expected: { year: 1999, month: 11, day: 25, yearCan: 'Kỷ', yearChi: 'Mão', napAm: 'Thành Đầu Thổ' },
    },
    {
      solar: { year: 1990, month: 1, day: 27 },
      expected: { year: 1990, month: 1, day: 1, yearCan: 'Canh', yearChi: 'Ngọ', napAm: 'Lộ Bàng Thổ' },
    },
    {
      solar: { year: 2019, month: 2, day: 5 },
      expected: { year: 2019, month: 1, day: 1, yearCan: 'Kỷ', yearChi: 'Hợi', napAm: 'Bình Địa Mộc' },
    },
    {
      solar: { year: 2020, month: 1, day: 25 },
      expected: { year: 2020, month: 1, day: 1, yearCan: 'Canh', yearChi: 'Tý', napAm: 'Bích Thượng Thổ' },
    },
    {
      solar: { year: 2002, month: 2, day: 12 },
      expected: { year: 2002, month: 1, day: 1, yearCan: 'Nhâm', yearChi: 'Ngọ', napAm: 'Dương Liễu Mộc' },
    },
    {
      solar: { year: 1985, month: 6, day: 22 },
      expected: { year: 1985, month: 5, day: 5, yearCan: 'Ất', yearChi: 'Sửu', napAm: 'Hải Trung Kim' },
    },
    {
      solar: { year: 2015, month: 2, day: 19 },
      expected: { year: 2015, month: 1, day: 1, yearCan: 'Ất', yearChi: 'Mùi', napAm: 'Sa Trung Kim' },
    },
  ];

  testCases.forEach(({ solar, expected }, i) => {
    it(`Case ${i + 1}: ${solar.day}/${solar.month}/${solar.year} → ${expected.day}/${expected.month} ${expected.yearCan} ${expected.yearChi}`, () => {
      const result = solarToLunar(solar.year, solar.month, solar.day);
      expect(result.year).toBe(expected.year);
      expect(result.month).toBe(expected.month);
      expect(result.day).toBe(expected.day);
      expect(result.yearCan).toBe(expected.yearCan);
      expect(result.yearChi).toBe(expected.yearChi);
      expect(result.napAm).toBe(expected.napAm);
    });
  });
});
