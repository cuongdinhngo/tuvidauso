import { useState, useMemo } from 'react';
import type { TuViChart } from '../../core/types';
import { analyzeYear } from '../../core/tuvi/layeredAnalysis';
import type { PeriodTransforms } from '../../core/tuvi/periodTransforms';

interface YearlyDetailPanelProps {
  chart: TuViChart;
  currentYear: number;
}

function TransformRow({ label, transforms, color }: { label: string; transforms: PeriodTransforms; color: string }) {
  return (
    <div className="space-y-1">
      <div className={`text-xs font-medium ${color}`}>{label} (Can {transforms.can})</div>
      <div className="grid grid-cols-2 gap-1">
        {[
          { name: 'Lộc', t: transforms.loc, dot: 'text-green-400' },
          { name: 'Quyền', t: transforms.quyen, dot: 'text-red-400' },
          { name: 'Khoa', t: transforms.khoa, dot: 'text-blue-400' },
          { name: 'Kỵ', t: transforms.ky, dot: 'text-purple-400' },
        ].map(({ name, t, dot }) => (
          <div key={name} className="text-xs text-gray-300">
            <span className={dot}>{name}</span>: {t.star}{t.palace ? ` → ${t.palace}` : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function YearlyDetailPanel({ chart, currentYear }: YearlyDetailPanelProps) {
  const [year, setYear] = useState(currentYear);
  const birthYear = chart.birthInfo.solarDate.year;
  const minYear = birthYear;
  const maxYear = birthYear + 80;

  const fortune = useMemo(() => analyzeYear(year, chart), [year, chart]);

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-purple-300">Phân Tích Lưu Niên</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYear(y => Math.max(minYear, y - 1))}
            className="text-gray-400 hover:text-white px-1.5 py-0.5 text-sm border border-gray-700 rounded"
          >
            ◀
          </button>
          <input
            type="number"
            value={year}
            onChange={e => {
              const v = parseInt(e.target.value);
              if (v >= minYear && v <= maxYear) setYear(v);
            }}
            className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-sm text-center text-white"
          />
          <button
            onClick={() => setYear(y => Math.min(maxYear, y + 1))}
            className="text-gray-400 hover:text-white px-1.5 py-0.5 text-sm border border-gray-700 rounded"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Year info */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-gray-800 rounded px-2 py-1 text-gray-300">
          {fortune.yearCan} {fortune.yearChi}
        </span>
        <span className="bg-gray-800 rounded px-2 py-1 text-gray-300">
          Tuổi: {fortune.age}
        </span>
      </div>

      {/* 3-layer transforms */}
      <div className="space-y-3">
        <TransformRow label="Bản mệnh" transforms={fortune.natal} color="text-gray-400" />
        {fortune.daiHan && (
          <TransformRow label="Đại hạn" transforms={fortune.daiHan} color="text-orange-400" />
        )}
        <TransformRow label="Lưu niên" transforms={fortune.luuNien} color="text-cyan-400" />
      </div>

      {/* Analysis alerts */}
      {(fortune.analysis.tripleKy || fortune.analysis.doubleKy.length > 0 ||
        fortune.analysis.songLoc || fortune.analysis.locQuyenKhoaHoi ||
        fortune.analysis.locToKy.length > 0) && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-400">Phân tích chồng lớp</div>

          {fortune.analysis.tripleKy && (
            <div className="bg-red-900/20 border border-red-900/40 rounded p-2 text-xs">
              <span className="text-red-400 font-medium">Tam Kỵ hội</span> tại cung {fortune.analysis.tripleKy.palace}
              <div className="text-gray-400 mt-0.5">{fortune.analysis.tripleKy.sources.join(' + ')}</div>
              <div className="text-red-300 mt-0.5">Năm cực kỳ bất lợi cho lĩnh vực này</div>
            </div>
          )}

          {fortune.analysis.doubleKy.map((dk, i) => (
            <div key={i} className="bg-red-900/10 border border-red-900/30 rounded p-2 text-xs">
              <span className="text-red-400 font-medium">Song Kỵ</span> tại cung {dk.palace}
              <div className="text-gray-400 mt-0.5">{dk.sources.join(' + ')}</div>
              <div className="text-red-300 mt-0.5">Cần cẩn trọng lĩnh vực này trong năm</div>
            </div>
          ))}

          {fortune.analysis.songLoc && (
            <div className="bg-green-900/10 border border-green-900/30 rounded p-2 text-xs">
              <span className="text-green-400 font-medium">Song Lộc hội</span> tại cung {fortune.analysis.songLoc.palace}
              <div className="text-green-300 mt-0.5">Năm rất tốt cho lĩnh vực này</div>
            </div>
          )}

          {fortune.analysis.locQuyenKhoaHoi && (
            <div className="bg-green-900/10 border border-green-900/30 rounded p-2 text-xs">
              <span className="text-green-400 font-medium">Lộc Quyền Khoa hội</span> tại cung {fortune.analysis.locQuyenKhoaHoi.palace}
              <div className="text-green-300 mt-0.5">Đại cát — năm phát triển mạnh mẽ</div>
            </div>
          )}

          {fortune.analysis.locToKy.map((lk, i) => (
            <div key={i} className="bg-yellow-900/10 border border-yellow-900/30 rounded p-2 text-xs">
              <span className="text-yellow-400 font-medium">Lộc chuyển Kỵ</span>: {lk.star}
              <div className="text-gray-400 mt-0.5">Tại cung {lk.palace} — chuyện tốt có thể biến thành xấu</div>
            </div>
          ))}
        </div>
      )}

      {/* Yearly stars */}
      {fortune.yearlyStars.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-400 mb-1">Lưu tinh</div>
          <div className="flex flex-wrap gap-2">
            {fortune.yearlyStars.map((s, i) => (
              <span key={i} className="text-xs bg-cyan-900/20 text-cyan-300 border border-cyan-800/40 rounded px-2 py-0.5">
                {s.star}: {s.position}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
