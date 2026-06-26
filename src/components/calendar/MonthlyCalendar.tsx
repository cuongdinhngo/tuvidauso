import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';
import { useTuViStore } from '../../store/tuViStore';
import { getDailyInfo } from '../../core/calendar/dailyInfo';
import { personalizeDay } from '../../core/calendar/personalizedDay';
import type { DailyInfo } from '../../core/types';
import DayDetail from './DayDetail';

const WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const RATING_COLORS: Record<number, string> = {
  1: 'bg-bad',
  2: 'bg-bad',
  3: 'bg-warn',
  4: 'bg-good',
  5: 'bg-good',
};

export default function MonthlyCalendar() {
  const { viewMonth, viewYear, selectedDate, selectDate, navigateMonth } = useCalendarStore();
  const tuViChart = useTuViStore((s) => s.tuViChart);
  const userYearChi = tuViChart?.lunarDate.yearChi ?? null;

  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }, []);

  // Compute daily info for all days in the month
  const monthData = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const data: DailyInfo[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      data.push(getDailyInfo(viewYear, viewMonth, d));
    }
    return data;
  }, [viewYear, viewMonth]);

  // Build calendar grid (weeks)
  const weeks = useMemo(() => {
    const daysInMonth = monthData.length;
    // Day of week for 1st of month: 0=Sun, 1=Mon, ..., 6=Sat
    // We want Mon=0, so adjust: (dow + 6) % 7
    const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();
    const startOffset = (firstDow + 6) % 7; // Monday-based offset

    const grid: (DailyInfo | null)[][] = [];
    let week: (DailyInfo | null)[] = Array(startOffset).fill(null);

    for (let d = 0; d < daysInMonth; d++) {
      week.push(monthData[d]);
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      grid.push(week);
    }
    return grid;
  }, [monthData, viewYear, viewMonth]);

  const selectedInfo = useMemo(() => {
    if (!selectedDate || selectedDate.month !== viewMonth || selectedDate.year !== viewYear) return null;
    return monthData[selectedDate.day - 1] ?? null;
  }, [selectedDate, monthData, viewMonth, viewYear]);

  const personalizedInfo = useMemo(() => {
    if (!selectedInfo || !userYearChi) return null;
    return personalizeDay(selectedInfo, userYearChi);
  }, [selectedInfo, userYearChi]);

  const isToday = (day: number) =>
    viewYear === today.year && viewMonth === today.month && day === today.day;

  const isSelected = (day: number) =>
    selectedDate?.year === viewYear && selectedDate?.month === viewMonth && selectedDate?.day === day;

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigateMonth(-1)} className="p-2 text-ink-muted hover:text-gold transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-gold">
          Tháng {viewMonth} / {viewYear}
        </h2>
        <button onClick={() => navigateMonth(1)} className="p-2 text-ink-muted hover:text-gold transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_HEADERS.map((h) => (
          <div key={h} className="text-center text-xs font-medium text-ink-muted py-1">
            {h}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((info, idx) => {
          if (!info) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }
          const day = info.solar.day;
          return (
            <button
              key={day}
              onClick={() => selectDate({ year: viewYear, month: viewMonth, day })}
              className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center transition-all text-xs border ${
                isSelected(day)
                  ? 'border-gold bg-gold/40'
                  : isToday(day)
                    ? 'border-gold/50 bg-raised'
                    : 'border-transparent hover:border-white/10 hover:bg-raised'
              }`}
            >
              <span className={`font-semibold ${isToday(day) ? 'text-gold' : 'text-ink'}`}>
                {day}
              </span>
              <span className="text-[10px] text-ink-muted">
                {info.lunar.day}/{info.lunar.month}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${RATING_COLORS[info.overallRating]}`} />
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-[10px] text-ink-muted">
        <span><span className="inline-block w-2 h-2 rounded-full bg-good mr-1" />Tốt</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-warn mr-1" />Bình thường</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-bad mr-1" />Nên tránh</span>
      </div>

      {/* Day detail panel */}
      {selectedInfo && (
        <DayDetail info={selectedInfo} personalized={personalizedInfo} />
      )}
    </div>
  );
}
