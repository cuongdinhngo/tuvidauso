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
      <h3 className="text-sm font-semibold text-gold mb-3">Đại Hạn</h3>
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
                isExpanded ? 'border-gold bg-gold/20' :
                isCurrent ? 'border-warn bg-warn/20' :
                'border-white/10 bg-surface hover:bg-raised'
              }`}
            >
              <div className="text-ink-muted">{mp.can} {mp.chi}</div>
              <div className={isCurrent ? 'text-warn font-semibold' : 'text-ink'}>
                {mp.startAge}-{mp.endAge}
              </div>
              <div className="text-ink-muted">{palace.name}</div>
              {isCurrent && (
                <div className="mt-1">
                  <div className="h-1 bg-raised rounded-full overflow-hidden">
                    <div className="h-full bg-warn rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-[9px] text-warn mt-0.5">Hiện tại</div>
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
          <div className="mt-3 bg-surface border border-white/10 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gold">
                  Đại Hạn: {mp.can} {mp.chi} - {palace.name}
                </h4>
                <p className="text-xs text-ink-muted">
                  Tuổi {mp.startAge}-{mp.endAge} | Năm {yearStart}-{yearEnd}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedPos(null); }}
                className="text-ink-muted hover:text-ink text-xs"
              >✕</button>
            </div>

            {/* Stars in this palace */}
            <div className="mb-3">
              <h5 className="text-xs text-ink-muted mb-1">Sao trong cung:</h5>
              <div className="flex flex-wrap gap-1">
                {palace.stars.map((s, i) => (
                  <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${
                    s.type === 'chinh' ? 'bg-warn/30 text-warn' :
                    s.type === 'cat' ? 'bg-thuy/30 text-thuy' :
                    s.type === 'sat' ? 'bg-bad/30 text-bad' :
                    'bg-raised text-ink-muted'
                  }`}>
                    {s.name}{s.brightness ? ` [${s.brightness}]` : ''}
                    {s.transform ? ` ${s.transform}` : ''}
                  </span>
                ))}
                {palace.stars.length === 0 && <span className="text-xs text-ink-muted italic">Vô chính diệu</span>}
              </div>
            </div>

            {/* Tu Hoa of this Dai Han */}
            <div>
              <h5 className="text-xs text-ink-muted mb-1">Tứ Hóa Đại Hạn (Can {mp.can}):</h5>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: 'Lộc', star: transforms.loc, cls: 'text-good' },
                  { label: 'Quyền', star: transforms.quyen, cls: 'text-bad' },
                  { label: 'Khoa', star: transforms.khoa, cls: 'text-thuy' },
                  { label: 'Kỵ', star: transforms.ky, cls: 'text-gold' },
                ].map(({ label, star, cls }) => (
                  <div key={label} className="text-xs">
                    <span className={cls}>{label}:</span> <span className="text-ink">{star}</span>
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
