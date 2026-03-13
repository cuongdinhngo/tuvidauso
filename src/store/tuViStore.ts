import { create } from 'zustand';
import type { BirthInfo, LunarDate, FourPillars, TuViChart } from '../core/types';
import { buildTuViChart } from '../core/compare/buildProfile';

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
      const chart = buildTuViChart(info);

      saveHistory({
        name: info.name,
        solarDate: info.solarDate,
        hour: info.hour,
        gender: info.gender,
        yearCanChi: `${chart.lunarDate.yearCan} ${chart.lunarDate.yearChi}`,
        napAm: chart.lunarDate.napAm,
        timestamp: Date.now(),
      });

      set({ birthInfo: info, lunarDate: chart.lunarDate, fourPillars: chart.fourPillars, tuViChart: chart, error: null });
    } catch (e) {
      set({ error: (e as Error).message, tuViChart: null });
    }
  },

  reset: () => set({ birthInfo: null, lunarDate: null, fourPillars: null, tuViChart: null, error: null }),
}));
