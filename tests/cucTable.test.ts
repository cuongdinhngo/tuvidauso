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
  // tuvi.cohoc.net grid + nạp-âm derivation (3 independent methods agree).
  it('Canh year, Mệnh Dần → Thổ Ngũ Cục (5)', () => {
    expect(getCuc('Canh', 'Dần')).toEqual({ name: 'Thổ Ngũ Cục', value: 5 });
  });
  it('Mậu year, Mệnh Dậu → Mộc Tam Cục (3)', () => {
    expect(getCuc('Mậu', 'Dậu')).toEqual({ name: 'Mộc Tam Cục', value: 3 });
  });
  it('Giáp year, Mệnh Tý → Thủy Nhị Cục (2)', () => {
    expect(getCuc('Giáp', 'Tý')).toEqual({ name: 'Thủy Nhị Cục', value: 2 });
  });
  it('Kỷ Mùi (year Kỷ), Mệnh Tuất → Hỏa Lục Cục (6)', () => {
    // tuvisaigon.vn bài 6 worked example.
    expect(getCuc('Kỷ', 'Tuất')).toEqual({ name: 'Hỏa Lục Cục', value: 6 });
  });
});
