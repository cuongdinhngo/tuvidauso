import type { HourInfo } from '../../core/types';

interface Props {
  hours: HourInfo[];
}

export default function HoangDaoGrid({ hours }: Props) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink-muted mb-2">Giờ Hoàng Đạo</h4>
      <div className="grid grid-cols-6 gap-1">
        {hours.map((h) => (
          <div
            key={h.chi}
            className={`text-center p-1.5 rounded-lg border text-xs ${
              h.isHoangDao
                ? 'border-warn/50 bg-warn/20 text-warn'
                : 'border-white/10 bg-surface text-ink-muted'
            }`}
          >
            <div className="font-semibold">{h.chi}</div>
            <div className="text-[10px] mt-0.5">{h.timeRange}</div>
            <div className={`text-[10px] mt-0.5 ${h.isHoangDao ? 'text-warn' : 'text-ink-muted'}`}>
              {h.starName}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-[10px] text-ink-muted">
        <span><span className="text-warn">■</span> Hoàng Đạo</span>
        <span><span className="text-ink-muted">■</span> Hắc Đạo</span>
      </div>
    </div>
  );
}
