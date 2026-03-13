import type { BirthInfo, TuViChart, Palace, Star, StarType, TransformType } from '../types';
import type { PersonProfile } from '../types/compare';
import { solarToLunar } from '../calendar/solarToLunar';
import { calculateFourPillars } from '../battu/fourPillars';
import { getMenhCung } from '../tuvi/menhCung';
import { getThanCung } from '../tuvi/thanCung';
import { getCuc } from '../tuvi/cuc';
import { arrangePalaces } from '../tuvi/twelvePalaces';
import { placeMainStars } from '../tuvi/mainStars';
import { placeAuxStars } from '../tuvi/auxStars';
import { getStarTransform } from '../tuvi/fourTransforms';
import { getBrightness } from '../tuvi/brightness';
import { calculateMajorPeriods } from '../tuvi/majorPeriod';
import { calculateTuanTriet } from '../tuvi/tuanTriet';

/**
 * Build a complete TuViChart from BirthInfo.
 * Pure function — no side effects, no store dependency.
 */
export function buildTuViChart(info: BirthInfo): TuViChart {
  const { solarDate, hour, gender } = info;

  // 1. Solar to Lunar
  const lunarDate = solarToLunar(solarDate.year, solarDate.month, solarDate.day);

  // 2. Four Pillars
  const fourPillars = calculateFourPillars(
    solarDate.year, solarDate.month, solarDate.day, hour
  );

  // 3. Menh, Than, Cuc
  const menh = getMenhCung(lunarDate.month, hour);
  const than = getThanCung(lunarDate.month, hour);
  const cuc = getCuc(lunarDate.yearCan, menh);

  // 4. Arrange 12 palaces
  const palacePositions = arrangePalaces(menh);

  // 5. Place main stars
  const mainStars = placeMainStars(cuc.value, lunarDate.day);

  // 6. Place aux stars
  const auxStars = placeAuxStars(
    lunarDate.yearCan, lunarDate.yearChi, lunarDate.month, lunarDate.day, hour
  );

  // 7. Build palaces with stars
  const palaces: Palace[] = palacePositions.map((pp) => {
    const starsInPalace: Star[] = [];

    for (const ms of mainStars) {
      if (ms.position === pp.position) {
        const transform = getStarTransform(lunarDate.yearCan, ms.star) as TransformType | undefined;
        const brightness = getBrightness(ms.star, pp.position);
        starsInPalace.push({
          name: ms.star,
          type: 'chinh' as StarType,
          brightness,
          transform,
        });
      }
    }

    for (const as_ of auxStars) {
      if (as_.position === pp.position) {
        const transform = getStarTransform(lunarDate.yearCan, as_.star) as TransformType | undefined;
        let starType: StarType = 'phu';
        if (as_.group === 'Lục Cát') starType = 'cat';
        else if (as_.group === 'Tứ Sát' || as_.group === 'Sát tinh') starType = 'sat';

        starsInPalace.push({
          name: as_.star,
          type: starType,
          transform,
          group: as_.group,
        });
      }
    }

    return {
      name: pp.palace,
      position: pp.position,
      stars: starsInPalace,
    };
  });

  // 8. Calculate major periods
  const majorPeriods = calculateMajorPeriods(
    menh, cuc.value, lunarDate.yearCan, gender, solarDate.year, palacePositions
  );

  for (const mp of majorPeriods) {
    const palace = palaces.find(p => p.position === mp.position);
    if (palace) {
      palace.majorPeriod = {
        startAge: mp.startAge,
        endAge: mp.endAge,
        can: mp.can,
        chi: mp.chi,
      };
    }
  }

  const menhPalace = palaces.find(p => p.position === menh);
  const thanPalace = palaces.find(p => p.position === than);

  // 9. Tuan & Triet
  const tuanTriet = calculateTuanTriet(lunarDate.yearCan, lunarDate.yearChi);

  return {
    birthInfo: info,
    lunarDate,
    fourPillars,
    menh,
    than,
    cuc,
    palaces,
    menhPalaceName: menhPalace?.name || 'Mệnh',
    thanPalaceName: thanPalace?.name || '',
    tuanTriet,
  };
}

/**
 * Build a PersonProfile from name + BirthInfo.
 */
export function buildPersonProfile(name: string, info: BirthInfo): PersonProfile {
  const chart = buildTuViChart(info);
  return {
    id: crypto.randomUUID(),
    name,
    birthInfo: info,
    lunarDate: chart.lunarDate,
    fourPillars: chart.fourPillars,
    tuViChart: chart,
    createdAt: Date.now(),
  };
}
