import { useMemo } from 'react';
import { getDailyInfo } from '../../core/calendar/dailyInfo';
import { personalizeDay } from '../../core/calendar/personalizedDay';
import { useTuViStore } from '../../store/tuViStore';
import HoangDaoGrid from './HoangDaoGrid';

const DAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const RATING_LABELS: Record<number, { text: string; color: string; bg: string }> = {
  1: { text: 'Rất xấu', color: 'text-red-400', bg: 'bg-red-900/30 border-red-800/50' },
  2: { text: 'Xấu', color: 'text-red-300', bg: 'bg-red-900/20 border-red-800/40' },
  3: { text: 'Bình thường', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800/40' },
  4: { text: 'Tốt', color: 'text-green-400', bg: 'bg-green-900/20 border-green-800/40' },
  5: { text: 'Rất tốt', color: 'text-green-300', bg: 'bg-green-900/30 border-green-800/50' },
};

export default function TodayDigest() {
  const tuViChart = useTuViStore((s) => s.tuViChart);
  const userYearChi = tuViChart?.lunarDate.yearChi ?? null;

  const now = new Date();
  const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const info = useMemo(() => getDailyInfo(now.getFullYear(), now.getMonth() + 1, now.getDate()), [dateKey]);

  const personalized = useMemo(() => {
    if (!userYearChi) return null;
    return personalizeDay(info, userYearChi);
  }, [info, userYearChi]);

  const ratingInfo = RATING_LABELS[info.overallRating];

  return (
    <div className="space-y-6">
      {/* Date header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-200">
          {DAY_NAMES[info.solar.dayOfWeek]}, {info.solar.day}/{info.solar.month}/{info.solar.year}
        </h2>
        <p className="text-gray-400 mt-1">
          Âm lịch: {info.lunar.day} tháng {info.lunar.month}
          {info.lunar.isLeapMonth ? ' (nhuận)' : ''}, {info.lunar.yearCan} {info.lunar.yearChi}
        </p>
        <p className="text-gray-500 text-sm mt-0.5">
          {info.canChiDay.can} {info.canChiDay.chi} — {info.napAmDay}
        </p>
      </div>

      {/* Overall rating badge */}
      <div className="flex justify-center">
        <div className={`inline-flex flex-col items-center px-6 py-3 rounded-xl border ${ratingInfo.bg}`}>
          <div className={`text-lg font-bold ${ratingInfo.color}`}>
            Ngày {ratingInfo.text}
          </div>
          <div className="mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`text-lg ${i < info.overallRating ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
            ))}
          </div>
        </div>
      </div>

      {/* Trực & Sao28 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500">Trực</div>
          <div className={`font-semibold ${info.truc.rating === 3 ? 'text-green-400' : info.truc.rating === 1 ? 'text-red-400' : 'text-yellow-400'}`}>
            {info.truc.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{info.truc.meaning}</div>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-3">
          <div className="text-xs text-gray-500">Sao 28</div>
          <div className={`font-semibold ${info.sao28.rating === 3 ? 'text-green-400' : info.sao28.rating === 1 ? 'text-red-400' : 'text-yellow-400'}`}>
            {info.sao28.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{info.sao28.element}</div>
        </div>
      </div>

      {/* Stars */}
      {(info.goodStars.length > 0 || info.badStars.length > 0) && (
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Sao trong ngày</h4>
          <div className="flex flex-wrap gap-2">
            {info.goodStars.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 border border-green-800/40 text-green-400">{s}</span>
            ))}
            {info.badStars.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-900/30 border border-red-800/40 text-red-400">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Special days */}
      {info.specialDays.length > 0 && (
        <div className="space-y-1">
          {info.specialDays.map(sd => (
            <div key={sd.name} className={`text-xs px-3 py-1.5 rounded-lg ${sd.type === 'bad' ? 'bg-red-900/20 text-red-300 border border-red-800/30' : 'bg-green-900/20 text-green-300 border border-green-800/30'}`}>
              {sd.name}: {sd.description}
            </div>
          ))}
        </div>
      )}

      {/* Good/Bad for */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {info.goodFor.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-2">Nên làm hôm nay</h4>
            <div className="space-y-1">
              {info.goodFor.map(g => (
                <div key={g} className="text-sm text-green-300 flex items-center gap-1.5">
                  <span className="text-green-500">✓</span> {g}
                </div>
              ))}
            </div>
          </div>
        )}
        {info.badFor.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-2">Không nên</h4>
            <div className="space-y-1">
              {info.badFor.map(b => (
                <div key={b} className="text-sm text-red-300 flex items-center gap-1.5">
                  <span className="text-red-500">✗</span> {b}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hoàng Đạo */}
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Giờ tốt hôm nay</h4>
        <div className="space-y-1 mb-4">
          {info.hoangDaoHours.filter(h => h.isHoangDao).map(h => (
            <div key={h.chi} className="text-sm text-yellow-300 flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              <span className="font-medium">{h.chi}</span>
              <span className="text-gray-500">({h.timeRange})</span>
              <span className="text-gray-400">— {h.starName}</span>
            </div>
          ))}
        </div>
        <HoangDaoGrid hours={info.hoangDaoHours} />
      </div>

      {/* Personalized */}
      {personalized && (
        <div className={`rounded-xl p-4 border ${personalized.chiClash ? 'border-red-800/50 bg-red-900/20' : 'border-purple-800/50 bg-purple-900/20'}`}>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Cá nhân hóa (tuổi {userYearChi})
          </h4>
          <p className={`text-sm ${personalized.chiClash ? 'text-red-300' : 'text-green-300'}`}>
            {personalized.chiClashNote}
          </p>
          {personalized.chiHarmonyNote && (
            <p className="text-sm text-purple-300 mt-1">{personalized.chiHarmonyNote}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {personalized.personalAdvice}
          </p>
        </div>
      )}
    </div>
  );
}
