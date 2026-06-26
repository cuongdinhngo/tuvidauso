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
          { name: 'Lộc', t: transforms.loc, dot: 'text-good' },
          { name: 'Quyền', t: transforms.quyen, dot: 'text-bad' },
          { name: 'Khoa', t: transforms.khoa, dot: 'text-thuy' },
          { name: 'Kỵ', t: transforms.ky, dot: 'text-gold' },
        ].map(({ name, t, dot }) => (
          <div key={name} className="text-xs text-ink">
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
    <div className="bg-surface border border-white/10 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gold">Phân Tích Lưu Niên</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYear(y => Math.max(minYear, y - 1))}
            className="text-ink-muted hover:text-ink px-1.5 py-0.5 text-sm border border-white/10 rounded"
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
            className="w-20 bg-raised border border-white/10 rounded px-2 py-0.5 text-sm text-center text-ink"
          />
          <button
            onClick={() => setYear(y => Math.min(maxYear, y + 1))}
            className="text-ink-muted hover:text-ink px-1.5 py-0.5 text-sm border border-white/10 rounded"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Year info */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-raised rounded px-2 py-1 text-ink">
          {fortune.yearCan} {fortune.yearChi}
        </span>
        <span className="bg-raised rounded px-2 py-1 text-ink">
          Tuổi: {fortune.age}
        </span>
      </div>

      {/* 3-layer transforms */}
      <div className="space-y-3">
        <TransformRow label="Bản mệnh" transforms={fortune.natal} color="text-ink-muted" />
        {fortune.daiHan && (
          <TransformRow label="Đại hạn" transforms={fortune.daiHan} color="text-warn" />
        )}
        <TransformRow label="Lưu niên" transforms={fortune.luuNien} color="text-thuy" />
      </div>

      {/* Analysis alerts */}
      {(fortune.analysis.tripleKy || fortune.analysis.doubleKy.length > 0 ||
        fortune.analysis.songLoc || fortune.analysis.locQuyenKhoaHoi ||
        fortune.analysis.locToKy.length > 0) && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-ink-muted">Phân tích chồng lớp</div>

          {fortune.analysis.tripleKy && (
            <div className="bg-bad/20 border border-bad/40 rounded p-2 text-xs">
              <span className="text-bad font-medium">Tam Kỵ hội</span> tại cung {fortune.analysis.tripleKy.palace}
              <div className="text-ink-muted mt-0.5">{fortune.analysis.tripleKy.sources.join(' + ')}</div>
              <div className="text-bad mt-0.5">Năm cực kỳ bất lợi cho lĩnh vực này</div>
            </div>
          )}

          {fortune.analysis.doubleKy.map((dk, i) => (
            <div key={i} className="bg-bad/10 border border-bad/30 rounded p-2 text-xs">
              <span className="text-bad font-medium">Song Kỵ</span> tại cung {dk.palace}
              <div className="text-ink-muted mt-0.5">{dk.sources.join(' + ')}</div>
              <div className="text-bad mt-0.5">Cần cẩn trọng lĩnh vực này trong năm</div>
            </div>
          ))}

          {fortune.analysis.songLoc && (
            <div className="bg-good/10 border border-good/30 rounded p-2 text-xs">
              <span className="text-good font-medium">Song Lộc hội</span> tại cung {fortune.analysis.songLoc.palace}
              <div className="text-good mt-0.5">Năm rất tốt cho lĩnh vực này</div>
            </div>
          )}

          {fortune.analysis.locQuyenKhoaHoi && (
            <div className="bg-good/10 border border-good/30 rounded p-2 text-xs">
              <span className="text-good font-medium">Lộc Quyền Khoa hội</span> tại cung {fortune.analysis.locQuyenKhoaHoi.palace}
              <div className="text-good mt-0.5">Đại cát - năm phát triển mạnh mẽ</div>
            </div>
          )}

          {fortune.analysis.locToKy.map((lk, i) => (
            <div key={i} className="bg-warn/10 border border-warn/30 rounded p-2 text-xs">
              <span className="text-warn font-medium">Lộc chuyển Kỵ</span>: {lk.star}
              <div className="text-ink-muted mt-0.5">Tại cung {lk.palace} - chuyện tốt có thể biến thành xấu</div>
            </div>
          ))}
        </div>
      )}

      {/* Yearly stars */}
      {fortune.yearlyStars.length > 0 && (
        <div>
          <div className="text-xs font-medium text-ink-muted mb-1">Lưu tinh</div>
          <div className="flex flex-wrap gap-2">
            {fortune.yearlyStars.map((s, i) => (
              <span key={i} className="text-xs bg-thuy/20 text-thuy border border-thuy/40 rounded px-2 py-0.5">
                {s.star}: {s.position}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
