import type { Palace, TuanTriet } from '../../core/types';

interface MiniTuViChartProps {
  palaces: Palace[];
  menh: string;
  than: string;
  tuanTriet?: TuanTriet;
  highlightPalace?: string; // Palace name to highlight (e.g., "Phu Thê")
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

export default function MiniTuViChart({ palaces, menh, than, tuanTriet, highlightPalace }: MiniTuViChartProps) {
  const grid: (Palace | null)[][] = Array.from({ length: 4 }, () => Array(4).fill(null));

  for (const palace of palaces) {
    const pos = GRID_POSITIONS[palace.position];
    if (pos) grid[pos.row][pos.col] = palace;
  }

  return (
    <div className="grid grid-cols-4 gap-px bg-gray-800 border border-gray-700 rounded-lg overflow-hidden" style={{ width: 280 }}>
      {grid.flat().map((palace, idx) => {
        if (!palace) {
          // Center cells (rows 1-2, cols 1-2)
          if ((idx >= 5 && idx <= 6) || (idx >= 9 && idx <= 10)) {
            return <div key={idx} className="bg-gray-950 h-16" />;
          }
          return <div key={idx} className="bg-gray-950 h-16" />;
        }

        const isMenh = palace.position === menh;
        const isThan = palace.position === than;
        const isHighlight = highlightPalace && palace.name === highlightPalace;
        const isTuan = tuanTriet?.tuan.includes(palace.position);
        const isTriet = tuanTriet?.triet.includes(palace.position);

        const mainStars = palace.stars.filter(s => s.type === 'chinh');

        let borderClass = 'border border-transparent';
        if (isHighlight) borderClass = 'border-2 border-yellow-400';
        else if (isMenh) borderClass = 'border border-yellow-600/60';
        else if (isThan) borderClass = 'border border-blue-600/60';

        return (
          <div
            key={palace.position}
            className={`bg-gray-950 h-16 p-0.5 flex flex-col overflow-hidden ${borderClass} ${
              (isTuan || isTriet) ? 'bg-gray-950/80' : ''
            }`}
          >
            <div className="text-[8px] text-gray-500 flex justify-between">
              <span>{palace.name}</span>
              <span>{palace.position}</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {mainStars.slice(0, 2).map(star => (
                <div key={star.name} className="text-[9px] text-yellow-300 leading-tight truncate">
                  {star.name}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
