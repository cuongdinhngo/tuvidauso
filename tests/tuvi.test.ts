import { describe, it, expect } from 'vitest';
import { getMenhCung } from '../src/core/tuvi/menhCung';
import { getThanCung } from '../src/core/tuvi/thanCung';
import { getCuc } from '../src/core/tuvi/cuc';
import { arrangePalaces } from '../src/core/tuvi/twelvePalaces';

describe('Tu Vi Core', () => {
  // Case: Male, lunar 09/03 Mau Thin, Ngo hour (index 6)
  // Expected: Menh = Tuat, Than = Tuat
  it('Menh Cung: month 3, hour Ngo(6) = Tuat', () => {
    const result = getMenhCung(3, 6);
    expect(result).toBe('Tuất');
  });

  it('Than Cung: month 3, hour Ngo(6) = Tuat', () => {
    const result = getThanCung(3, 6);
    expect(result).toBe('Tuất');
  });

  it('Cuc: Mau + Tuat', () => {
    const result = getCuc('Mậu', 'Tuất');
    // Mau = canIndex 4, pair 4%5=4 (Mau/Quy row)
    // Tuat = chiIndex 10
    // CUC_TABLE[4][10] = 5
    expect(result.value).toBe(5);
    expect(result.name).toBe('Thổ Ngũ Cục');
  });

  it('12 palaces from Tuat', () => {
    const palaces = arrangePalaces('Tuất');
    expect(palaces[0]).toEqual({ palace: 'Mệnh', position: 'Tuất' });
    expect(palaces[1]).toEqual({ palace: 'Huynh Đệ', position: 'Dậu' });
    expect(palaces[11]).toEqual({ palace: 'Phụ Mẫu', position: 'Hợi' });
  });

  // Additional test cases
  it('Menh Cung: month 1, hour Ty(0) = Dan', () => {
    // Month 1 = Dan(2), hour Ty = stay -> Dan
    expect(getMenhCung(1, 0)).toBe('Dần');
  });

  it('Menh Cung: month 1, hour Suu(1) = Suu', () => {
    expect(getMenhCung(1, 1)).toBe('Sửu');
  });
});
