import { describe, it, expect } from 'vitest';
import { placeAuxStars } from '../src/core/tuvi/auxStars';
import { DIA_CHI } from '../src/core/types';

// Structural invariants for auxiliary stars — justified by an-sao rules and
// geometry, NOT by engine output. Designed to catch systematic offset bugs.

const TU_SINH = ['Dần', 'Tị', 'Thân', 'Hợi'];   // tứ Sinh / Mạnh
const TU_MO = ['Thìn', 'Tuất', 'Sửu', 'Mùi'];   // tứ Mộ

const idx = (c: string) => DIA_CHI.indexOf(c as typeof DIA_CHI[number]);

// Cô/Quả depend only on year Chi; other args are placeholders.
function aux(yearChi: string) {
  const stars = placeAuxStars('Giáp', yearChi, 1, 1, 0);
  const pos = (name: string) => stars.find((s) => s.star === name)!.position;
  return { co: pos('Cô Thần'), qua: pos('Quả Tú') };
}

describe('Cô Thần / Quả Tú invariants (sourced: tuvi.cohoc.net, tracuutuvi.com)', () => {
  // Canonical mapping by seasonal triple.
  const expected: Record<string, { co: string; qua: string }> = {
    'Hợi': { co: 'Dần', qua: 'Tuất' }, 'Tý': { co: 'Dần', qua: 'Tuất' }, 'Sửu': { co: 'Dần', qua: 'Tuất' },
    'Dần': { co: 'Tị', qua: 'Sửu' }, 'Mão': { co: 'Tị', qua: 'Sửu' }, 'Thìn': { co: 'Tị', qua: 'Sửu' },
    'Tị': { co: 'Thân', qua: 'Thìn' }, 'Ngọ': { co: 'Thân', qua: 'Thìn' }, 'Mùi': { co: 'Thân', qua: 'Thìn' },
    'Thân': { co: 'Hợi', qua: 'Mùi' }, 'Dậu': { co: 'Hợi', qua: 'Mùi' }, 'Tuất': { co: 'Hợi', qua: 'Mùi' },
  };

  for (const chi of DIA_CHI) {
    it(`tuổi ${chi} → Cô ${expected[chi].co}, Quả ${expected[chi].qua}`, () => {
      const { co, qua } = aux(chi);
      expect(co).toBe(expected[chi].co);
      expect(qua).toBe(expected[chi].qua);
    });

    it(`INVARIANT — tuổi ${chi}: Cô ∈ tứ Sinh, Quả ∈ tứ Mộ, Cô = Quả + 4`, () => {
      const { co, qua } = aux(chi);
      expect(TU_SINH).toContain(co);
      expect(TU_MO).toContain(qua);
      expect(((idx(co) - idx(qua)) % 12 + 12) % 12).toBe(4);
    });
  }
});
