import { useState } from 'react';
import type { Big3Result } from '../../core/astrology/types';
import { MOON_SIGN_DESCRIPTIONS, RISING_SIGN_DESCRIPTIONS, getBig3Analysis } from '../../data/big3Data';

const ELEMENT_LABELS: Record<string, { name: string; color: string }> = {
  fire:  { name: 'Hỏa', color: 'text-red-400' },
  earth: { name: 'Thổ', color: 'text-yellow-600' },
  air:   { name: 'Khí', color: 'text-cyan-400' },
  water: { name: 'Nước', color: 'text-blue-400' },
};

interface Big3CardProps {
  big3: Big3Result;
}

export default function Big3Card({ big3 }: Big3CardProps) {
  const { sun, moon, rising } = big3;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggle = (key: string) => setExpandedSection(expandedSection === key ? null : key);

  const analysis = getBig3Analysis(
    sun.sign.element,
    moon?.sign.element ?? null,
    rising?.sign.element ?? null,
  );

  return (
    <div className="space-y-4">
      {/* Big 3 Header */}
      <h3 className="text-sm font-semibold text-purple-300">Big 3 của bạn</h3>

      {/* 3-column (or 2-column) cards */}
      <div className={`grid gap-3 ${rising ? 'grid-cols-3' : moon ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {/* Sun */}
        <SignCard
          icon="☀️"
          label="Sun"
          role="Bạn là"
          sign={sun.sign}
        />

        {/* Moon */}
        {moon && (
          <SignCard
            icon="🌙"
            label="Moon"
            role="Bạn cảm thấy"
            sign={moon.sign}
          />
        )}

        {/* Rising */}
        {rising && (
          <SignCard
            icon="⬆️"
            label="Rising"
            role="Người ta thấy bạn"
            sign={rising.sign}
          />
        )}
      </div>

      {/* No Moon info */}
      {!moon && (
        <p className="text-xs text-gray-500 italic">
          Cần biết giờ sinh để tính Moon Sign và Rising Sign.
        </p>
      )}

      {/* No Rising info */}
      {moon && !rising && (
        <p className="text-xs text-gray-500 italic">
          Cần biết nơi sinh để tính Rising Sign (Cung Mọc).
        </p>
      )}

      {/* Expandable interpretations */}
      <div className="space-y-2">
        {/* Sun interpretation */}
        <InterpretationRow
          icon="☀️"
          title={`Sun in ${sun.sign.nameEn}: Con người thật sự`}
          content={sun.sign.personality}
          expanded={expandedSection === 'sun'}
          onToggle={() => toggle('sun')}
        />

        {/* Moon interpretation */}
        {moon && (
          <InterpretationRow
            icon="🌙"
            title={`Moon in ${moon.sign.nameEn}: Thế giới cảm xúc`}
            content={MOON_SIGN_DESCRIPTIONS[moon.sign.id]}
            expanded={expandedSection === 'moon'}
            onToggle={() => toggle('moon')}
          />
        )}

        {/* Rising interpretation */}
        {rising && (
          <InterpretationRow
            icon="⬆️"
            title={`Rising in ${rising.sign.nameEn}: Ấn tượng đầu tiên`}
            content={RISING_SIGN_DESCRIPTIONS[rising.sign.id]}
            expanded={expandedSection === 'rising'}
            onToggle={() => toggle('rising')}
          />
        )}
      </div>

      {/* Combined analysis */}
      {analysis && (
        <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-purple-300 mb-2">Phân tích kết hợp Big 3</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function SignCard({ icon, label, role, sign }: {
  icon: string;
  label: string;
  role: string;
  sign: { symbol: string; name: string; element: string };
}) {
  const element = ELEMENT_LABELS[sign.element];

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 text-center">
      <div className="text-xs text-gray-500 mb-1">{icon} {label}</div>
      <div className="text-2xl mb-1">{sign.symbol}</div>
      <div className="text-sm font-medium text-gray-200">{sign.name}</div>
      <div className={`text-xs mt-1 ${element.color}`}>{element.name}</div>
      <div className="text-[10px] text-gray-500 mt-1 italic">"{role}"</div>
    </div>
  );
}

function InterpretationRow({ icon, title, content, expanded, onToggle }: {
  icon: string;
  title: string;
  content: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-200 hover:bg-gray-800/50 transition-colors"
      >
        <span>{icon}</span>
        <span className="flex-1 text-left font-medium">{title}</span>
        <span className="text-gray-500 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
}
