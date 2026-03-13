import type { Palace } from '../types';
import { getFourTransforms } from './fourTransforms';
import { getYearCanChi } from '../calendar/canChi';

export interface TransformPosition {
  star: string;
  position: string;
  palace: string;
}

export interface PeriodTransforms {
  can: string;
  loc: TransformPosition;
  quyen: TransformPosition;
  khoa: TransformPosition;
  ky: TransformPosition;
}

/**
 * Given a Can, compute Tứ Hóa and locate each transform star on the chart.
 */
export function computeTransformLayer(
  can: string,
  palaces: Palace[]
): PeriodTransforms {
  const transforms = getFourTransforms(can);

  const findStar = (starName: string): TransformPosition => {
    for (const p of palaces) {
      if (p.stars.some(s => s.name === starName)) {
        return { star: starName, position: p.position, palace: p.name };
      }
    }
    return { star: starName, position: '', palace: '' };
  };

  return {
    can,
    loc: findStar(transforms.loc),
    quyen: findStar(transforms.quyen),
    khoa: findStar(transforms.khoa),
    ky: findStar(transforms.ky),
  };
}

/**
 * Get Tứ Hóa for a Đại Hạn period (using the period's Can).
 */
export function getDaiHanTransforms(
  daiHanCan: string,
  palaces: Palace[]
): PeriodTransforms {
  return computeTransformLayer(daiHanCan, palaces);
}

/**
 * Get Tứ Hóa for a Lưu Niên (using the year's Can).
 */
export function getLuuNienTransforms(
  year: number,
  palaces: Palace[]
): PeriodTransforms {
  const yearCanChi = getYearCanChi(year);
  return computeTransformLayer(yearCanChi.can, palaces);
}
