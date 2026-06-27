import { describe, it, expect } from 'vitest';
import { getTuanKhong, getTrietLo, calculateTuanTriet } from '../src/core/tuvi/tuanTriet';

describe('Tuần Không', () => {
  it('Giáp Tý (1984) — index 0, group 0 → Tuất-Hợi', () => {
    expect(getTuanKhong('Giáp', 'Tý')).toEqual(['Tuất', 'Hợi']);
  });

  it('Mậu Thìn (1988) — index 4, group 0 → Tuất-Hợi', () => {
    expect(getTuanKhong('Mậu', 'Thìn')).toEqual(['Tuất', 'Hợi']);
  });

  it('Canh Ngọ (1990) — index 6, group 0 → Tuất-Hợi', () => {
    expect(getTuanKhong('Canh', 'Ngọ')).toEqual(['Tuất', 'Hợi']);
  });

  it('Giáp Tuất (1994) — index 10, group 1 → Thân-Dậu', () => {
    expect(getTuanKhong('Giáp', 'Tuất')).toEqual(['Thân', 'Dậu']);
  });

  it('Giáp Thân (2004) — index 20, group 2 → Ngọ-Mùi', () => {
    expect(getTuanKhong('Giáp', 'Thân')).toEqual(['Ngọ', 'Mùi']);
  });

  it('Quý Hợi (1983) — index 59, group 5 → Tý-Sửu', () => {
    expect(getTuanKhong('Quý', 'Hợi')).toEqual(['Tý', 'Sửu']);
  });

  it('Giáp Ngọ (2014) — index 30, group 3 → Thìn-Tị', () => {
    expect(getTuanKhong('Giáp', 'Ngọ')).toEqual(['Thìn', 'Tị']);
  });

  it('Giáp Thìn (2024) — index 40, group 4 → Dần-Mão', () => {
    expect(getTuanKhong('Giáp', 'Thìn')).toEqual(['Dần', 'Mão']);
  });

  it('Giáp Dần (2034) — index 50, group 5 → Tý-Sửu', () => {
    expect(getTuanKhong('Giáp', 'Dần')).toEqual(['Tý', 'Sửu']);
  });
});

// Khẩu quyết (Tử Vi Đẩu Số Tân Biên; hocvienlyso.org; vietdich):
// Giáp Kỷ → Thân Dậu | Ất Canh → Ngọ Mùi | Bính Tân → Thìn Tị
// Đinh Nhâm → Dần Mão | Mậu Quý → Tý Sửu. Triệt KHÔNG bao giờ ở Tuất/Hợi.
describe('Triệt Lộ (theo khẩu quyết, không phải engine)', () => {
  const expected: Record<string, [string, string]> = {
    'Giáp': ['Thân', 'Dậu'], 'Kỷ': ['Thân', 'Dậu'],
    'Ất': ['Ngọ', 'Mùi'], 'Canh': ['Ngọ', 'Mùi'],
    'Bính': ['Thìn', 'Tị'], 'Tân': ['Thìn', 'Tị'],
    'Đinh': ['Dần', 'Mão'], 'Nhâm': ['Dần', 'Mão'],
    'Mậu': ['Tý', 'Sửu'], 'Quý': ['Tý', 'Sửu'],
  };
  for (const [can, pos] of Object.entries(expected)) {
    it(`${can} → ${pos.join('-')}`, () => {
      expect(getTrietLo(can)).toEqual(pos);
    });
  }

  it('INVARIANT: Triệt never lands on Tuất or Hợi (any Can)', () => {
    for (const can of Object.keys(expected)) {
      expect(getTrietLo(can)).not.toContain('Tuất');
      expect(getTrietLo(can)).not.toContain('Hợi');
    }
  });

  it('INVARIANT: paired Can share a Triệt zone', () => {
    expect(getTrietLo('Giáp')).toEqual(getTrietLo('Kỷ'));
    expect(getTrietLo('Ất')).toEqual(getTrietLo('Canh'));
    expect(getTrietLo('Bính')).toEqual(getTrietLo('Tân'));
    expect(getTrietLo('Đinh')).toEqual(getTrietLo('Nhâm'));
    expect(getTrietLo('Mậu')).toEqual(getTrietLo('Quý'));
  });
});

describe('calculateTuanTriet', () => {
  it('Mậu Thìn (1988)', () => {
    const result = calculateTuanTriet('Mậu', 'Thìn');
    expect(result.tuan).toEqual(['Tuất', 'Hợi']);
    expect(result.triet).toEqual(['Tý', 'Sửu']);
  });

  it('Ất Sửu (1985)', () => {
    const result = calculateTuanTriet('Ất', 'Sửu');
    expect(result.tuan).toEqual(['Tuất', 'Hợi']); // index 1, group 0
    expect(result.triet).toEqual(['Ngọ', 'Mùi']);
  });
});
