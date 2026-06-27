import { describe, it, expect } from 'vitest';
import { placeAuxStars } from '../src/core/tuvi/auxStars';
import { DIA_CHI, THIEN_CAN } from '../src/core/types';

// Structural invariants + sourced values for auxiliary stars — justified by an-sao
// rules and geometry, NEVER by engine output. Designed to catch systematic offset
// bugs. Each value-level expectation cites the source it was derived from.

const TU_SINH = ['Dần', 'Tị', 'Thân', 'Hợi'];   // tứ Sinh / Mạnh
const TU_MO = ['Thìn', 'Tuất', 'Sửu', 'Mùi'];   // tứ Mộ

const idx = (c: string) => DIA_CHI.indexOf(c as typeof DIA_CHI[number]);
const delta = (a: string, b: string) => ((idx(a) - idx(b)) % 12 + 12) % 12;

// Flexible placement helper. Stars that ignore a dimension get a harmless default.
function place(opts: {
  yearCan?: string; yearChi?: string; month?: number; day?: number;
  hour?: number; gender?: 'male' | 'female'; menh?: string;
}) {
  const o = { yearCan: 'Giáp', yearChi: 'Tý', month: 1, day: 1, hour: 0, gender: 'male' as const, menh: 'Tý', ...opts };
  const stars = placeAuxStars(o.yearCan, o.yearChi, o.month, o.day, o.hour, o.gender, o.menh);
  return (name: string) => stars.find((s) => s.star === name)!.position;
}

describe('Cô Thần / Quả Tú invariants (sourced: tuvi.cohoc.net, tracuutuvi.com)', () => {
  const expected: Record<string, { co: string; qua: string }> = {
    'Hợi': { co: 'Dần', qua: 'Tuất' }, 'Tý': { co: 'Dần', qua: 'Tuất' }, 'Sửu': { co: 'Dần', qua: 'Tuất' },
    'Dần': { co: 'Tị', qua: 'Sửu' }, 'Mão': { co: 'Tị', qua: 'Sửu' }, 'Thìn': { co: 'Tị', qua: 'Sửu' },
    'Tị': { co: 'Thân', qua: 'Thìn' }, 'Ngọ': { co: 'Thân', qua: 'Thìn' }, 'Mùi': { co: 'Thân', qua: 'Thìn' },
    'Thân': { co: 'Hợi', qua: 'Mùi' }, 'Dậu': { co: 'Hợi', qua: 'Mùi' }, 'Tuất': { co: 'Hợi', qua: 'Mùi' },
  };

  for (const chi of DIA_CHI) {
    it(`tuổi ${chi} → Cô ${expected[chi].co}, Quả ${expected[chi].qua}`, () => {
      const pos = place({ yearChi: chi });
      expect(pos('Cô Thần')).toBe(expected[chi].co);
      expect(pos('Quả Tú')).toBe(expected[chi].qua);
    });

    it(`INVARIANT — tuổi ${chi}: Cô ∈ tứ Sinh, Quả ∈ tứ Mộ, Cô = Quả + 4`, () => {
      const pos = place({ yearChi: chi });
      expect(TU_SINH).toContain(pos('Cô Thần'));
      expect(TU_MO).toContain(pos('Quả Tú'));
      expect(delta(pos('Cô Thần'), pos('Quả Tú'))).toBe(4);
    });
  }
});

describe('Phá Toái (sourced: tuvi.cohoc.net, tracuulasotuvi.com)', () => {
  // Tý/Ngọ/Mão/Dậu → Tị; Dần/Thân/Tị/Hợi → Dậu; Thìn/Tuất/Sửu/Mùi → Sửu.
  const expected: Record<string, string> = {
    'Tý': 'Tị', 'Ngọ': 'Tị', 'Mão': 'Tị', 'Dậu': 'Tị',
    'Dần': 'Dậu', 'Thân': 'Dậu', 'Tị': 'Dậu', 'Hợi': 'Dậu',
    'Thìn': 'Sửu', 'Tuất': 'Sửu', 'Sửu': 'Sửu', 'Mùi': 'Sửu',
  };
  for (const chi of DIA_CHI) {
    it(`tuổi ${chi} → Phá Toái ${expected[chi]}`, () => {
      expect(place({ yearChi: chi })('Phá Toái')).toBe(expected[chi]);
    });
  }
  it('INVARIANT — Phá Toái ∈ {Tị, Dậu, Sửu} ∀ tuổi', () => {
    for (const chi of DIA_CHI) {
      expect(['Tị', 'Dậu', 'Sửu']).toContain(place({ yearChi: chi })('Phá Toái'));
    }
  });
});

describe('Đại Hao / Tiểu Hao — bộ Song Hao (sourced: tuvi.cohoc.net vòng Lộc Tồn)', () => {
  it('INVARIANT — Đại Hao luôn đối cung Tiểu Hao (Δ = 6) ∀ Can × giới tính', () => {
    for (const yearCan of THIEN_CAN) {
      for (const gender of ['male', 'female'] as const) {
        const pos = place({ yearCan, gender });
        expect(delta(pos('Đại Hao'), pos('Tiểu Hao'))).toBe(6);
      }
    }
  });
});

describe('By year Can — sourced values (tracuutuvi.com, tuvi.cohoc.net)', () => {
  it('Thiên Quan: Bính → Thìn (was Tý)', () => {
    expect(place({ yearCan: 'Bính' })('Thiên Quan')).toBe('Thìn');
  });
  it('Thiên Trù: Bính → Tý (was Tị)', () => {
    expect(place({ yearCan: 'Bính' })('Thiên Trù')).toBe('Tý');
  });
  it('Quốc Ấn: Nhâm → Mùi (was Thìn)', () => {
    expect(place({ yearCan: 'Nhâm' })('Quốc Ấn')).toBe('Mùi');
  });
  it('Thiên Phúc: Nhâm → Ngọ (was Dậu)', () => {
    expect(place({ yearCan: 'Nhâm' })('Thiên Phúc')).toBe('Ngọ');
  });
  it('INVARIANT — Đường Phù = Quốc Ấn − 3 ∀ Can (cặp bộ)', () => {
    for (const yearCan of THIEN_CAN) {
      const pos = place({ yearCan });
      expect(delta(pos('Quốc Ấn'), pos('Đường Phù'))).toBe(3);
    }
  });
});

describe('Tam Thai / Bát Tọa — neo theo Tả Phụ / Hữu Bật (sourced: tracuutuvi.com)', () => {
  it('Tam Thai tháng 1 / ngày 1 → Thìn (= Tả Phụ), not Tý', () => {
    expect(place({ month: 1, day: 1 })('Tam Thai')).toBe('Thìn');
  });
  it('INVARIANT — Tam Thai = Tả Phụ + (ngày−1) thuận', () => {
    const pos = place({ month: 6, day: 3 });
    // Tả Phụ tháng 6 = Dậu; + (3−1) = Hợi.
    expect(pos('Tả Phụ')).toBe('Dậu');
    expect(pos('Tam Thai')).toBe('Hợi');
  });
});

describe('Thiên Thương / Thiên Sứ — cố định Nô Bộc / Tật Ách (sourced: hocvienlyso.org)', () => {
  it('INVARIANT — giáp cung Thiên Di: Thiên Thương = Mệnh−7, Thiên Sứ = Mệnh−5 ∀ Mệnh', () => {
    for (const menh of DIA_CHI) {
      const pos = place({ menh });
      const thuong = idx(DIA_CHI[((idx(menh) - 7) % 12 + 12) % 12]);
      const su = idx(DIA_CHI[((idx(menh) - 5) % 12 + 12) % 12]);
      expect(idx(pos('Thiên Thương'))).toBe(thuong);
      expect(idx(pos('Thiên Sứ'))).toBe(su);
      // straddle Thiên Di (Mệnh−6): Thiên Sứ = Thiên Thương + 2
      expect(delta(pos('Thiên Sứ'), pos('Thiên Thương'))).toBe(2);
    }
  });
});

describe('Hỏa Tinh / Linh Tinh — chiều theo Dương Nam/Âm Nữ (sourced: tracuutuvi.com)', () => {
  it('Hỏa Tinh direction flips between Dương Nam and Âm Nam (fixed tuổi & giờ)', () => {
    // Same year-Chi group (Tý → group1) and hour, opposite year-Can parity.
    const duongNam = place({ yearCan: 'Giáp', yearChi: 'Tý', hour: 3, gender: 'male' }); // dương + nam → thuận
    const amNam = place({ yearCan: 'Ất', yearChi: 'Tý', hour: 3, gender: 'male' });       // âm + nam → nghịch
    expect(duongNam('Hỏa Tinh')).not.toBe(amNam('Hỏa Tinh'));
  });
  it('Hỏa Tinh & Linh Tinh run opposite directions (same chart)', () => {
    // Dương Nam: Hỏa thuận (start+h), Linh nghịch (start−h). With h≠0 the offset signs differ.
    const start = { hour: 0 };
    const h0 = place({ ...start, gender: 'male', yearCan: 'Giáp' });
    const h3 = place({ hour: 3, gender: 'male', yearCan: 'Giáp', yearChi: 'Tý' });
    // Hỏa moves forward from its group-start, Linh moves backward — verify net opposite shift.
    const hoaShift = delta(h3('Hỏa Tinh'), h0('Hỏa Tinh'));   // +3 region
    const linhShift = delta(h3('Linh Tinh'), h0('Linh Tinh')); // −3 ≡ 9 region
    expect(hoaShift).not.toBe(linhShift);
  });
});
