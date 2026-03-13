import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Purpose } from '../../core/types';
import { findGoodDays } from '../../core/calendar/goodDayPicker';
import { useTuViStore } from '../../store/tuViStore';
import { PURPOSE_FILTERS, PURPOSE_ICONS } from '../../data/calendarData';
import DayDetail from './DayDetail';
import { getDailyInfo } from '../../core/calendar/dailyInfo';
import { personalizeDay } from '../../core/calendar/personalizedDay';

const ALL_PURPOSES = Object.keys(PURPOSE_FILTERS) as Purpose[];

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function GoodDayPicker() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [filterByAge, setFilterByAge] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const tuViChart = useTuViStore((s) => s.tuViChart);
  const userYearChi = tuViChart?.lunarDate.yearChi ?? null;

  const navigateMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setMonth(m);
    setYear(y);
    setExpandedDay(null);
  };

  const results = useMemo(() => {
    if (!purpose) return [];
    return findGoodDays(year, month, purpose, filterByAge && userYearChi ? userYearChi : undefined);
  }, [year, month, purpose, filterByAge, userYearChi]);

  const expandedInfo = useMemo(() => {
    if (expandedDay === null) return null;
    return getDailyInfo(year, month, expandedDay);
  }, [expandedDay, year, month]);

  const expandedPersonalized = useMemo(() => {
    if (!expandedInfo || !userYearChi) return null;
    return personalizeDay(expandedInfo, userYearChi);
  }, [expandedInfo, userYearChi]);

  return (
    <div className="space-y-6">
      {/* Purpose selector */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Chọn mục đích</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {ALL_PURPOSES.map((p) => (
            <button
              key={p}
              onClick={() => { setPurpose(p); setExpandedDay(null); }}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${
                purpose === p
                  ? 'border-purple-500 bg-purple-900/40 text-purple-300'
                  : 'border-gray-800 bg-gray-900/30 text-gray-400 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              <span className="mr-1.5">{PURPOSE_ICONS[p]}</span>
              {PURPOSE_FILTERS[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Month selector + filter */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth(-1)} className="p-1.5 text-gray-400 hover:text-purple-300 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-300">
            Tháng {month}/{year}
          </span>
          <button onClick={() => navigateMonth(1)} className="p-1.5 text-gray-400 hover:text-purple-300 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {userYearChi && (
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={filterByAge}
              onChange={(e) => { setFilterByAge(e.target.checked); setExpandedDay(null); }}
              className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
            />
            Lọc theo tuổi {userYearChi} (tránh ngày xung)
          </label>
        )}
      </div>

      {/* Results */}
      {purpose && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400">
            {results.length > 0
              ? `${results.length} ngày tốt cho "${PURPOSE_FILTERS[purpose].label}" trong tháng ${month}`
              : `Không tìm thấy ngày phù hợp cho "${PURPOSE_FILTERS[purpose].label}" trong tháng ${month}`}
          </h3>
          {results.map((r, idx) => (
            <div key={r.date.day}>
              <button
                onClick={() => setExpandedDay(expandedDay === r.date.day ? null : r.date.day)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  expandedDay === r.date.day
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-500">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-gray-200">
                        {r.date.day}/{r.date.month} ({DAY_NAMES[new Date(r.date.year, r.date.month - 1, r.date.day).getDay()]})
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        Âm: {r.lunar.day}/{r.lunar.month} | Trực: {r.truc.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{r.score} điểm</div>
                    <div className="text-xs">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-700'}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                {r.goodStars.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {r.goodStars.map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-900/30 text-green-400">{s}</span>
                    ))}
                  </div>
                )}
                {r.bestHours.length > 0 && (
                  <div className="text-[10px] text-gray-500 mt-1">
                    Giờ tốt: {r.bestHours.slice(0, 3).join(' | ')}
                  </div>
                )}
              </button>
              {expandedDay === r.date.day && expandedInfo && (
                <div className="mt-2">
                  <DayDetail info={expandedInfo} personalized={expandedPersonalized} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!purpose && (
        <div className="text-center py-8 text-gray-600 text-sm">
          Chọn mục đích để tìm ngày tốt
        </div>
      )}
    </div>
  );
}
