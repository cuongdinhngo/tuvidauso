import type { DailyInfo, PersonalizedDayInfo } from '../../core/types';
import HoangDaoGrid from './HoangDaoGrid';

const DAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const RATING_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: 'Rất xấu', color: 'text-bad' },
  2: { text: 'Xấu', color: 'text-bad' },
  3: { text: 'Bình thường', color: 'text-warn' },
  4: { text: 'Tốt', color: 'text-good' },
  5: { text: 'Rất tốt', color: 'text-good' },
};

interface Props {
  info: DailyInfo;
  personalized?: PersonalizedDayInfo | null;
}

export default function DayDetail({ info, personalized }: Props) {
  const ratingInfo = RATING_LABELS[info.overallRating];

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-ink">
            {DAY_NAMES[info.solar.dayOfWeek]}, {info.solar.day}/{info.solar.month}/{info.solar.year}
          </h3>
          <p className="text-sm text-ink-muted">
            Âm lịch: {info.lunar.day}/{info.lunar.month}
            {info.lunar.isLeapMonth ? ' (nhuận)' : ''} năm {info.lunar.yearCan} {info.lunar.yearChi}
          </p>
        </div>
        <div className={`text-right ${ratingInfo.color}`}>
          <div className="text-sm font-semibold">{ratingInfo.text}</div>
          <div className="text-xs">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < info.overallRating ? 'text-warn' : 'text-ink-muted'}>★</span>
            ))}
          </div>
        </div>
      </div>

      {/* Can Chi info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div className="bg-raised rounded-lg p-2">
          <div className="text-ink-muted text-xs">Can Chi ngày</div>
          <div className="text-gold font-medium">{info.canChiDay.can} {info.canChiDay.chi}</div>
        </div>
        <div className="bg-raised rounded-lg p-2">
          <div className="text-ink-muted text-xs">Nạp Âm</div>
          <div className="text-gold font-medium">{info.napAmDay}</div>
        </div>
        <div className="bg-raised rounded-lg p-2">
          <div className="text-ink-muted text-xs">Trực</div>
          <div className={`font-medium ${info.truc.rating === 3 ? 'text-good' : info.truc.rating === 1 ? 'text-bad' : 'text-warn'}`}>
            {info.truc.name} - {info.truc.meaning}
          </div>
        </div>
        <div className="bg-raised rounded-lg p-2">
          <div className="text-ink-muted text-xs">Sao 28</div>
          <div className={`font-medium ${info.sao28.rating === 3 ? 'text-good' : info.sao28.rating === 1 ? 'text-bad' : 'text-warn'}`}>
            {info.sao28.name} ({info.sao28.element})
          </div>
        </div>
      </div>

      {/* Stars */}
      {(info.goodStars.length > 0 || info.badStars.length > 0) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {info.goodStars.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full bg-good/30 border border-good/40 text-good">{s}</span>
          ))}
          {info.badStars.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full bg-bad/30 border border-bad/40 text-bad">{s}</span>
          ))}
        </div>
      )}

      {/* Special days */}
      {info.specialDays.length > 0 && (
        <div className="space-y-1">
          {info.specialDays.map(sd => (
            <div key={sd.name} className={`text-xs px-2 py-1 rounded ${sd.type === 'bad' ? 'bg-bad/20 text-bad' : 'bg-good/20 text-good'}`}>
              {sd.name}: {sd.description}
            </div>
          ))}
        </div>
      )}

      {/* Good/Bad for */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {info.goodFor.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-good mb-1">Nên làm</h4>
            <div className="flex flex-wrap gap-1">
              {info.goodFor.map(g => (
                <span key={g} className="text-xs px-2 py-0.5 bg-good/20 border border-good/30 rounded text-good">{g}</span>
              ))}
            </div>
          </div>
        )}
        {info.badFor.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-bad mb-1">Không nên</h4>
            <div className="flex flex-wrap gap-1">
              {info.badFor.map(b => (
                <span key={b} className="text-xs px-2 py-0.5 bg-bad/20 border border-bad/30 rounded text-bad">{b}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hoàng Đạo */}
      <HoangDaoGrid hours={info.hoangDaoHours} />

      {/* Personalized */}
      {personalized && (
        <div className={`rounded-lg p-3 border ${personalized.chiClash ? 'border-bad/50 bg-bad/20' : 'border-gold/50 bg-gold/20'}`}>
          <h4 className="text-xs font-semibold text-ink-muted mb-1">Cá nhân hóa theo tuổi</h4>
          <p className={`text-sm ${personalized.chiClash ? 'text-bad' : 'text-good'}`}>
            {personalized.personalAdvice}
          </p>
          {personalized.chiHarmonyNote && (
            <p className="text-xs text-gold mt-1">{personalized.chiHarmonyNote}</p>
          )}
        </div>
      )}
    </div>
  );
}
