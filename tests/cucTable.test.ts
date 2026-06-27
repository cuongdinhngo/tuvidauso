import { describe, it, expect } from 'vitest';
import { getCuc } from '../src/core/tuvi/cuc';
import { THIEN_CAN, DIA_CHI } from '../src/core/types';

// Cục = ngũ-hành nạp âm của Can-Chi cung Mệnh (Can theo Ngũ Hổ Độn).
// Structural invariant (needs NO reference data): because nạp âm pairs two
// consecutive Can-Chi, a correct Cục row must consist of 6 adjacent equal pairs
// over the Mệnh chi (Tý=Sửu, Dần=Mão, Thìn=Tị, Ngọ=Mùi, Thân=Dậu, Tuất=Hợi).
// Sourced: tuvi.cohoc.net (bảng lập cục); tuvisaigon.vn bài 6.

describe('Cục — structural invariant (adjacent-pair signature)', () => {
  for (const can of THIEN_CAN) {
    it(`row for Can ${can}: 6 adjacent equal pairs over Mệnh chi`, () => {
      const row = DIA_CHI.map((chi) => getCuc(can, chi).value);
      for (let i = 0; i < 12; i += 2) {
        expect(row[i], `pair at ${DIA_CHI[i]}/${DIA_CHI[i + 1]} (Can ${can})`).toBe(row[i + 1]);
      }
    });
  }
});

describe('Cục — externally-sourced anchor values', () => {
  // Values are the published tuvi.cohoc.net grid (cross-checked by nạp-âm derivation).
  // Each Can-pair row has ≥1 anchor that ALSO fails on the pre-fix table (marked ⚑),
  // so the suite's non-tautology guarantee covers every row — not just the adjacent-pair
  // invariant. (Giáp/Tý and Mậu/Dậu happen to be correct in the pre-fix table too, so
  // they are correctness anchors only; the ⚑ anchors + the invariant carry the regression proof.)
  it('⚑ Ất/Canh row — Canh/Dần → Thổ Ngũ Cục (5) [pre-fix gave 4]', () => {
    expect(getCuc('Canh', 'Dần')).toEqual({ name: 'Thổ Ngũ Cục', value: 5 });
  });
  it('⚑ Giáp/Kỷ row — Kỷ/Tuất → Hỏa Lục Cục (6) [pre-fix gave 2]', () => {
    expect(getCuc('Kỷ', 'Tuất')).toEqual({ name: 'Hỏa Lục Cục', value: 6 });
  });
  it('⚑ Bính/Tân row — Bính/Tý → Thổ Ngũ Cục (5) [pre-fix gave 3]', () => {
    expect(getCuc('Bính', 'Tý')).toEqual({ name: 'Thổ Ngũ Cục', value: 5 });
  });
  it('⚑ Đinh/Nhâm row — Nhâm/Tý → Mộc Tam Cục (3) [pre-fix gave 4]', () => {
    expect(getCuc('Nhâm', 'Tý')).toEqual({ name: 'Mộc Tam Cục', value: 3 });
  });
  it('⚑ Mậu/Quý row — Mậu/Tý → Kim Tứ Cục (4) [pre-fix gave 5]', () => {
    expect(getCuc('Mậu', 'Tý')).toEqual({ name: 'Kim Tứ Cục', value: 4 });
  });
  // Correctness anchors (coincidentally also correct in the pre-fix table):
  it('Mậu/Dậu → Mộc Tam Cục (3)', () => {
    expect(getCuc('Mậu', 'Dậu')).toEqual({ name: 'Mộc Tam Cục', value: 3 });
  });
  it('Giáp/Tý → Thủy Nhị Cục (2)', () => {
    expect(getCuc('Giáp', 'Tý')).toEqual({ name: 'Thủy Nhị Cục', value: 2 });
  });
});
