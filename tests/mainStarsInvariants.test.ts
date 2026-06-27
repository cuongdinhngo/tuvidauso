import { describe, it, expect } from 'vitest';
import { placeMainStars } from '../src/core/tuvi/mainStars';
import { getMenhCung } from '../src/core/tuvi/menhCung';
import { getThanCung } from '../src/core/tuvi/thanCung';
import { DIA_CHI } from '../src/core/types';

/**
 * Structural invariants for the 14 main stars.
 *
 * These hold for EVERY chart by the geometry of the Tử Vi / Thiên Phủ systems and
 * require NO external reference data — they are derived from the fixed star groupings,
 * not from the engine's own output. They are the regression net for the an-sao offsets:
 * a wrong offset breaks one of them across the whole fuzz sweep.
 */

const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
const idx = (c: string) => CHI.indexOf(c as typeof CHI[number]);

const CUC_VALUES = [2, 3, 4, 5, 6];
const ALL_STARS = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh',
  'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương',
  'Thất Sát', 'Phá Quân',
];

describe('Main-star structural invariants (independent of reference data)', () => {
  for (const cuc of CUC_VALUES) {
    for (let day = 1; day <= 30; day++) {
      const stars = placeMainStars(cuc, day);
      const pos = (name: string) => idx(stars.find(s => s.star === name)!.position);

      it(`all 14 main stars placed once — cục ${cuc}, day ${day}`, () => {
        expect(stars).toHaveLength(14);
        for (const name of ALL_STARS) {
          expect(stars.filter(s => s.star === name)).toHaveLength(1);
        }
      });

      it(`Sát-Phá-Tham share a trine (chiIndex % 4) — cục ${cuc}, day ${day}`, () => {
        const that = pos('Thất Sát') % 4;
        const pha = pos('Phá Quân') % 4;
        const tham = pos('Tham Lang') % 4;
        expect(pha).toBe(that);
        expect(tham).toBe(that);
      });

      it(`Tử Vi-Vũ Khúc-Liêm Trinh share a trine (chiIndex % 4) — cục ${cuc}, day ${day}`, () => {
        const tu = pos('Tử Vi') % 4;
        const vu = pos('Vũ Khúc') % 4;
        const liem = pos('Liêm Trinh') % 4;
        expect(vu).toBe(tu);
        expect(liem).toBe(tu);
      });

      it(`Thiên Phủ opposite Thất Sát (Δ = 6) — cục ${cuc}, day ${day}`, () => {
        const diff = ((pos('Thiên Phủ') - pos('Thất Sát')) % 12 + 12) % 12;
        expect(diff).toBe(6);
      });

      it(`Tử Vi / Thiên Phủ mirror about the Dần–Thân axis — cục ${cuc}, day ${day}`, () => {
        // Reflection about the axis through Dần(2) and Thân(8): index x -> (4 - x) mod 12.
        const expectedPhu = ((4 - pos('Tử Vi')) % 12 + 12) % 12;
        expect(pos('Thiên Phủ')).toBe(expectedPhu);
      });
    }
  }
});

describe('Mệnh / Thân palace invariants (independent of reference data)', () => {
  for (let month = 1; month <= 12; month++) {
    for (let hour = 0; hour <= 11; hour++) {
      const menh = getMenhCung(month, hour);
      const than = getThanCung(month, hour);

      it(`Mệnh & Thân resolve to valid chi positions — month ${month}, hour ${hour}`, () => {
        expect(DIA_CHI).toContain(menh);
        expect(DIA_CHI).toContain(than);
      });

      it(`Mệnh đồng cung Thân iff hour is Tý/Ngọ — month ${month}, hour ${hour}`, () => {
        // Mệnh = month+1−hour, Thân = month+1+hour ⇒ they coincide ⟺ 2·hour ≡ 0 (mod 12).
        expect(menh === than).toBe(hour % 6 === 0);
      });
    }
  }
});
