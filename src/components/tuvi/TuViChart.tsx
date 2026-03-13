import type { Palace, TuanTriet, Star } from '../../core/types';
import { useState, useMemo } from 'react';
import CungDetail from './CungDetail';
import StarFilterBar from './StarFilterBar';
import { useStarFilter } from '../../hooks/useStarFilter';
import { getTamHopPositions, getDoiCung, getGiapCung, getPalaceInfluence } from '../../core/tuvi/palaceRelations';
import { STAR_DATABASE } from '../../data/starDatabase';

interface TuViChartProps {
  palaces: Palace[];
  menh: string;
  than: string;
  cuc: { name: string; value: number };
  yearCan: string;
  yearChi: string;
  napAm: string;
  tuanTriet?: TuanTriet;
}

const GRID_POSITIONS: Record<string, { row: number; col: number }> = {
  'Tị': { row: 0, col: 0 },
  'Ngọ': { row: 0, col: 1 },
  'Mùi': { row: 0, col: 2 },
  'Thân': { row: 0, col: 3 },
  'Thìn': { row: 1, col: 0 },
  'Dậu': { row: 1, col: 3 },
  'Mão': { row: 2, col: 0 },
  'Tuất': { row: 2, col: 3 },
  'Dần': { row: 3, col: 0 },
  'Sửu': { row: 3, col: 1 },
  'Tý': { row: 3, col: 2 },
  'Hợi': { row: 3, col: 3 },
};

function getTransformBadge(transform?: string): string {
  if (!transform) return '';
  switch (transform) {
    case 'Hóa Lộc': return 'Lộc';
    case 'Hóa Quyền': return 'Quyền';
    case 'Hóa Khoa': return 'Khoa';
    case 'Hóa Kỵ': return 'Kỵ';
    default: return '';
  }
}

function getTransformColor(transform?: string): string {
  switch (transform) {
    case 'Hóa Lộc': return 'text-green-400';
    case 'Hóa Quyền': return 'text-red-400';
    case 'Hóa Khoa': return 'text-blue-400';
    case 'Hóa Kỵ': return 'text-purple-400';
    default: return '';
  }
}

function getStarColor(type: string): string {
  switch (type) {
    case 'chinh': return 'text-yellow-300 font-semibold';
    case 'cat': return 'text-blue-300';
    case 'sat': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

function StarTooltip({ star }: { star: Star }) {
  const data = STAR_DATABASE[star.name];
  if (!data) return null;
  return (
    <div className="absolute z-50 bottom-full left-0 mb-1 bg-gray-900 border border-gray-600 rounded-lg p-2 shadow-xl min-w-[180px] max-w-[240px] pointer-events-none">
      <div className="text-xs font-semibold text-white">{star.name}{star.brightness ? ` (${star.brightness})` : ''}</div>
      <div className="text-[10px] text-gray-400 mt-0.5">{data.element} — {data.yinYang}</div>
      <div className="text-[10px] text-gray-300 mt-1 leading-relaxed">{data.keywords.join(', ')}</div>
    </div>
  );
}

export default function TuViChart({ palaces, menh, than, cuc, yearCan, yearChi, napAm, tuanTriet }: TuViChartProps) {
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [hoveredStar, setHoveredStar] = useState<{ palacePos: string; starIdx: number } | null>(null);
  const { mode, setMode, customGroups, toggleGroup, filterStars } = useStarFilter();

  // Build position -> palace map
  const palaceByPos: Record<string, Palace> = {};
  for (const p of palaces) {
    palaceByPos[p.position] = p;
  }

  // Compute palace relations for the selected palace
  const relations = useMemo(() => {
    if (!selectedPalace) return null;
    const pos = selectedPalace.position;
    return {
      tamHop: getTamHopPositions(pos),
      doiCung: getDoiCung(pos),
      giapCung: getGiapCung(pos),
      influence: getPalaceInfluence(pos, palaces),
    };
  }, [selectedPalace, palaces]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 min-w-0">
        {/* Filter bar */}
        <StarFilterBar mode={mode} setMode={setMode} customGroups={customGroups} toggleGroup={toggleGroup} />

        {/* Chart Grid */}
        <div className="grid grid-cols-4 grid-rows-4 gap-0.5">
          {Object.entries(GRID_POSITIONS).map(([chi, pos]) => {
            const palace = palaceByPos[chi];
            if (!palace) return null;
            const isMenh = chi === menh;
            const isThan = chi === than && chi !== menh;
            const isTuan = tuanTriet?.tuan.includes(chi);
            const isTriet = tuanTriet?.triet.includes(chi);
            const isSelected = selectedPalace?.position === chi;
            const isTamHop = relations?.tamHop.includes(chi);
            const isDoiCung = relations?.doiCung === chi;
            const isGiapCung = relations?.giapCung.includes(chi);

            let relationRing = '';
            if (isSelected) relationRing = 'ring-2 ring-purple-400';
            else if (isTamHop) relationRing = 'ring-2 ring-green-500/60';
            else if (isDoiCung) relationRing = 'ring-2 ring-cyan-500/60';
            else if (isGiapCung) relationRing = 'ring-1 ring-amber-500/40';
            const dimmed = selectedPalace && !isSelected && !isTamHop && !isDoiCung && !isGiapCung;

            const filtered = filterStars(palace.stars);
            const maxShow = filtered.length > 10 ? 8 : filtered.length > 6 ? filtered.length : filtered.length;
            const shown = filtered.slice(0, maxShow);
            const remaining = filtered.length - maxShow;
            const isCompact = filtered.length > 6;

            return (
              <div
                key={chi}
                onClick={() => setSelectedPalace(palace)}
                style={{ gridRow: pos.row + 1, gridColumn: pos.col + 1 }}
                className={`bg-gray-900/80 border cursor-pointer hover:bg-gray-800/80 transition-all p-1.5 min-h-[140px] ${
                  isCompact ? 'text-[11px]' : 'text-xs md:text-sm'
                } ${
                  isMenh ? 'border-yellow-500/70' : isThan ? 'border-blue-500/50' : 'border-gray-700/50'
                } ${isTriet ? 'bg-red-950/20' : isTuan ? 'bg-gray-800/30' : ''} ${relationRing} ${dimmed ? 'opacity-40' : ''}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 font-mono">{chi}</span>
                    {isTuan && <span className="text-[9px] text-orange-400/70 border border-orange-800/40 rounded px-0.5">Tuần</span>}
                    {isTriet && <span className="text-[9px] text-red-400/80 border border-red-800/40 rounded px-0.5">Triệt</span>}
                  </div>
                  <span className="text-purple-400/70 truncate ml-1">{palace.name}</span>
                </div>
                {/* Stars */}
                <div className="space-y-0.5">
                  {shown.map((star, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-0.5 leading-tight relative"
                      onMouseEnter={() => setHoveredStar({ palacePos: chi, starIdx: i })}
                      onMouseLeave={() => setHoveredStar(null)}
                    >
                      <span className={getStarColor(star.type)}>{star.name}</span>
                      {star.brightness && (
                        <span className="text-gray-600 text-[10px]">{star.brightness}</span>
                      )}
                      {star.transform && (
                        <span className={`text-[10px] ${getTransformColor(star.transform)}`}>
                          {getTransformBadge(star.transform)}
                        </span>
                      )}
                      {hoveredStar?.palacePos === chi && hoveredStar?.starIdx === i && (
                        <StarTooltip star={star} />
                      )}
                    </div>
                  ))}
                  {remaining > 0 && (
                    <span className="text-gray-600" title={filtered.slice(maxShow).map(s => s.name).join(', ')}>
                      +{remaining} sao
                    </span>
                  )}
                </div>
                {/* Dai Han */}
                {palace.majorPeriod && (
                  <div className="mt-auto pt-1 text-gray-600 text-xs">
                    {palace.majorPeriod.startAge}-{palace.majorPeriod.endAge}
                  </div>
                )}
              </div>
            );
          })}

          {/* Center block */}
          <div
            className="bg-gray-950/90 border border-purple-900/30 p-3 flex flex-col justify-center items-center text-center"
            style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
          >
            <div className="text-xl font-bold text-purple-300 mb-2">Tử Vi Đẩu Số</div>
            <div className="space-y-1 text-sm">
              <div><span className="text-gray-500">Mệnh:</span> <span className="text-yellow-300">{menh}</span></div>
              <div><span className="text-gray-500">Thân:</span> <span className="text-blue-300">{than}</span></div>
              <div><span className="text-gray-500">Cục:</span> <span className="text-gray-200">{cuc.name}</span></div>
              <div><span className="text-gray-500">Nạp âm:</span> <span className="text-gray-200">{napAm}</span></div>
              <div><span className="text-gray-500">Can Chi:</span> <span className="text-gray-200">{yearCan} {yearChi}</span></div>
              {tuanTriet && (
                <>
                  <div><span className="text-orange-400/70">Tuần:</span> <span className="text-gray-300">{tuanTriet.tuan[0]}-{tuanTriet.tuan[1]}</span></div>
                  <div><span className="text-red-400/70">Triệt:</span> <span className="text-gray-300">{tuanTriet.triet[0]}-{tuanTriet.triet[1]}</span></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
          <span><span className="text-yellow-300">■</span> Chính tinh</span>
          <span><span className="text-blue-300">■</span> Cát tinh</span>
          <span><span className="text-red-400">■</span> Sát tinh</span>
          <span><span className="text-gray-400">■</span> Phụ tinh</span>
          <span className="border-l border-gray-700 pl-4"><span className="text-green-400">Lộc</span> <span className="text-red-400">Quyền</span> <span className="text-blue-400">Khoa</span> <span className="text-purple-400">Kỵ</span></span>
          <span className="border-l border-gray-700 pl-4"><span className="text-orange-400/70">Tuần</span> <span className="text-red-400/80">Triệt</span></span>
        </div>
      </div>

      {/* Detail panel */}
      {selectedPalace && (
        <CungDetail
          palace={selectedPalace}
          isMenh={selectedPalace.position === menh}
          isThan={selectedPalace.position === than}
          onClose={() => setSelectedPalace(null)}
          influence={relations?.influence}
          tuanTriet={tuanTriet}
        />
      )}
    </div>
  );
}
