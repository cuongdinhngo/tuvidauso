import { describe, it, expect } from 'vitest';
import { calculateNumerology, removeVietnameseDiacritics } from '../src/core/numerology/calculator';

describe('Numerology Calculator', () => {
  describe('removeVietnameseDiacritics', () => {
    it('should remove Vietnamese diacritics', () => {
      expect(removeVietnameseDiacritics('Ngô Đình Cường')).toBe('Ngo Dinh Cuong');
    });

    it('should handle lowercase đ', () => {
      expect(removeVietnameseDiacritics('đường')).toBe('duong');
    });

    it('should handle uppercase Đ', () => {
      expect(removeVietnameseDiacritics('Đông')).toBe('Dong');
    });

    it('should handle already clean text', () => {
      expect(removeVietnameseDiacritics('Ngo Dinh Cuong')).toBe('Ngo Dinh Cuong');
    });
  });

  describe('Life Path calculation', () => {
    it('should calculate Life Path = 7 for 6/11/1988', () => {
      const chart = calculateNumerology('Ngô Đình Cường', 6, 11, 1988, 2026, 3);
      // 6 + 11 + 1988: day=6, month=11(master), year=1+9+8+8=26→8
      // 6 + 11 + 26: reduceNumber(26)=8, so 6 + 11 + 8 = 25 → 2+5 = 7
      // Actually: 6 → 6, 11 → 11 (master), 1988 → 1+9+8+8=26 → 2+6=8
      // Total: 6 + 11 + 8 = 25 → 2+5 = 7
      expect(chart.lifePath.value).toBe(7);
    });

    it('should preserve Master Number 11 for Life Path', () => {
      // 29/11/1960: day=29→11(master), month=11(master), year=1960→16→7
      // Total: 11 + 11 + 7 = 29 → 2+9 = 11 (master!)
      const chart = calculateNumerology('Test', 29, 11, 1960, 2026, 3);
      expect(chart.lifePath.value).toBe(11);
      expect(chart.lifePath.masterNumber).toBe(true);
    });

    it('should preserve Master Number 22', () => {
      // 22/12/1978: day=22(master), month=12→3, year=1978→25→7
      // Total: 22 + 3 + 7 = 32 → 3+2 = 5
      const chart = calculateNumerology('Test', 22, 12, 1978, 2026, 3);
      expect(chart.lifePath.value).toBe(5);
      // But the birthday should be master 22
      expect(chart.birthday.value).toBe(22);
      expect(chart.birthday.masterNumber).toBe(true);
    });
  });

  describe('Expression number', () => {
    it('should calculate Expression = 5 for "Ngô Đình Cường"', () => {
      // After removing diacritics: "Ngo Dinh Cuong"
      // N=5, g=7, o=6, D=4, i=9, n=5, h=8, C=3, u=3, o=6, n=5, g=7
      // = 5+7+6 + 4+9+5+8 + 3+3+6+5+7 = 18 + 26 + 24 = 68 → 6+8 = 14 → 1+4 = 5
      const chart = calculateNumerology('Ngô Đình Cường', 6, 11, 1988, 2026, 3);
      expect(chart.expression.value).toBe(5);
    });

    it('should return 0 for empty name', () => {
      const chart = calculateNumerology('', 6, 11, 1988, 2026, 3);
      expect(chart.expression.value).toBe(0);
      expect(chart.soulUrge.value).toBe(0);
      expect(chart.personality.value).toBe(0);
    });
  });

  describe('Personal Year', () => {
    it('should calculate Personal Year = 9 for 6/11/1988 in 2026', () => {
      // day=6, month=11→2(no master in personal year), year=2026→10→1
      // Wait, reduceNumber(6, false)=6, reduceNumber(11, false)=2, reduceNumber(2026, false)=10→1
      // Total: 6+2+1=9
      const chart = calculateNumerology('Ngô Đình Cường', 6, 11, 1988, 2026, 3);
      expect(chart.personalYear.value).toBe(9);
    });
  });

  describe('Inclusion chart', () => {
    it('should count letter frequencies correctly', () => {
      const chart = calculateNumerology('Ngô Đình Cường', 6, 11, 1988, 2026, 3);
      // "ngodinhcuong" → n=5(×3), g=7(×2), o=6(×2), d=4(×1), i=9(×1), h=8(×1), c=3(×1), u=3(×1)
      // Count by number:
      // 1: 0 (no a,j,s), 2: 0 (no b,k,t), 3: 2 (c,u), 4: 1 (d), 5: 3 (n,n,n),
      // 6: 2 (o,o), 7: 2 (g,g), 8: 1 (h), 9: 1 (i)
      expect(chart.inclusionChart[1]).toBe(0);
      expect(chart.inclusionChart[2]).toBe(0);
      expect(chart.inclusionChart[3]).toBe(2);
      expect(chart.inclusionChart[5]).toBe(3);
    });

    it('should detect karmic lessons (missing numbers)', () => {
      const chart = calculateNumerology('Ngô Đình Cường', 6, 11, 1988, 2026, 3);
      expect(chart.karmicLesson).toContain(1);
      expect(chart.karmicLesson).toContain(2);
    });

    it('should detect hidden passion (most frequent)', () => {
      const chart = calculateNumerology('Ngô Đình Cường', 6, 11, 1988, 2026, 3);
      // Number 5 appears 3 times (n×3) — most frequent
      expect(chart.hiddenPassion).toContain(5);
    });
  });

  describe('Pinnacles', () => {
    it('should calculate first pinnacle ending at 36 - lifePath', () => {
      const chart = calculateNumerology('Test', 6, 11, 1988, 2026, 3);
      const lifePath = chart.lifePath.value;
      expect(chart.pinnacles[0].endAge).toBe(36 - lifePath);
    });

    it('should have 4 pinnacles', () => {
      const chart = calculateNumerology('Test', 6, 11, 1988, 2026, 3);
      expect(chart.pinnacles).toHaveLength(4);
    });

    it('should have last pinnacle with null endAge', () => {
      const chart = calculateNumerology('Test', 6, 11, 1988, 2026, 3);
      expect(chart.pinnacles[3].endAge).toBeNull();
    });
  });

  describe('Challenges', () => {
    it('should have 4 challenges', () => {
      const chart = calculateNumerology('Test', 6, 11, 1988, 2026, 3);
      expect(chart.challenges).toHaveLength(4);
    });

    it('should have challenge numbers between 0-9', () => {
      const chart = calculateNumerology('Test', 6, 11, 1988, 2026, 3);
      chart.challenges.forEach(c => {
        expect(c.number).toBeGreaterThanOrEqual(0);
        expect(c.number).toBeLessThanOrEqual(9);
      });
    });
  });

  describe('Birth Pyramid', () => {
    it('should start with digits of the birth date', () => {
      const chart = calculateNumerology('Test', 6, 11, 1988, 2026, 3);
      // "6111988" → [6, 1, 1, 1, 9, 8, 8]
      expect(chart.birthChart[0]).toEqual([6, 1, 1, 1, 9, 8, 8]);
    });

    it('should end with a single digit', () => {
      const chart = calculateNumerology('Test', 6, 11, 1988, 2026, 3);
      const lastRow = chart.birthChart[chart.birthChart.length - 1];
      expect(lastRow).toHaveLength(1);
    });
  });
});
