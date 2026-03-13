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

describe('Triệt Lộ', () => {
  it('Mậu → Tý-Sửu', () => {
    expect(getTrietLo('Mậu')).toEqual(['Tý', 'Sửu']);
  });

  it('Giáp → Thân-Dậu', () => {
    expect(getTrietLo('Giáp')).toEqual(['Thân', 'Dậu']);
  });

  it('Canh → Thân-Dậu (same as Giáp)', () => {
    expect(getTrietLo('Canh')).toEqual(['Thân', 'Dậu']);
  });

  it('Ất → Ngọ-Mùi', () => {
    expect(getTrietLo('Ất')).toEqual(['Ngọ', 'Mùi']);
  });

  it('Kỷ → Tuất-Hợi', () => {
    expect(getTrietLo('Kỷ')).toEqual(['Tuất', 'Hợi']);
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
