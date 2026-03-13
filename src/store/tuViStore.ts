import { create } from 'zustand';
import type { BirthInfo, LunarDate, FourPillars, TuViChart, Palace, Star } from '../core/types';
import { solarToLunar } from '../core/calendar/solarToLunar';
import { calculateFourPillars } from '../core/battu/fourPillars';
import { getMenhCung } from '../core/tuvi/menhCung';
import { getThanCung } from '../core/tuvi/thanCung';
import { getCuc } from '../core/tuvi/cuc';
import { arrangePalaces } from '../core/tuvi/twelvePalaces';
import { placeMainStars } from '../core/tuvi/mainStars';
import { placeAuxStars } from '../core/tuvi/auxStars';
import { getStarTransform } from '../core/tuvi/fourTransforms';
import { getBrightness } from '../core/tuvi/brightness';
import { calculateMajorPeriods } from '../core/tuvi/majorPeriod';
import { calculateTuanTriet } from '../core/tuvi/tuanTriet';
import type { StarType, TransformType } from '../core/types';

export interface ChartHistoryEntry {
  name?: string;
  solarDate: { year: number; month: number; day: number };
  hour: number;
  gender: 'male' | 'female';
  yearCanChi: string;
  napAm: string;
  timestamp: number;
}

const HISTORY_KEY = 'tuvi_history';
const MAX_HISTORY = 10;

function loadHistory(): ChartHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(entry: ChartHistoryEntry) {
  const history = loadHistory();
  const dup = history.findIndex(
    (h) => h.solarDate.year === entry.solarDate.year &&
      h.solarDate.month === entry.solarDate.month &&
      h.solarDate.day === entry.solarDate.day &&
      h.hour === entry.hour && h.gender === entry.gender
  );
  if (dup >= 0) history.splice(dup, 1);
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

interface TuViStore {
  birthInfo: BirthInfo | null;
  lunarDate: LunarDate | null;
  fourPillars: FourPillars | null;
  tuViChart: TuViChart | null;
  error: string | null;
  calculate: (info: BirthInfo) => void;
  reset: () => void;
}

export const useTuViStore = create<TuViStore>((set) => ({
  birthInfo: null,
  lunarDate: null,
  fourPillars: null,
  tuViChart: null,
  error: null,

  calculate: (info: BirthInfo) => {
    try {
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
      const auxStars = placeAuxStars(lunarDate.yearCan, lunarDate.yearChi, lunarDate.month, lunarDate.day, hour);

      // 7. Build palaces with stars
      const palaces: Palace[] = palacePositions.map((pp) => {
        const starsInPalace: Star[] = [];

        // Add main stars
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

        // Add aux stars
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

      // Assign major periods to palaces
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

      // Find palace names for menh and than
      const menhPalace = palaces.find(p => p.position === menh);
      const thanPalace = palaces.find(p => p.position === than);

      // 9. Calculate Tuần & Triệt
      const tuanTriet = calculateTuanTriet(lunarDate.yearCan, lunarDate.yearChi);

      const chart: TuViChart = {
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

      saveHistory({
        name: info.name,
        solarDate: info.solarDate,
        hour: info.hour,
        gender: info.gender,
        yearCanChi: `${lunarDate.yearCan} ${lunarDate.yearChi}`,
        napAm: lunarDate.napAm,
        timestamp: Date.now(),
      });

      set({ birthInfo: info, lunarDate, fourPillars, tuViChart: chart, error: null });
    } catch (e) {
      set({ error: (e as Error).message, tuViChart: null });
    }
  },

  reset: () => set({ birthInfo: null, lunarDate: null, fourPillars: null, tuViChart: null, error: null }),
}));
