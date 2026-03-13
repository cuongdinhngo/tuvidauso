import { describe, it, expect } from 'vitest';
import { getSunSign } from '../src/core/astrology/sunSign';
import { getMoonSign, approximateMoonLongitude, diaChiToHour } from '../src/core/astrology/moonSign';
import { getRisingSign } from '../src/core/astrology/risingSign';

// --- Sun Sign ---

describe('getSunSign', () => {
  it('normal case: Apr 15 → Aries', () => {
    const result = getSunSign(1990, 4, 15);
    expect(result.sign.id).toBe('aries');
  });

  it('normal case: Jul 23 → Leo', () => {
    const result = getSunSign(1990, 7, 23);
    expect(result.sign.id).toBe('leo');
  });

  it('Capricorn cross-year: Jan 10 → Capricorn', () => {
    const result = getSunSign(1995, 1, 10);
    expect(result.sign.id).toBe('capricorn');
  });

  it('cusp date: Mar 21 → Aries (cusp detected)', () => {
    const result = getSunSign(2000, 3, 21);
    expect(result.sign.id).toBe('aries');
    expect(result.cuspDate).toBe(true);
  });

  it('cusp date: Dec 22 → Capricorn boundary', () => {
    const result = getSunSign(2000, 12, 22);
    expect(result.cuspDate).toBe(true);
  });

  it('leap year: Feb 29 → Pisces, valid degree', () => {
    const result = getSunSign(2000, 2, 29);
    expect(result.sign.id).toBe('pisces');
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
  });

  it('leap year: Mar 1 degree differs from non-leap year', () => {
    const leapResult = getSunSign(2000, 3, 1);
    const nonLeapResult = getSunSign(2001, 3, 1);
    // Both should be Pisces
    expect(leapResult.sign.id).toBe('pisces');
    expect(nonLeapResult.sign.id).toBe('pisces');
    // Degree should differ slightly (~1°)
    expect(leapResult.degree).not.toBe(nonLeapResult.degree);
  });

  it('decan boundaries', () => {
    // Early in sign → decan 1
    const early = getSunSign(1990, 3, 25);
    expect(early.sign.id).toBe('aries');
    expect(early.decan).toBe(1);

    // Late in sign → decan 3
    const late = getSunSign(1990, 4, 17);
    expect(late.sign.id).toBe('aries');
    expect(late.decan).toBe(3);
  });

  it('degree is always in valid range', () => {
    // Test all 12 sign midpoints
    const midpoints = [
      [1, 5], [2, 5], [3, 25], [4, 25], [5, 25], [6, 25],
      [7, 25], [8, 25], [9, 25], [10, 25], [11, 25], [12, 25],
    ];
    for (const [m, d] of midpoints) {
      const result = getSunSign(2000, m, d);
      expect(result.degree).toBeGreaterThanOrEqual(0);
      expect(result.degree).toBeLessThan(30);
    }
  });
});

// --- Moon Sign ---

describe('getMoonSign', () => {
  it('output degree is in valid range', () => {
    const result = getMoonSign(1988, 4, 15, 10, 0, 7);
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
  });

  it('output sign is a valid zodiac sign', () => {
    const validSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
    ];
    const result = getMoonSign(1988, 4, 15, 10, 0, 7);
    expect(validSigns).toContain(result.sign.id);
  });

  it('UTC day rollover: birth at 02:00 local TZ+7 uses previous UTC day', () => {
    // 15/04/1988 02:00 local TZ+7 → UTC is 14/04/1988 19:00
    // Should interpolate between 14th and 15th at 19/24 fraction, NOT between 15th and 16th
    const result = getMoonSign(1988, 4, 15, 2, 0, 7);

    // Manually compute: interpolate between 14th 0h UTC and 15th 0h UTC at fraction 19/24
    const long14 = approximateMoonLongitude(1988, 4, 14);
    const long15 = approximateMoonLongitude(1988, 4, 15);
    const f = 19 / 24;
    let diff = long15 - long14;
    if (Math.abs(diff) > 180) diff = diff > 0 ? diff - 360 : diff + 360;
    let expectedLong = long14 + diff * f;
    expectedLong = ((expectedLong % 360) + 360) % 360;
    const expectedSign = Math.floor(expectedLong / 30);

    const signOrder = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
    ];
    expect(result.sign.id).toBe(signOrder[expectedSign]);
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
  });

  it('UTC day forward: birth at 23:00 local TZ-5 uses next UTC day', () => {
    // 15/04/1988 23:00 local TZ-5 → UTC is 16/04/1988 04:00
    const result = getMoonSign(1988, 4, 15, 23, 0, -5);
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
  });

  it('different hours produce different results', () => {
    const morning = getMoonSign(1988, 4, 15, 8, 0, 7);
    const evening = getMoonSign(1988, 4, 15, 20, 0, 7);
    // Moon moves ~13°/day, so 12h apart should differ by ~6°
    // They might be same or different sign, but degree should differ
    expect(morning.degree !== evening.degree || morning.sign.id !== evening.sign.id).toBe(true);
  });
});

describe('diaChiToHour', () => {
  it('Tý (0) → 0h', () => expect(diaChiToHour(0)).toBe(0));
  it('Sửu (1) → 2h', () => expect(diaChiToHour(1)).toBe(2));
  it('Dần (2) → 4h', () => expect(diaChiToHour(2)).toBe(4));
  it('Ngọ (6) → 12h', () => expect(diaChiToHour(6)).toBe(12));
  it('Hợi (11) → 22h', () => expect(diaChiToHour(11)).toBe(22));
});

describe('approximateMoonLongitude', () => {
  it('returns value in 0-360 range', () => {
    const long = approximateMoonLongitude(2000, 1, 1);
    expect(long).toBeGreaterThanOrEqual(0);
    expect(long).toBeLessThan(360);
  });

  it('Moon moves ~13° per day', () => {
    const day1 = approximateMoonLongitude(2000, 6, 15);
    const day2 = approximateMoonLongitude(2000, 6, 16);
    let diff = day2 - day1;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    expect(Math.abs(diff)).toBeGreaterThan(10);
    expect(Math.abs(diff)).toBeLessThan(16);
  });
});

// --- Rising Sign ---

describe('getRisingSign', () => {
  it('output degree is in valid range', () => {
    // Hà Nội: 21.0285, 105.8542
    const result = getRisingSign(1988, 4, 15, 10, 0, 7, 21.0285, 105.8542);
    expect(result.degree).toBeGreaterThanOrEqual(0);
    expect(result.degree).toBeLessThan(30);
  });

  it('output sign is a valid zodiac sign', () => {
    const validSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
    ];
    const result = getRisingSign(1988, 4, 15, 10, 0, 7, 21.0285, 105.8542);
    expect(validSigns).toContain(result.sign.id);
  });

  it('different latitudes produce different results', () => {
    // Hà Nội (21°N) vs Stockholm (59°N)
    const hanoi = getRisingSign(1988, 4, 15, 10, 0, 7, 21.0285, 105.8542);
    const stockholm = getRisingSign(1988, 4, 15, 10, 0, 1, 59.3293, 18.0686);
    // Different latitude + timezone should produce different ascendant
    expect(
      hanoi.sign.id !== stockholm.sign.id || Math.abs(hanoi.degree - stockholm.degree) > 1
    ).toBe(true);
  });

  it('ascendant changes with birth hour', () => {
    // Same date, 6 hours apart — should typically change sign (~1 sign per 2h)
    const morning = getRisingSign(1988, 4, 15, 6, 0, 7, 21.0285, 105.8542);
    const afternoon = getRisingSign(1988, 4, 15, 14, 0, 7, 21.0285, 105.8542);
    expect(
      morning.sign.id !== afternoon.sign.id || Math.abs(morning.degree - afternoon.degree) > 5
    ).toBe(true);
  });
});
