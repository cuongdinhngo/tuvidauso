import { useState } from 'react';
import type { Palace } from '../../core/types';
import { getFourTransforms } from '../../core/tuvi/fourTransforms';

interface DaiHanTimelineProps {
  palaces: Palace[];
  currentAge: number;
  birthYear: number;
}

export default function DaiHanTimeline({ palaces, currentAge, birthYear }: DaiHanTimelineProps) {
  const [expandedPos, setExpandedPos] = useState<string | null>(null);
  const periodspalaces = palaces.filter(p => p.majorPeriod);

  return (
    <div>
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Đại Hạn</h3>
      <div className="flex overflow-x-auto gap-1 pb-2">
        {periodspalaces.map((palace) => {
          const mp = palace.majorPeriod!;
          const isCurrent = currentAge >= mp.startAge && currentAge <= mp.endAge;
          const isExpanded = expandedPos === palace.position;
          const progress = isCurrent
            ? Math.round(((currentAge - mp.startAge) / (mp.endAge - mp.startAge + 1)) * 100)
            : 0;

          return (
            <div
              key={palace.position}
              onClick={() => setExpandedPos(isExpanded ? null : palace.position)}
              className={`flex-shrink-0 w-28 p-2 rounded-lg border text-center text-xs cursor-pointer transition-all ${
                isExpanded ? 'border-purple-500 bg-purple-900/20' :
                isCurrent ? 'border-yellow-500 bg-yellow-900/20' :
                'border-gray-700 bg-gray-900/80 hover:bg-gray-800/80'
              }`}
            >
              <div className="text-gray-500">{mp.can} {mp.chi}</div>
              <div className={isCurrent ? 'text-yellow-300 font-semibold' : 'text-gray-300'}>
                {mp.startAge}-{mp.endAge}
              </div>
              <div className="text-gray-600">{palace.name}</div>
              {isCurrent && (
                <div className="mt-1">
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-[9px] text-yellow-500 mt-0.5">Hiện tại</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded detail panel */}
      {expandedPos && (() => {
        const palace = periodspalaces.find(p => p.position === expandedPos);
        if (!palace || !palace.majorPeriod) return null;
        const mp = palace.majorPeriod;
        const transforms = getFourTransforms(mp.can);
        const yearStart = birthYear + mp.startAge - 1;
        const yearEnd = birthYear + mp.endAge - 1;

        return (
          <div className="mt-3 bg-gray-900/80 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-semibold text-purple-300">
                  Đại Hạn: {mp.can} {mp.chi} — {palace.name}
                </h4>
                <p className="text-xs text-gray-500">
                  Tuổi {mp.startAge}-{mp.endAge} | Năm {yearStart}-{yearEnd}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedPos(null); }}
                className="text-gray-500 hover:text-gray-300 text-xs"
              >✕</button>
            </div>

            {/* Stars in this palace */}
            <div className="mb-3">
              <h5 className="text-xs text-gray-400 mb-1">Sao trong cung:</h5>
              <div className="flex flex-wrap gap-1">
                {palace.stars.map((s, i) => (
                  <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${
                    s.type === 'chinh' ? 'bg-yellow-900/30 text-yellow-300' :
                    s.type === 'cat' ? 'bg-blue-900/30 text-blue-300' :
                    s.type === 'sat' ? 'bg-red-900/30 text-red-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {s.name}{s.brightness ? ` [${s.brightness}]` : ''}
                    {s.transform ? ` ${s.transform}` : ''}
                  </span>
                ))}
                {palace.stars.length === 0 && <span className="text-xs text-gray-600 italic">Vô chính diệu</span>}
              </div>
            </div>

            {/* Tu Hoa of this Dai Han */}
            <div>
              <h5 className="text-xs text-gray-400 mb-1">Tứ Hóa Đại Hạn (Can {mp.can}):</h5>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: 'Lộc', star: transforms.loc, cls: 'text-green-400' },
                  { label: 'Quyền', star: transforms.quyen, cls: 'text-red-400' },
                  { label: 'Khoa', star: transforms.khoa, cls: 'text-blue-400' },
                  { label: 'Kỵ', star: transforms.ky, cls: 'text-purple-400' },
                ].map(({ label, star, cls }) => (
                  <div key={label} className="text-xs">
                    <span className={cls}>{label}:</span> <span className="text-gray-300">{star}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
