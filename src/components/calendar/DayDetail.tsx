import type { DailyInfo, PersonalizedDayInfo } from '../../core/types';
import HoangDaoGrid from './HoangDaoGrid';

const DAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const RATING_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: 'Rất xấu', color: 'text-red-400' },
  2: { text: 'Xấu', color: 'text-red-300' },
  3: { text: 'Bình thường', color: 'text-yellow-400' },
  4: { text: 'Tốt', color: 'text-green-400' },
  5: { text: 'Rất tốt', color: 'text-green-300' },
};

interface Props {
  info: DailyInfo;
  personalized?: PersonalizedDayInfo | null;
}

export default function DayDetail({ info, personalized }: Props) {
  const ratingInfo = RATING_LABELS[info.overallRating];

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-200">
            {DAY_NAMES[info.solar.dayOfWeek]}, {info.solar.day}/{info.solar.month}/{info.solar.year}
          </h3>
          <p className="text-sm text-gray-400">
            Âm lịch: {info.lunar.day}/{info.lunar.month}
            {info.lunar.isLeapMonth ? ' (nhuận)' : ''} năm {info.lunar.yearCan} {info.lunar.yearChi}
          </p>
        </div>
        <div className={`text-right ${ratingInfo.color}`}>
          <div className="text-sm font-semibold">{ratingInfo.text}</div>
          <div className="text-xs">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < info.overallRating ? 'text-yellow-400' : 'text-gray-700'}>★</span>
            ))}
          </div>
        </div>
      </div>

      {/* Can Chi info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div className="bg-gray-800/50 rounded-lg p-2">
          <div className="text-gray-500 text-xs">Can Chi ngày</div>
          <div className="text-purple-300 font-medium">{info.canChiDay.can} {info.canChiDay.chi}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2">
          <div className="text-gray-500 text-xs">Nạp Âm</div>
          <div className="text-purple-300 font-medium">{info.napAmDay}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2">
          <div className="text-gray-500 text-xs">Trực</div>
          <div className={`font-medium ${info.truc.rating === 3 ? 'text-green-400' : info.truc.rating === 1 ? 'text-red-400' : 'text-yellow-400'}`}>
            {info.truc.name} — {info.truc.meaning}
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2">
          <div className="text-gray-500 text-xs">Sao 28</div>
          <div className={`font-medium ${info.sao28.rating === 3 ? 'text-green-400' : info.sao28.rating === 1 ? 'text-red-400' : 'text-yellow-400'}`}>
            {info.sao28.name} ({info.sao28.element})
          </div>
        </div>
      </div>

      {/* Stars */}
      {(info.goodStars.length > 0 || info.badStars.length > 0) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {info.goodStars.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full bg-green-900/30 border border-green-800/40 text-green-400">{s}</span>
          ))}
          {info.badStars.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full bg-red-900/30 border border-red-800/40 text-red-400">{s}</span>
          ))}
        </div>
      )}

      {/* Special days */}
      {info.specialDays.length > 0 && (
        <div className="space-y-1">
          {info.specialDays.map(sd => (
            <div key={sd.name} className={`text-xs px-2 py-1 rounded ${sd.type === 'bad' ? 'bg-red-900/20 text-red-300' : 'bg-green-900/20 text-green-300'}`}>
              {sd.name}: {sd.description}
            </div>
          ))}
        </div>
      )}

      {/* Good/Bad for */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {info.goodFor.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-green-400 mb-1">Nên làm</h4>
            <div className="flex flex-wrap gap-1">
              {info.goodFor.map(g => (
                <span key={g} className="text-xs px-2 py-0.5 bg-green-900/20 border border-green-800/30 rounded text-green-300">{g}</span>
              ))}
            </div>
          </div>
        )}
        {info.badFor.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-red-400 mb-1">Không nên</h4>
            <div className="flex flex-wrap gap-1">
              {info.badFor.map(b => (
                <span key={b} className="text-xs px-2 py-0.5 bg-red-900/20 border border-red-800/30 rounded text-red-300">{b}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hoàng Đạo */}
      <HoangDaoGrid hours={info.hoangDaoHours} />

      {/* Personalized */}
      {personalized && (
        <div className={`rounded-lg p-3 border ${personalized.chiClash ? 'border-red-800/50 bg-red-900/20' : 'border-purple-800/50 bg-purple-900/20'}`}>
          <h4 className="text-xs font-semibold text-gray-400 mb-1">Cá nhân hóa theo tuổi</h4>
          <p className={`text-sm ${personalized.chiClash ? 'text-red-300' : 'text-green-300'}`}>
            {personalized.personalAdvice}
          </p>
          {personalized.chiHarmonyNote && (
            <p className="text-xs text-purple-300 mt-1">{personalized.chiHarmonyNote}</p>
          )}
        </div>
      )}
    </div>
  );
}
