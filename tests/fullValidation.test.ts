import { describe, it, expect } from 'vitest';
import { solarToLunar } from '../src/core/calendar/solarToLunar';
import { calculateFourPillars } from '../src/core/battu/fourPillars';
import { getMenhCung } from '../src/core/tuvi/menhCung';
import { getThanCung } from '../src/core/tuvi/thanCung';
import { getCuc } from '../src/core/tuvi/cuc';
import { placeMainStars } from '../src/core/tuvi/mainStars';
import { placeAuxStars } from '../src/core/tuvi/auxStars';
import { interpretChart } from '../src/core/tuvi/interpretation';
import { arrangePalaces } from '../src/core/tuvi/twelvePalaces';
import { calculateMajorPeriods } from '../src/core/tuvi/majorPeriod';
import type { TuViChart, BirthInfo, Palace, Star } from '../src/core/types';
import { getStarTransform } from '../src/core/tuvi/fourTransforms';
import { getBrightness } from '../src/core/tuvi/brightness';

function buildChart(solarYear: number, solarMonth: number, solarDay: number, hourIndex: number, gender: 'male' | 'female'): TuViChart {
  const lunarDate = solarToLunar(solarYear, solarMonth, solarDay);
  const fourPillars = calculateFourPillars(solarYear, solarMonth, solarDay, hourIndex);
  const menh = getMenhCung(lunarDate.month, hourIndex);
  const than = getThanCung(lunarDate.month, hourIndex);
  const cuc = getCuc(lunarDate.yearCan, menh);
  const palacePositions = arrangePalaces(menh);
  const mainStars = placeMainStars(cuc.value, lunarDate.day);
  const auxStars = placeAuxStars(lunarDate.yearCan, lunarDate.yearChi, lunarDate.month, lunarDate.day, hourIndex);

  const palaces: Palace[] = palacePositions.map((pp) => {
    const stars: Star[] = [];
    for (const ms of mainStars) {
      if (ms.position === pp.position) {
        stars.push({
          name: ms.star,
          type: 'chinh',
          brightness: getBrightness(ms.star, pp.position),
          transform: getStarTransform(lunarDate.yearCan, ms.star) as any,
        });
      }
    }
    for (const as_ of auxStars) {
      if (as_.position === pp.position) {
        stars.push({ name: as_.star, type: 'phu', transform: getStarTransform(lunarDate.yearCan, as_.star) as any });
      }
    }
    return { name: pp.palace, position: pp.position, stars };
  });

  const birthInfo: BirthInfo = { solarDate: { year: solarYear, month: solarMonth, day: solarDay }, hour: hourIndex, gender };

  return {
    birthInfo, lunarDate, fourPillars, menh, than, cuc, palaces,
    menhPalaceName: 'Mệnh', thanPalaceName: palaces.find(p => p.position === than)?.name || '',
  };
}

describe('Full Chart Validation', () => {
  it('Case 1: Male 15/04/1988 Ngo hour - full flow', () => {
    const chart = buildChart(1988, 4, 15, 6, 'male');

    // Calendar
    expect(chart.lunarDate.yearCan).toBe('Mậu');
    expect(chart.lunarDate.yearChi).toBe('Thìn');
    expect(chart.lunarDate.napAm).toBe('Đại Lâm Mộc');
    expect(chart.lunarDate.month).toBe(2);
    expect(chart.lunarDate.day).toBe(29);

    // Four Pillars
    expect(chart.fourPillars.year.can).toBe('Mậu');
    expect(chart.fourPillars.year.chi).toBe('Thìn');

    // Menh, Than - lunar month 2, hour Ngo(6)
    // (2+1-6+24)%12 = 21%12 = 9 = Dau
    expect(chart.menh).toBe('Dậu');

    // Cuc
    expect(chart.cuc.value).toBeGreaterThan(0);

    // Has 14 main stars
    const allMainStars = chart.palaces.flatMap(p => p.stars.filter(s => s.type === 'chinh'));
    expect(allMainStars.length).toBe(14);

    // Has aux stars
    const allAuxStars = chart.palaces.flatMap(p => p.stars.filter(s => s.type !== 'chinh'));
    expect(allAuxStars.length).toBeGreaterThan(10);

    // Interpretation works
    const interp = interpretChart(chart);
    expect(interp.overview).toBeTruthy();
    expect(Object.keys(interp.palaceAnalysis).length).toBe(12);
  });

  it('Case 2: Female 01/01/2000 Ty hour', () => {
    const chart = buildChart(2000, 1, 1, 0, 'female');
    expect(chart.lunarDate.yearCan).toBe('Kỷ');
    expect(chart.lunarDate.yearChi).toBe('Mão');
    expect(chart.palaces.length).toBe(12);

    const allMainStars = chart.palaces.flatMap(p => p.stars.filter(s => s.type === 'chinh'));
    expect(allMainStars.length).toBe(14);
  });

  it('Case 3: Male 22/06/1985 Dan hour', () => {
    const chart = buildChart(1985, 6, 22, 2, 'male');
    expect(chart.lunarDate.yearCan).toBe('Ất');
    expect(chart.lunarDate.yearChi).toBe('Sửu');
    expect(chart.lunarDate.napAm).toBe('Hải Trung Kim');

    const allMainStars = chart.palaces.flatMap(p => p.stars.filter(s => s.type === 'chinh'));
    expect(allMainStars.length).toBe(14);
  });

  it('Case 4: Female 14/02/1990 Mui hour', () => {
    const chart = buildChart(1990, 2, 14, 7, 'female');
    expect(chart.palaces.length).toBe(12);
    expect(chart.cuc.value).toBeGreaterThanOrEqual(2);
    expect(chart.cuc.value).toBeLessThanOrEqual(6);
  });

  it('Case 5: Male 25/01/2020 Ty hour - Tet day', () => {
    const chart = buildChart(2020, 1, 25, 0, 'male');
    expect(chart.lunarDate.yearCan).toBe('Canh');
    expect(chart.lunarDate.yearChi).toBe('Tý');
    expect(chart.lunarDate.month).toBe(1);
    expect(chart.lunarDate.day).toBe(1);
  });

  it('Every chart has all 12 unique palace names', () => {
    const cases = [
      [1988, 4, 15, 6, 'male'],
      [2000, 1, 1, 0, 'female'],
      [1985, 6, 22, 2, 'male'],
    ] as const;

    for (const [y, m, d, h, g] of cases) {
      const chart = buildChart(y, m, d, h, g);
      const names = chart.palaces.map(p => p.name);
      expect(new Set(names).size).toBe(12);
    }
  });

  it('Major periods cover expected age ranges', () => {
    const chart = buildChart(1988, 4, 15, 6, 'male');
    const palacePositions = arrangePalaces(chart.menh);
    const periods = calculateMajorPeriods(
      chart.menh, chart.cuc.value, chart.lunarDate.yearCan,
      'male', 1988, palacePositions
    );

    expect(periods.length).toBe(12);
    expect(periods[0].startAge).toBe(chart.cuc.value);
    // Each period is 10 years
    for (let i = 1; i < periods.length; i++) {
      expect(periods[i].startAge).toBe(periods[i - 1].startAge + 10);
    }
  });
});
