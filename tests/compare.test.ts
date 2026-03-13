import { describe, it, expect } from 'vitest';
import { buildPersonProfile } from '../src/core/compare/buildProfile';
import { calculateCompatibility } from '../src/core/compare/compatibility';
import { analyzeNapAm } from '../src/core/compare/analyzeNapAm';
import { analyzeZodiac } from '../src/core/compare/analyzeZodiac';
import { analyzeBatTu } from '../src/core/compare/analyzeBatTu';
import { analyzeMenhCung } from '../src/core/compare/analyzeMenhCung';
import { analyzeRelatedPalaces } from '../src/core/compare/analyzeRelatedPalaces';
import { analyzeTuHoa } from '../src/core/compare/analyzeTuHoa';
import { analyzeTuanTriet } from '../src/core/compare/analyzeTuanTriet';
import type { BirthInfo } from '../src/core/types';

// Test persons with known zodiac relations
// Person A: 15/04/1988 (Mau Thin - Dragon) -> Dai Lam Moc
const personA_info: BirthInfo = {
  name: 'Người A',
  solarDate: { year: 1988, month: 4, day: 15 },
  hour: 5, // Gio Ti
  gender: 'male',
};

// Person B: 10/08/1984 (Giap Ty - Rat) -> Hai Trung Kim
// Ty and Thin are Tam Hop (Thân-Tý-Thìn)
const personB_info: BirthInfo = {
  name: 'Người B',
  solarDate: { year: 1984, month: 8, day: 10 },
  hour: 3, // Gio Mao
  gender: 'female',
};

// Person C: 20/06/1990 (Canh Ngo - Horse) -> Lộ Bàng Thổ
// Ngo and Thin are not Tam Hop but Ty-Ngo is Luc Xung
const personC_info: BirthInfo = {
  name: 'Người C',
  solarDate: { year: 1990, month: 6, day: 20 },
  hour: 0, // Gio Ty
  gender: 'female',
};

describe('buildPersonProfile', () => {
  it('builds a valid profile with all fields', () => {
    const profile = buildPersonProfile('Test', personA_info);
    expect(profile.id).toBeTruthy();
    expect(profile.name).toBe('Test');
    expect(profile.lunarDate.yearCan).toBe('Mậu');
    expect(profile.lunarDate.yearChi).toBe('Thìn');
    expect(profile.tuViChart.palaces).toHaveLength(12);
    expect(profile.fourPillars.year.can).toBeTruthy();
    expect(profile.createdAt).toBeGreaterThan(0);
  });

  it('creates unique IDs for different profiles', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personA_info);
    expect(p1.id).not.toBe(p2.id);
  });
});

describe('analyzeNapAm', () => {
  it('returns a score between 0 and 100', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = analyzeNapAm(p1, p2);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.name).toBe('Nạp Âm');
    expect(result.analysis).toBeTruthy();
  });

  it('gives same-element score of 70 for same person', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('A copy', personA_info);
    const result = analyzeNapAm(p1, p2);
    expect(result.score).toBe(70); // tuong_hoa
  });
});

describe('analyzeZodiac', () => {
  it('gives high score for Tam Hop (Thin-Ty)', () => {
    const p1 = buildPersonProfile('A', personA_info); // Thin
    const p2 = buildPersonProfile('B', personB_info); // Ty
    const result = analyzeZodiac(p1, p2);
    expect(result.score).toBe(90);
    expect(result.analysis).toContain('TAM HỢP');
  });

  it('gives low score for Luc Xung (Ty-Ngo)', () => {
    const pTy = buildPersonProfile('B', personB_info); // Ty
    const pNgo = buildPersonProfile('C', personC_info); // Ngo
    const result = analyzeZodiac(pTy, pNgo);
    expect(result.score).toBe(25);
    expect(result.analysis).toContain('LỤC XUNG');
  });

  it('gives neutral score for no special relation', () => {
    const p1 = buildPersonProfile('A', personA_info); // Thin
    const p2 = buildPersonProfile('C', personC_info); // Ngo
    const result = analyzeZodiac(p1, p2);
    // Thin-Ngo: not tam hop, not luc hop, not luc xung, not luc hai, not tam hinh
    expect(result.score).toBe(60);
  });
});

describe('analyzeBatTu', () => {
  it('returns valid score and analysis', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = analyzeBatTu(p1, p2);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.name).toBe('Ngũ Hành Bát Tự');
  });
});

describe('analyzeMenhCung', () => {
  it('returns valid score and non-empty analysis', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = analyzeMenhCung(p1, p2);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.name).toBe('Cung Mệnh');
    expect(result.analysis).toBeTruthy();
    expect(result.analysis.length).toBeGreaterThan(5);
  });
});

describe('analyzeRelatedPalaces', () => {
  it('returns valid score for lover relation type', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = analyzeRelatedPalaces(p1, p2, 'lover');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.analysis).toBeTruthy();
  });

  it('returns valid score for business relation type', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = analyzeRelatedPalaces(p1, p2, 'business');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.analysis).toBeTruthy();
  });

  it('never produces awkward empty analysis string', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    for (const rel of ['lover', 'business', 'child', 'parent', 'sibling', 'friend'] as const) {
      const result = analyzeRelatedPalaces(p1, p2, rel);
      expect(result.analysis).not.toMatch(/: \.$/);
      expect(result.analysis.length).toBeGreaterThan(5);
    }
  });
});

describe('analyzeTuHoa', () => {
  it('returns valid score and analysis', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = analyzeTuHoa(p1, p2, 'lover');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.name).toBe('Tứ Hóa Chéo');
    expect(result.analysis).toBeTruthy();
  });

  it('gives fallback when same person (no special cross-interaction)', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('A copy', personA_info);
    const result = analyzeTuHoa(p1, p2, 'lover');
    expect(result.analysis).toBeTruthy();
    expect(result.analysis.length).toBeGreaterThan(5);
  });
});

describe('analyzeTuanTriet', () => {
  it('returns valid score and analysis', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = analyzeTuanTriet(p1, p2, 'lover');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.name).toBe('Tuần Triệt');
    expect(result.analysis).toBeTruthy();
  });

  it('gives positive fallback when no cross-influence', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('A copy', personA_info);
    const result = analyzeTuanTriet(p1, p2, 'friend');
    expect(result.analysis).toBeTruthy();
    expect(result.analysis.length).toBeGreaterThan(5);
  });
});

describe('calculateCompatibility', () => {
  it('returns full result with 7 categories', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const result = calculateCompatibility(p1, p2, 'lover');

    expect(result.categories).toHaveLength(7);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.overallRating).toBeGreaterThanOrEqual(1);
    expect(result.overallRating).toBeLessThanOrEqual(5);
    expect(result.ratingLabel).toBeTruthy();
    expect(Array.isArray(result.strengths)).toBe(true);
    expect(Array.isArray(result.challenges)).toBe(true);
    expect(Array.isArray(result.advice)).toBe(true);
  });

  it('produces different results for different relation types', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    const loverResult = calculateCompatibility(p1, p2, 'lover');
    const businessResult = calculateCompatibility(p1, p2, 'business');

    // Weights are different so overall scores should differ
    expect(loverResult.overallScore).not.toBe(businessResult.overallScore);
  });

  it('handles same birthday without crashing', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('A copy', personA_info);
    const result = calculateCompatibility(p1, p2, 'friend');
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.categories).toHaveLength(7);
  });

  it('Tam Hop pair should score higher than Luc Xung pair overall', () => {
    const pThin = buildPersonProfile('Thin', personA_info); // Thin
    const pTy = buildPersonProfile('Ty', personB_info);     // Ty
    const pNgo = buildPersonProfile('Ngo', personC_info);   // Ngo

    const tamHopResult = calculateCompatibility(pThin, pTy, 'lover');  // Thin-Ty tam hop
    const lucXungResult = calculateCompatibility(pTy, pNgo, 'lover');  // Ty-Ngo luc xung

    expect(tamHopResult.overallScore).toBeGreaterThan(lucXungResult.overallScore);
  });

  it.each(['business', 'child', 'parent', 'sibling'] as const)(
    'produces valid 7-category result for %s relation type',
    (relationType) => {
      const p1 = buildPersonProfile('A', personA_info);
      const p2 = buildPersonProfile('B', personB_info);
      const result = calculateCompatibility(p1, p2, relationType);
      expect(result.categories).toHaveLength(7);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.overallRating).toBeGreaterThanOrEqual(1);
      expect(result.overallRating).toBeLessThanOrEqual(5);
    }
  );

  it('all categories have non-empty analysis strings', () => {
    const p1 = buildPersonProfile('A', personA_info);
    const p2 = buildPersonProfile('B', personB_info);
    for (const rel of ['lover', 'business', 'child', 'parent', 'sibling', 'friend'] as const) {
      const result = calculateCompatibility(p1, p2, rel);
      for (const cat of result.categories) {
        expect(cat.analysis, `Empty analysis in "${cat.name}" for relation "${rel}"`).toBeTruthy();
        expect(cat.analysis.length, `Short analysis in "${cat.name}" for relation "${rel}"`).toBeGreaterThan(5);
      }
    }
  });
});
