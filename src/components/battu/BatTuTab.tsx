import { useState, useMemo } from 'react';
import type { FourPillars } from '../../core/types';
import { DIA_CHI_HOURS } from '../../core/types';
import { getElement, getYinYang, countElements, GENERATION_CYCLE, OVERCOMING_CYCLE } from '../../core/battu/fiveElements';
import type { Element } from '../../core/battu/fiveElements';
import { getHiddenStems } from '../../core/battu/hiddenStems';
import { getTenGod } from '../../core/battu/tenGods';
import { calculateBatTuMajorFates } from '../../core/battu/majorFate';

interface BatTuTabProps {
  fourPillars: FourPillars;
  gender: 'male' | 'female';
  solarYear: number;
  solarMonth: number;
  solarDay: number;
  hourIndex: number;
}

const ELEMENT_COLORS: Record<Element, string> = {
  'Kim': 'text-gray-300 bg-gray-800/50',
  'Mộc': 'text-green-400 bg-green-900/20',
  'Thủy': 'text-blue-400 bg-blue-900/20',
  'Hỏa': 'text-red-400 bg-red-900/20',
  'Thổ': 'text-yellow-400 bg-yellow-900/20',
};

const ELEMENT_DOT: Record<Element, string> = {
  'Kim': 'bg-gray-400', 'Mộc': 'bg-green-500', 'Thủy': 'bg-blue-500',
  'Hỏa': 'bg-red-500', 'Thổ': 'bg-yellow-500',
};

const ELEMENT_DIRECTION: Record<Element, string> = {
  'Kim': 'Tây', 'Mộc': 'Đông', 'Thủy': 'Bắc', 'Hỏa': 'Nam', 'Thổ': 'Trung tâm',
};

const ELEMENT_NUMBERS: Record<Element, string> = {
  'Kim': '4, 9', 'Mộc': '3, 8', 'Thủy': '1, 6', 'Hỏa': '2, 7', 'Thổ': '5, 0',
};

const BAR_COLORS: Record<Element, string> = {
  'Kim': '#C0C0C0', 'Mộc': '#22C55E', 'Thủy': '#3B82F6', 'Hỏa': '#EF4444', 'Thổ': '#EAB308',
};

function getGenerates(el: Element): Element {
  return GENERATION_CYCLE[el];
}

function getGeneratedBy(el: Element): Element {
  // Find what generates el: X generates el means GENERATION_CYCLE[X] === el
  return (Object.entries(GENERATION_CYCLE).find(([_, v]) => v === el)?.[0] || 'Thổ') as Element;
}

function analyzeDayMaster(fourPillars: FourPillars): {
  strength: 'Vượng' | 'Nhược';
  supportCount: number;
  restrainCount: number;
  dungThan: Element;
  hyThan: Element;
  kyThan: Element[];
} {
  const dayElement = getElement(fourPillars.day.can);
  const elements = countElements(fourPillars);
  const generatedBy = getGeneratedBy(dayElement);

  // Support: same element + element that generates day master
  const supportCount = elements[dayElement] + elements[generatedBy];
  // Restrain: element that overcomes day master + element day master generates (drains)
  const overcomesDay = (Object.entries(OVERCOMING_CYCLE).find(([_, v]) => v as unknown as Element === dayElement)?.[0] || 'Thổ') as Element;
  const dayDrains = getGenerates(dayElement);
  const restrainCount = elements[overcomesDay] + elements[dayDrains];

  const strength = supportCount >= restrainCount ? 'Vượng' as const : 'Nhược' as const;

  // Dung Than: if weak, use element that generates; if strong, use element that overcomes
  const dungThan = strength === 'Nhược' ? generatedBy : OVERCOMING_CYCLE[dayElement];
  const hyThan = strength === 'Nhược' ? dayElement : dayDrains;
  const kyThan = strength === 'Nhược'
    ? [OVERCOMING_CYCLE[dayElement], dayDrains].filter((v, i, a) => a.indexOf(v) === i) as Element[]
    : [dayElement, generatedBy].filter((v, i, a) => a.indexOf(v) === i) as Element[];

  return { strength, supportCount, restrainCount, dungThan, hyThan, kyThan };
}

export default function BatTuTab({ fourPillars, gender, solarYear, solarMonth, solarDay, hourIndex }: BatTuTabProps) {
  const [expandedFate, setExpandedFate] = useState<number | null>(null);
  const dayElement = getElement(fourPillars.day.can);
  const elements = countElements(fourPillars);
  const maxElement = Math.max(...Object.values(elements), 1);
  const analysis = useMemo(() => analyzeDayMaster(fourPillars), [fourPillars]);
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - solarYear;

  const majorFates = useMemo(() =>
    calculateBatTuMajorFates(fourPillars, gender, solarYear, solarMonth, solarDay),
    [fourPillars, gender, solarYear, solarMonth, solarDay]
  );

  const pillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];
  const labels = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
  const dateValues = [
    String(solarYear),
    String(solarMonth).padStart(2, '0'),
    String(solarDay).padStart(2, '0'),
    DIA_CHI_HOURS[hourIndex]?.time || '',
  ];

  return (
    <div className="space-y-6">
      {/* Four Pillars Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left py-2 pr-4"></th>
              {labels.map((label, i) => (
                <th key={label} className={`py-2 px-3 text-center ${i === 2 ? 'bg-purple-900/20 rounded-t' : ''}`}>
                  <div>{i === 2 ? <span className="text-yellow-400">Nhật Chủ</span> : label}</div>
                  <div className="text-[11px] text-gray-500 font-normal mt-0.5">{dateValues[i]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-gray-500 pr-4 py-1">Thiên Can</td>
              {pillars.map((p, i) => {
                const el = getElement(p.can);
                return (
                  <td key={i} className={`text-center py-1 ${i === 2 ? 'bg-purple-900/20 font-bold text-lg' : ''}`}>
                    <span className={ELEMENT_COLORS[el].split(' ')[0]}>{p.can}</span>
                    <span className={`inline-block w-2 h-2 rounded-full ml-1 ${ELEMENT_DOT[el]}`} />
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="text-gray-500 pr-4 py-1">Địa Chi</td>
              {pillars.map((p, i) => {
                const el = getElement(p.chi);
                return (
                  <td key={i} className={`text-center py-1 ${i === 2 ? 'bg-purple-900/20' : ''}`}>
                    <span className={ELEMENT_COLORS[el].split(' ')[0]}>{p.chi}</span>
                    <span className={`inline-block w-2 h-2 rounded-full ml-1 ${ELEMENT_DOT[el]}`} />
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="text-gray-500 pr-4 py-1">Tàng Can</td>
              {pillars.map((p, i) => (
                <td key={i} className={`text-center py-1 text-gray-400 text-xs ${i === 2 ? 'bg-purple-900/20' : ''}`}>
                  {getHiddenStems(p.chi).map((h, j) => (
                    <span key={j}>
                      {j > 0 && ', '}
                      <span className={ELEMENT_COLORS[getElement(h)].split(' ')[0]}>{h}</span>
                    </span>
                  ))}
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-gray-500 pr-4 py-1">Ngũ Hành</td>
              {pillars.map((p, i) => (
                <td key={i} className={`text-center py-1 text-gray-400 text-xs ${i === 2 ? 'bg-purple-900/20' : ''}`}>
                  {getElement(p.can)}/{getElement(p.chi)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-gray-500 pr-4 py-1">Thập Thần</td>
              {pillars.map((p, i) => (
                <td key={i} className={`text-center py-1 text-gray-400 text-xs ${i === 2 ? 'bg-purple-900/20 text-yellow-400 font-medium' : ''}`}>
                  {i === 2 ? 'Nhật Chủ' : getTenGod(fourPillars.day.can, p.can)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Day Master + Ngu Hanh Analysis */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold text-purple-300">Phân Tích Ngũ Hành</h3>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400">Nhật Chủ:</span>
          <span className={`font-bold text-lg ${ELEMENT_COLORS[dayElement].split(' ')[0]}`}>
            {fourPillars.day.can}
          </span>
          <span className="text-gray-400">({dayElement} - {getYinYang(fourPillars.day.can)})</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            analysis.strength === 'Vượng' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}>
            {analysis.strength}
          </span>
        </div>

        {/* Element bars */}
        <div className="space-y-1.5">
          {(Object.entries(elements) as [Element, number][]).map(([element, count]) => (
            <div key={element} className="flex items-center gap-2">
              <span className={`text-xs w-8 ${ELEMENT_COLORS[element].split(' ')[0]}`}>{element}</span>
              <div className="flex-1 h-5 bg-gray-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max((count / maxElement) * 100, 4)}%`, backgroundColor: BAR_COLORS[element] }}
                />
                <span className="absolute inset-0 flex items-center pl-2 text-[10px] font-medium text-white drop-shadow">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dung Than analysis */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-500">Dụng Thần:</span>{' '}
            <span className={ELEMENT_COLORS[analysis.dungThan].split(' ')[0]}>{analysis.dungThan}</span>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-500">Hỷ Thần:</span>{' '}
            <span className={ELEMENT_COLORS[analysis.hyThan].split(' ')[0]}>{analysis.hyThan}</span>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-500">Kỵ Thần:</span>{' '}
            {analysis.kyThan.map((k, i) => (
              <span key={i}>
                {i > 0 && ', '}
                <span className={ELEMENT_COLORS[k].split(' ')[0]}>{k}</span>
              </span>
            ))}
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-500">Hướng hợp:</span>{' '}
            <span className="text-gray-300">
              {ELEMENT_DIRECTION[analysis.dungThan]}, {ELEMENT_DIRECTION[analysis.hyThan]}
            </span>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <span className="text-gray-500">Số hợp:</span>{' '}
            <span className="text-gray-300">{ELEMENT_NUMBERS[analysis.dungThan]}</span>
          </div>
        </div>
      </div>

      {/* Dai Van Timeline */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-purple-300">Đại Vận Bát Tự</h3>

        <div className="flex gap-1 overflow-x-auto pb-2">
          {majorFates.map((fate, i) => {
            const isCurrent = currentAge >= fate.startAge && currentAge <= fate.endAge;
            const fateEl = getElement(fate.canChi.can);
            return (
              <button
                key={i}
                onClick={() => setExpandedFate(expandedFate === i ? null : i)}
                className={`flex-shrink-0 rounded-lg p-2 text-center min-w-[72px] border transition-all ${
                  isCurrent
                    ? 'border-yellow-500/70 bg-yellow-900/20'
                    : expandedFate === i
                    ? 'border-purple-500/50 bg-purple-900/20'
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
              >
                <div className={`text-xs font-medium ${ELEMENT_COLORS[fateEl].split(' ')[0]}`}>
                  {fate.canChi.can} {fate.canChi.chi}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {fate.startAge}-{fate.endAge}
                </div>
                {isCurrent && <div className="text-[9px] text-yellow-400 mt-0.5">Hiện tại</div>}
              </button>
            );
          })}
        </div>

        {/* Expanded fate detail */}
        {expandedFate !== null && majorFates[expandedFate] && (() => {
          const fate = majorFates[expandedFate];
          const fateEl = getElement(fate.canChi.can);
          // Determine relationship to day master
          const generates = GENERATION_CYCLE[fateEl] === dayElement;
          const overcomes = OVERCOMING_CYCLE[fateEl] === dayElement;
          const sameEl = fateEl === dayElement;
          const generatedBy = GENERATION_CYCLE[dayElement] === fateEl;
          const overcomesMe = OVERCOMING_CYCLE[dayElement] === fateEl;

          let relationship = '';
          if (sameEl) relationship = `${fateEl} = Nhật Chủ → Tăng cường bản thân`;
          else if (generates) relationship = `${fateEl} sinh ${dayElement} → Hỗ trợ Nhật Chủ`;
          else if (overcomes) relationship = `${fateEl} khắc ${dayElement} → Áp lực lên Nhật Chủ`;
          else if (generatedBy) relationship = `${dayElement} sinh ${fateEl} → Nhật Chủ bị tiết khí`;
          else if (overcomesMe) relationship = `${dayElement} khắc ${fateEl} → Nhật Chủ phải nỗ lực`;

          return (
            <div className="bg-gray-800/50 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${ELEMENT_COLORS[fateEl].split(' ')[0]}`}>
                  {fate.canChi.can} {fate.canChi.chi}
                </span>
                <span className="text-gray-500">({fateEl})</span>
                <span className="text-gray-500">Tuổi {fate.startAge}-{fate.endAge}</span>
              </div>
              {relationship && <p className="text-gray-300">{relationship}</p>}
              <p className="text-gray-400">
                {analysis.strength === 'Nhược' && generates
                  ? 'Đại vận tốt — hỗ trợ Nhật Chủ yếu.'
                  : analysis.strength === 'Nhược' && overcomes
                  ? 'Đại vận khó khăn — thêm áp lực lên Nhật Chủ yếu.'
                  : analysis.strength === 'Vượng' && overcomes
                  ? 'Đại vận tốt — cân bằng Nhật Chủ vượng.'
                  : analysis.strength === 'Vượng' && generates
                  ? 'Đại vận cần thận trọng — Nhật Chủ vốn đã vượng.'
                  : 'Đại vận bình thường.'}
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
