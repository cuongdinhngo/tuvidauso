import { useState } from 'react';
import type { Palace } from '../../core/types';
import { calculateYearlyFortune } from '../../core/tuvi/yearlyPeriod';
import { arrangePalaces } from '../../core/tuvi/twelvePalaces';

interface TieuHanCardsProps {
  yearChi: string;
  gender: 'male' | 'female';
  birthYear: number;
  menh: string;
  palaces: Palace[];
  currentYear: number;
}

export default function TieuHanCards({ yearChi, gender, birthYear, menh, palaces, currentYear }: TieuHanCardsProps) {
  const [rangeStart, setRangeStart] = useState(currentYear - 2);
  const [expandedYear, setExpandedYear] = useState<number | null>(currentYear);

  const palacePositions = arrangePalaces(menh);
  const fortunes = calculateYearlyFortune(yearChi, gender, birthYear, palacePositions, rangeStart, rangeStart + 7);

  // Build position -> palace for star lookup
  const palaceByPos: Record<string, Palace> = {};
  for (const p of palaces) {
    palaceByPos[p.position] = p;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gold">Tiểu Hạn (Lưu Niên)</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRangeStart(rangeStart - 8)}
            className="text-xs text-ink-muted hover:text-ink border border-white/10 rounded px-2 py-0.5"
          >◀</button>
          <span className="text-xs text-ink-muted">{rangeStart} - {rangeStart + 7}</span>
          <button
            onClick={() => setRangeStart(rangeStart + 8)}
            className="text-xs text-ink-muted hover:text-ink border border-white/10 rounded px-2 py-0.5"
          >▶</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {fortunes.map((yf) => {
          const isCurrentYear = yf.year === currentYear;
          const isExpanded = expandedYear === yf.year;
          const palace = palaceByPos[yf.position];

          return (
            <div key={yf.year}>
              <div
                onClick={() => setExpandedYear(isExpanded ? null : yf.year)}
                className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                  isExpanded ? 'border-gold bg-gold/20' :
                  isCurrentYear ? 'border-warn bg-warn/20' :
                  'border-white/10 bg-surface hover:bg-raised'
                }`}
              >
                <div className="flex justify-between">
                  <span className={isCurrentYear ? 'text-warn font-semibold' : 'text-ink'}>
                    {yf.year}
                    {isCurrentYear && <span className="ml-1 text-[9px] text-warn">●</span>}
                  </span>
                  <span className="text-ink-muted">{yf.yearCan} {yf.yearChi}</span>
                </div>
                <div className="text-ink-muted mt-1">
                  {yf.palace} ({yf.position}) - Tuổi {yf.age}
                </div>
                {/* Mini Tu Hoa dots */}
                <div className="flex gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-good" title={`Lộc: ${yf.transforms.loc}`} />
                  <span className="w-2 h-2 rounded-full bg-bad" title={`Quyền: ${yf.transforms.quyen}`} />
                  <span className="w-2 h-2 rounded-full bg-thuy" title={`Khoa: ${yf.transforms.khoa}`} />
                  <span className="w-2 h-2 rounded-full bg-gold" title={`Kỵ: ${yf.transforms.ky}`} />
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="mt-1 bg-surface border border-white/10 rounded-lg p-3 text-xs">
                  <h5 className="text-ink-muted mb-1">Tứ Hóa Lưu Niên (Can {yf.yearCan}):</h5>
                  <div className="space-y-0.5 mb-2">
                    <div><span className="text-good">Lộc:</span> <span className="text-ink">{yf.transforms.loc}</span></div>
                    <div><span className="text-bad">Quyền:</span> <span className="text-ink">{yf.transforms.quyen}</span></div>
                    <div><span className="text-thuy">Khoa:</span> <span className="text-ink">{yf.transforms.khoa}</span></div>
                    <div><span className="text-gold">Kỵ:</span> <span className="text-ink">{yf.transforms.ky}</span></div>
                  </div>
                  {palace && palace.stars.length > 0 && (
                    <div>
                      <h5 className="text-ink-muted mb-1">Sao trong cung {yf.palace}:</h5>
                      <div className="flex flex-wrap gap-1">
                        {palace.stars.filter(s => s.type === 'chinh').map((s, i) => (
                          <span key={i} className="text-warn/80">
                            {s.name}{s.brightness ? ` [${s.brightness}]` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
