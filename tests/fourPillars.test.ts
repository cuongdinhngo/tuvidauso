import { describe, it, expect } from 'vitest';
import { calculateFourPillars } from '../src/core/battu/fourPillars';

describe('Four Pillars calculation', () => {
  it('Male 15/04/1988 Ngo hour', () => {
    // After Lap Xuan (Feb ~4), so year = 1988 = Mau Thin
    // After Thanh Minh (Apr ~5) = month 3 in Jie Qi = Binh Thin
    const result = calculateFourPillars(1988, 4, 15, 6); // 6 = Ngo

    expect(result.year.can).toBe('Mậu');
    expect(result.year.chi).toBe('Thìn');
    expect(result.month.can).toBe('Bính');
    expect(result.month.chi).toBe('Thìn');
  });

  it('Person born before Lap Xuan uses previous year', () => {
    // Jan 15, 1988 is before Lap Xuan (~Feb 4), so Bat Tu year = 1987 = Dinh Mao
    const result = calculateFourPillars(1988, 1, 15, 0);
    expect(result.year.can).toBe('Đinh');
    expect(result.year.chi).toBe('Mão');
  });

  it('Day pillar test: 01/01/2000', () => {
    const result = calculateFourPillars(2000, 1, 1, 0);
    // JDN for 2000-01-01 = 2451545
    // Cycle index = (2451545+9) % 60 = 2451554 % 60 = 54
    // Can = 54 % 10 = 4 = Mau
    // Chi = 54 % 12 = 6 = Ngo
    expect(result.day.can).toBe('Mậu');
    expect(result.day.chi).toBe('Ngọ');
  });
});
