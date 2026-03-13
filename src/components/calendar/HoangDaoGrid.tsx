import type { HourInfo } from '../../core/types';

interface Props {
  hours: HourInfo[];
}

export default function HoangDaoGrid({ hours }: Props) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-400 mb-2">Giờ Hoàng Đạo</h4>
      <div className="grid grid-cols-6 gap-1">
        {hours.map((h) => (
          <div
            key={h.chi}
            className={`text-center p-1.5 rounded-lg border text-xs ${
              h.isHoangDao
                ? 'border-yellow-700/50 bg-yellow-900/20 text-yellow-300'
                : 'border-gray-800 bg-gray-900/30 text-gray-600'
            }`}
          >
            <div className="font-semibold">{h.chi}</div>
            <div className="text-[10px] mt-0.5">{h.timeRange}</div>
            <div className={`text-[10px] mt-0.5 ${h.isHoangDao ? 'text-yellow-400' : 'text-gray-700'}`}>
              {h.starName}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
        <span><span className="text-yellow-400">■</span> Hoàng Đạo</span>
        <span><span className="text-gray-700">■</span> Hắc Đạo</span>
      </div>
    </div>
  );
}
