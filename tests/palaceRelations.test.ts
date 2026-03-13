import { describe, it, expect } from 'vitest';
import { getTamHopPositions, getDoiCung, getGiapCung } from '../src/core/tuvi/palaceRelations';

describe('Tam Hợp', () => {
  it('Tý → Thân, Thìn', () => {
    const result = getTamHopPositions('Tý');
    expect(result.sort()).toEqual(['Thân', 'Thìn'].sort());
  });

  it('Dần → Ngọ, Tuất', () => {
    const result = getTamHopPositions('Dần');
    expect(result.sort()).toEqual(['Ngọ', 'Tuất'].sort());
  });

  it('Tị → Dậu, Sửu', () => {
    const result = getTamHopPositions('Tị');
    expect(result.sort()).toEqual(['Dậu', 'Sửu'].sort());
  });

  it('Hợi → Mão, Mùi', () => {
    const result = getTamHopPositions('Hợi');
    expect(result.sort()).toEqual(['Mão', 'Mùi'].sort());
  });
});

describe('Đối Cung', () => {
  it('Tý ↔ Ngọ', () => {
    expect(getDoiCung('Tý')).toBe('Ngọ');
    expect(getDoiCung('Ngọ')).toBe('Tý');
  });

  it('Dần ↔ Thân', () => {
    expect(getDoiCung('Dần')).toBe('Thân');
    expect(getDoiCung('Thân')).toBe('Dần');
  });

  it('Thìn ↔ Tuất', () => {
    expect(getDoiCung('Thìn')).toBe('Tuất');
  });
});

describe('Giáp Cung', () => {
  it('Tý → Hợi, Sửu', () => {
    expect(getGiapCung('Tý')).toEqual(['Hợi', 'Sửu']);
  });

  it('Dần → Sửu, Mão', () => {
    expect(getGiapCung('Dần')).toEqual(['Sửu', 'Mão']);
  });
});
