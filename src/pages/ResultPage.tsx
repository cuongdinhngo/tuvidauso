import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTuViStore } from '../store/tuViStore';
import Tabs from '../components/shared/Tabs';
import TuViChart from '../components/tuvi/TuViChart';
import { DIA_CHI_HOURS } from '../core/types';
import { countElements } from '../core/battu/fiveElements';
import { getFourTransforms } from '../core/tuvi/fourTransforms';
// arrangePalaces used internally by TieuHanCards
import { interpretChart } from '../core/tuvi/interpretation';
import DaiHanTimeline from '../components/tuvi/DaiHanTimeline';
import TieuHanCards from '../components/tuvi/TieuHanCards';
import LuanGiaiTab from '../components/tuvi/LuanGiaiTab';
import YearlyDetailPanel from '../components/tuvi/YearlyDetailPanel';
import BatTuTab from '../components/battu/BatTuTab';
import NumerologyTab from '../components/numerology/NumerologyTab';

const CON_GIAP: Record<string, string> = {
  'Tý': 'Chuột', 'Sửu': 'Trâu', 'Dần': 'Hổ', 'Mão': 'Mèo',
  'Thìn': 'Rồng', 'Tị': 'Rắn', 'Ngọ': 'Ngựa', 'Mùi': 'Dê',
  'Thân': 'Khỉ', 'Dậu': 'Gà', 'Tuất': 'Chó', 'Hợi': 'Lợn',
};

export default function ResultPage() {
  const navigate = useNavigate();
  const chart = useTuViStore((s) => s.tuViChart);
  const lunarDate = useTuViStore((s) => s.lunarDate);
  const fourPillars = useTuViStore((s) => s.fourPillars);
  const numerologyChart = useTuViStore((s) => s.numerologyChart);

  useEffect(() => {
    if (!chart) navigate('/input');
  }, [chart, navigate]);

  if (!chart || !lunarDate || !fourPillars) return null;

  const { birthInfo, palaces, menh, than, cuc } = chart;
  const elements = countElements(fourPillars);
  const transforms = getFourTransforms(lunarDate.yearCan);

  const interpretation = interpretChart(chart);
  const currentYear = new Date().getFullYear();

  const tabs = [
    {
      label: 'Tổng Quan',
      content: (() => {
        const NGU_HANH_COLORS: Record<string, string> = {
          'Kim': '#C0C0C0', 'Mộc': '#22C55E', 'Thủy': '#3B82F6',
          'Hỏa': '#EF4444', 'Thổ': '#EAB308',
        };
        const maxElement = Math.max(...Object.values(elements), 1);
        const maxKey = Object.entries(elements).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
        const minKey = Object.entries(elements).reduce((a, b) => b[1] < a[1] ? b : a, ['', Infinity]);

        // Find which palace each transform star is in
        const findStarPalace = (starName: string) => {
          for (const p of palaces) {
            if (p.stars.some(s => s.name === starName)) return p;
          }
          return null;
        };

        const TU_HOA_EXPLAIN: Record<string, string> = {
          'Hóa Lộc': 'Tài lộc, may mắn, cơ hội',
          'Hóa Quyền': 'Quyền lực, uy tín, chủ động',
          'Hóa Khoa': 'Học vấn, danh tiếng, quý nhân',
          'Hóa Kỵ': 'Trở ngại, thị phi, cần cẩn trọng',
        };

        return (
        <div className="space-y-6">
          {/* Quick Stats Row */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Mệnh', value: menh, cls: 'text-yellow-300 border-yellow-800/50' },
              { label: 'Thân', value: than, cls: 'text-blue-300 border-blue-800/50' },
              { label: 'Cục', value: cuc.name, cls: 'text-gray-200 border-gray-700' },
              ...(chart.tuanTriet ? [
                { label: 'Tuần', value: `${chart.tuanTriet.tuan[0]}-${chart.tuanTriet.tuan[1]}`, cls: 'text-orange-400 border-orange-800/40' },
                { label: 'Triệt', value: `${chart.tuanTriet.triet[0]}-${chart.tuanTriet.triet[1]}`, cls: 'text-red-400 border-red-800/40' },
              ] : []),
            ].map(({ label, value, cls }) => (
              <div key={label} className={`bg-gray-900/80 border rounded-lg px-3 py-1.5 text-sm ${cls}`}>
                <span className="text-gray-500 text-xs mr-1">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Info card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Dương lịch', value: `${birthInfo.solarDate.day}/${birthInfo.solarDate.month}/${birthInfo.solarDate.year}` },
              { label: 'Âm lịch', value: `${lunarDate.day}/${lunarDate.month} (${lunarDate.yearCan} ${lunarDate.yearChi})` },
              { label: 'Con giáp', value: `${lunarDate.yearChi} (${CON_GIAP[lunarDate.yearChi]})` },
              { label: 'Nạp âm', value: lunarDate.napAm },
              { label: 'Cung Mệnh', value: `${chart.menhPalaceName} (${menh})` },
              { label: 'Cung Thân', value: `${chart.thanPalaceName} (${than})` },
              { label: 'Cục', value: cuc.name },
              { label: 'Giờ sinh', value: DIA_CHI_HOURS[birthInfo.hour]?.name || '' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-900/80 border border-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm text-gray-200 font-medium">{value}</div>
              </div>
            ))}
          </div>

          {/* Bat Tu mini */}
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Bát Tự (Tứ Trụ)</h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              {(['Năm', 'Tháng', 'Ngày', 'Giờ'] as const).map((label, i) => {
                const pillar = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour][i];
                return (
                  <div key={label} className="bg-gray-900/80 border border-gray-800 rounded-lg p-2">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="text-yellow-300 font-semibold">{pillar.can}</div>
                    <div className="text-purple-300">{pillar.chi}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ngu Hanh horizontal bars */}
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Ngũ Hành</h3>
            <div className="space-y-2">
              {Object.entries(elements).map(([element, count]) => {
                const pct = maxElement > 0 ? (count / maxElement) * 100 : 0;
                const isMax = element === maxKey[0] && count > 0;
                const isMin = element === minKey[0] && count <= 1;
                return (
                  <div key={element} className="flex items-center gap-2">
                    <span className="text-sm text-gray-300 w-8">{element}</span>
                    <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: NGU_HANH_COLORS[element] }}
                      />
                      <span className="absolute inset-0 flex items-center pl-2 text-xs font-medium text-white drop-shadow">
                        {count}
                      </span>
                    </div>
                    {isMax && <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-800/50 rounded px-1.5 py-0.5">Vượng</span>}
                    {isMin && <span className="text-[10px] bg-red-900/50 text-red-400 border border-red-800/50 rounded px-1.5 py-0.5">Thiếu</span>}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {maxKey[0]} vượng ({maxKey[1]}){minKey[1] as number <= 1 ? `, ${minKey[0]} yếu (${minKey[1]}) → Cần bổ sung ${minKey[0]}` : ''}
            </p>
          </div>

          {/* Tu Hoa summary with palace info */}
          <div>
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Tứ Hóa</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: 'Hóa Lộc', star: transforms.loc, color: 'text-green-400 border-green-900/50', dot: '🟢' },
                { label: 'Hóa Quyền', star: transforms.quyen, color: 'text-red-400 border-red-900/50', dot: '🔴' },
                { label: 'Hóa Khoa', star: transforms.khoa, color: 'text-blue-400 border-blue-900/50', dot: '🔵' },
                { label: 'Hóa Kỵ', star: transforms.ky, color: 'text-purple-400 border-purple-900/50', dot: '🟣' },
              ].map(({ label, star, color, dot }) => {
                const palace = findStarPalace(star);
                return (
                  <div key={label} className={`bg-gray-900/80 border rounded-lg p-3 ${color}`}>
                    <div className="text-xs opacity-70">{dot} {label}</div>
                    <div className="text-sm font-medium mt-0.5">{star}</div>
                    {palace && (
                      <div className="text-xs text-gray-400 mt-1">→ {palace.name} ({palace.position})</div>
                    )}
                    <div className="text-[10px] text-gray-500 mt-0.5">{TU_HOA_EXPLAIN[label]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        );
      })(),
    },
    {
      label: 'Lá Số',
      content: (
        <TuViChart
          palaces={palaces}
          menh={menh}
          than={than}
          cuc={cuc}
          yearCan={lunarDate.yearCan}
          yearChi={lunarDate.yearChi}
          napAm={lunarDate.napAm}
          tuanTriet={chart.tuanTriet}
        />
      ),
    },
    {
      label: 'Luận Giải',
      content: <LuanGiaiTab chart={chart} interpretation={interpretation} />,
    },
    {
      label: 'Vận Hạn',
      content: (
        <div className="space-y-6">
          <DaiHanTimeline
            palaces={palaces}
            currentAge={currentYear - birthInfo.solarDate.year + 1}
            birthYear={birthInfo.solarDate.year}
          />
          <TieuHanCards
            yearChi={lunarDate.yearChi}
            gender={birthInfo.gender}
            birthYear={birthInfo.solarDate.year}
            menh={menh}
            palaces={palaces}
            currentYear={currentYear}
          />
          <YearlyDetailPanel chart={chart} currentYear={currentYear} />
        </div>
      ),
    },
    {
      label: 'Bát Tự',
      content: (
        <BatTuTab
          fourPillars={fourPillars}
          gender={birthInfo.gender}
          solarYear={birthInfo.solarDate.year}
          solarMonth={birthInfo.solarDate.month}
          solarDay={birthInfo.solarDate.day}
          hourIndex={birthInfo.hour}
        />
      ),
    },
    {
      label: 'Thần Số Học',
      content: numerologyChart ? (
        <NumerologyTab
          chart={numerologyChart}
          birthInfo={birthInfo}
          tuViChart={chart}
          hasName={!!birthInfo.name?.trim()}
        />
      ) : null,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-purple-300">
            {birthInfo.name ? `Lá số — ${birthInfo.name}` : 'Lá Số Tử Vi'}
          </h1>
          <p className="text-sm text-gray-500">
            {birthInfo.solarDate.day}/{birthInfo.solarDate.month}/{birthInfo.solarDate.year}
            {' '}• Giờ {DIA_CHI_HOURS[birthInfo.hour]?.name}
            {' '}• {birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}
            {' '}• {lunarDate.yearCan} {lunarDate.yearChi} ({lunarDate.napAm})
          </p>
        </div>
        <Link
          to="/input"
          className="text-sm text-purple-400 hover:text-purple-300 border border-purple-700 rounded-lg px-3 py-1"
        >
          Lập lá số mới
        </Link>
      </div>

      <Tabs tabs={tabs} defaultIndex={1} />
    </div>
  );
}
