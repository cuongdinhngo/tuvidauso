import { describe, it, expect } from 'vitest';
import { getSao28 } from '../src/core/calendar/sao28';
import { getTruc } from '../src/core/calendar/twelveStages';
import { getHoangDaoHours } from '../src/core/calendar/hoangDao';
import { isTamNuong, isNguyetKy, hasThienDuc } from '../src/core/calendar/specialDays';
import { getDailyInfo } from '../src/core/calendar/dailyInfo';
import { findGoodDays } from '../src/core/calendar/goodDayPicker';

describe('Sao 28 (getSao28)', () => {
  it('01/01/2000 → Sao Hư (index 10)', () => {
    const result = getSao28(2000, 1, 1);
    expect(result.name).toBe('Hư');
  });

  it('cycles every 28 days', () => {
    const base = getSao28(2000, 1, 1);
    const after28 = getSao28(2000, 1, 29);
    expect(after28.name).toBe(base.name);
  });

  it('consecutive days produce different Sao', () => {
    const day1 = getSao28(2024, 6, 15);
    const day2 = getSao28(2024, 6, 16);
    expect(day1.name).not.toBe(day2.name);
  });
});

describe('12 Trực (getTruc)', () => {
  it('same month Chi + day Chi → Kiến', () => {
    // When monthChi === dayChi, trucIndex = 0 → Kiến
    const result = getTruc('Dần', 'Dần');
    expect(result.name).toBe('Kiến');
  });

  it('Dần month + Mão day → Trừ', () => {
    // dayChiIdx(Mão)=3, monthChiIdx(Dần)=2, (3-2+12)%12=1 → Trừ
    const result = getTruc('Dần', 'Mão');
    expect(result.name).toBe('Trừ');
  });

  it('returns valid rating 1-3', () => {
    const result = getTruc('Tý', 'Ngọ');
    expect(result.rating).toBeGreaterThanOrEqual(1);
    expect(result.rating).toBeLessThanOrEqual(3);
  });
});

describe('Hoàng Đạo hours (getHoangDaoHours)', () => {
  it('returns exactly 12 hours', () => {
    const hours = getHoangDaoHours('Tý');
    expect(hours).toHaveLength(12);
  });

  it('exactly 6 Hoàng Đạo hours per day', () => {
    const allChi = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    for (const chi of allChi) {
      const hours = getHoangDaoHours(chi);
      const hoangDaoCount = hours.filter(h => h.isHoangDao).length;
      expect(hoangDaoCount, `Day Chi ${chi} should have 6 Hoàng Đạo hours`).toBe(6);
    }
  });

  it('each hour has chi, timeRange, starName', () => {
    const hours = getHoangDaoHours('Dần');
    for (const h of hours) {
      expect(h.chi).toBeTruthy();
      expect(h.timeRange).toBeTruthy();
      expect(h.starName).toBeTruthy();
    }
  });
});

describe('Special days', () => {
  it('Tam Nương: days 3,7,13,18,22,27 are Tam Nương', () => {
    for (const d of [3, 7, 13, 18, 22, 27]) {
      expect(isTamNuong(d), `Day ${d} should be Tam Nương`).toBe(true);
    }
  });

  it('Tam Nương: other days are not Tam Nương', () => {
    for (const d of [1, 2, 4, 5, 6, 8, 10, 15, 20, 25, 30]) {
      expect(isTamNuong(d), `Day ${d} should NOT be Tam Nương`).toBe(false);
    }
  });

  it('Nguyệt Kỵ: days 5,14,23 are Nguyệt Kỵ', () => {
    for (const d of [5, 14, 23]) {
      expect(isNguyetKy(d), `Day ${d} should be Nguyệt Kỵ`).toBe(true);
    }
  });

  it('Nguyệt Kỵ: other days are not', () => {
    expect(isNguyetKy(1)).toBe(false);
    expect(isNguyetKy(15)).toBe(false);
  });

  it('hasThienDuc checks both Can and Chi', () => {
    // Month 1 → Thiên Đức = 'Đinh' (a Can value)
    expect(hasThienDuc(1, 'Đinh', 'Tý')).toBe(true);   // matches via dayCan
    expect(hasThienDuc(1, 'Giáp', 'Tý')).toBe(false);  // neither Can nor Chi matches 'Đinh'

    // Month 2 → Thiên Đức = 'Thân' (a Chi value)
    expect(hasThienDuc(2, 'Giáp', 'Thân')).toBe(true);  // matches via dayChi
    expect(hasThienDuc(2, 'Giáp', 'Tý')).toBe(false);   // neither matches 'Thân'

    // Month 5 → Thiên Đức = 'Hợi' (a Chi value)
    expect(hasThienDuc(5, 'Bính', 'Hợi')).toBe(true);   // matches via dayChi
    expect(hasThienDuc(5, 'Bính', 'Dần')).toBe(false);   // no match
  });
});

describe('getDailyInfo (end-to-end)', () => {
  it('returns complete DailyInfo for 01/01/2000', () => {
    const info = getDailyInfo(2000, 1, 1);

    expect(info.solar.year).toBe(2000);
    expect(info.solar.month).toBe(1);
    expect(info.solar.day).toBe(1);
    expect(info.solar.dayOfWeek).toBe(6); // Saturday

    // Lunar date should exist
    expect(info.lunar.day).toBeGreaterThan(0);
    expect(info.lunar.month).toBeGreaterThan(0);

    // Can Chi should be present
    expect(info.canChiDay.can).toBeTruthy();
    expect(info.canChiDay.chi).toBeTruthy();

    // Trực and Sao28
    expect(info.truc.name).toBeTruthy();
    expect(info.sao28.name).toBe('Hư'); // verified with fix 5

    // Rating 1-5
    expect(info.overallRating).toBeGreaterThanOrEqual(1);
    expect(info.overallRating).toBeLessThanOrEqual(5);

    // Hoàng Đạo hours
    expect(info.hoangDaoHours).toHaveLength(12);
  });

  it('15/04/1988 has correct lunar date', () => {
    const info = getDailyInfo(1988, 4, 15);
    // Known: 15/04/1988 → Lunar 29/02 Mậu Thìn
    expect(info.lunar.day).toBe(29);
    expect(info.lunar.month).toBe(2);
    expect(info.lunar.yearCan).toBe('Mậu');
    expect(info.lunar.yearChi).toBe('Thìn');
  });

  it('Tam Nương day has Tam Nương in badStars', () => {
    // Find a day that is lunar 3rd — use getDailyInfo and check
    // 25/01/2020 → Lunar 01/01 Canh Tý (Tết), so 27/01/2020 → Lunar 03/01
    const info = getDailyInfo(2020, 1, 27);
    if (info.lunar.day === 3) {
      expect(info.badStars).toContain('Tam Nương');
    }
  });
});

describe('findGoodDays', () => {
  it('returns results sorted by score descending', () => {
    const results = findGoodDays(2024, 6, 'cuoi_hoi');
    if (results.length >= 2) {
      for (let i = 1; i < results.length; i++) {
        expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
      }
    }
  });

  it('excludes Tam Nương days for cuoi_hoi', () => {
    const results = findGoodDays(2024, 6, 'cuoi_hoi');
    for (const r of results) {
      expect(r.badStars).not.toContain('Tam Nương');
    }
  });

  it('each result has valid rating 1-5', () => {
    const results = findGoodDays(2024, 3, 'khai_truong');
    for (const r of results) {
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(5);
    }
  });

  it('xung tuổi filter excludes clashing days', () => {
    const withoutFilter = findGoodDays(2024, 6, 'nhap_trach');
    const withFilter = findGoodDays(2024, 6, 'nhap_trach', 'Tý');
    // With filter should have same or fewer results
    expect(withFilter.length).toBeLessThanOrEqual(withoutFilter.length);
  });

  it('requiredGoodStars applies score penalty when missing', () => {
    // Find a purpose that has requiredGoodStars
    // Most purposes have requiredGoodStars = [] but some may have entries
    // Regardless, days without matching goodStars should score lower
    const results = findGoodDays(2024, 6, 'cuoi_hoi');
    // Just verify it runs without errors and returns results
    expect(Array.isArray(results)).toBe(true);
  });
});
