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
        <h3 className="text-sm font-semibold text-purple-300">Tiểu Hạn (Lưu Niên)</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRangeStart(rangeStart - 8)}
            className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 rounded px-2 py-0.5"
          >◀</button>
          <span className="text-xs text-gray-500">{rangeStart} — {rangeStart + 7}</span>
          <button
            onClick={() => setRangeStart(rangeStart + 8)}
            className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 rounded px-2 py-0.5"
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
                  isExpanded ? 'border-purple-500 bg-purple-900/20' :
                  isCurrentYear ? 'border-yellow-500 bg-yellow-900/20' :
                  'border-gray-700 bg-gray-900/80 hover:bg-gray-800/80'
                }`}
              >
                <div className="flex justify-between">
                  <span className={isCurrentYear ? 'text-yellow-300 font-semibold' : 'text-gray-300'}>
                    {yf.year}
                    {isCurrentYear && <span className="ml-1 text-[9px] text-yellow-500">●</span>}
                  </span>
                  <span className="text-gray-500">{yf.yearCan} {yf.yearChi}</span>
                </div>
                <div className="text-gray-400 mt-1">
                  {yf.palace} ({yf.position}) - Tuổi {yf.age}
                </div>
                {/* Mini Tu Hoa dots */}
                <div className="flex gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" title={`Lộc: ${yf.transforms.loc}`} />
                  <span className="w-2 h-2 rounded-full bg-red-500" title={`Quyền: ${yf.transforms.quyen}`} />
                  <span className="w-2 h-2 rounded-full bg-blue-500" title={`Khoa: ${yf.transforms.khoa}`} />
                  <span className="w-2 h-2 rounded-full bg-purple-500" title={`Kỵ: ${yf.transforms.ky}`} />
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="mt-1 bg-gray-900/80 border border-gray-700 rounded-lg p-3 text-xs">
                  <h5 className="text-gray-400 mb-1">Tứ Hóa Lưu Niên (Can {yf.yearCan}):</h5>
                  <div className="space-y-0.5 mb-2">
                    <div><span className="text-green-400">Lộc:</span> <span className="text-gray-300">{yf.transforms.loc}</span></div>
                    <div><span className="text-red-400">Quyền:</span> <span className="text-gray-300">{yf.transforms.quyen}</span></div>
                    <div><span className="text-blue-400">Khoa:</span> <span className="text-gray-300">{yf.transforms.khoa}</span></div>
                    <div><span className="text-purple-400">Kỵ:</span> <span className="text-gray-300">{yf.transforms.ky}</span></div>
                  </div>
                  {palace && palace.stars.length > 0 && (
                    <div>
                      <h5 className="text-gray-400 mb-1">Sao trong cung {yf.palace}:</h5>
                      <div className="flex flex-wrap gap-1">
                        {palace.stars.filter(s => s.type === 'chinh').map((s, i) => (
                          <span key={i} className="text-yellow-300/80">
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
