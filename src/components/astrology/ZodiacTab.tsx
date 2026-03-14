import { useState, useCallback, type ReactNode } from 'react';
import type { Big3Result, ZodiacSign } from '../../core/astrology/types';
import { ZODIAC_SIGNS, getCompatibilityScore } from '../../data/zodiacData';
import Big3Card from './Big3Card';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { buildAstrologyAIPrompt } from '../../core/ai/prompts/astrologyPrompt';
import { buildUnifiedQuestionPrompt } from '../../core/ai/prompts/combinedPrompt';
import AIAnalysisSection from '../shared/AIAnalysisSection';
import { ASTROLOGY_QUICK_QUESTIONS } from '../../data/aiQuickQuestions';
import { useAIStore } from '../../store/aiStore';
import { getModelTier } from '../../core/ai/types';

const ELEMENT_LABELS: Record<string, { name: string; icon: string; color: string }> = {
  fire:  { name: 'Hỏa', icon: '🔥', color: 'text-red-400' },
  earth: { name: 'Thổ', icon: '🌍', color: 'text-yellow-600' },
  air:   { name: 'Khí', icon: '💨', color: 'text-cyan-400' },
  water: { name: 'Nước', icon: '💧', color: 'text-blue-400' },
};

const MODALITY_LABELS: Record<string, string> = {
  cardinal: 'Cardinal (Khởi đầu)',
  fixed: 'Fixed (Kiên định)',
  mutable: 'Mutable (Linh hoạt)',
};

const PLANET_LABELS: Record<string, { name: string; symbol: string }> = {
  mars:    { name: 'Sao Hỏa', symbol: '♂' },
  venus:   { name: 'Sao Kim', symbol: '♀' },
  mercury: { name: 'Sao Thủy', symbol: '☿' },
  moon:    { name: 'Mặt Trăng', symbol: '☽' },
  sun:     { name: 'Mặt Trời', symbol: '☉' },
  jupiter: { name: 'Sao Mộc', symbol: '♃' },
  saturn:  { name: 'Sao Thổ', symbol: '♄' },
  uranus:  { name: 'Thiên Vương', symbol: '♅' },
  neptune: { name: 'Hải Vương', symbol: '♆' },
  pluto:   { name: 'Diêm Vương', symbol: '♇' },
};

interface ZodiacTabProps {
  big3: Big3Result;
}

export default function ZodiacTab({ big3 }: ZodiacTabProps) {
  const { sign, degree, decan, decanRuler, cuspDate } = big3.sun;
  const element = ELEMENT_LABELS[sign.element];
  const planet = PLANET_LABELS[sign.rulingPlanet];
  const decanPlanet = PLANET_LABELS[decanRuler];
  const ai = useAIAnalysis('zodiac');

  const handleAnalyze = useCallback(() => {
    const prompt = buildAstrologyAIPrompt(big3);
    ai.analyze(prompt);
  }, [big3, ai]);

  const handleAskQuestion = useCallback((question: string) => {
    const config = useAIStore.getState().providerConfig;
    const tier = config ? getModelTier(config.type, config.model) : 'strong';
    const prompt = buildUnifiedQuestionPrompt(question, null, null, big3, '', ai.conversationHistory, tier);
    ai.askQuestion(prompt);
  }, [big3, ai]);

  return (
    <div className="space-y-6">
      {/* Big 3 Section */}
      <Big3Card big3={big3} />

      {/* Divider */}
      <div className="border-t border-gray-800 pt-4">
        <h3 className="text-sm font-semibold text-purple-300 mb-4">Chi tiết Sun Sign</h3>
      </div>

      {/* Hero Card */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 text-center">
        <div className="text-5xl mb-2">{sign.symbol}</div>
        <h2 className="text-2xl font-bold text-purple-300">{sign.name}</h2>
        <p className="text-gray-400 text-sm">{sign.nameEn}</p>
        <p className="text-gray-500 text-xs mt-1">{sign.dateRange}</p>

        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span className={element.color}>
            {element.icon} {element.name}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">{MODALITY_LABELS[sign.modality]}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">{planet.symbol} {planet.name}</span>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Decan {decan} ({decanPlanet.symbol} {decanPlanet.name}) — {degree.toFixed(1)}°
        </div>

        {cuspDate && (
          <p className="mt-2 text-xs text-yellow-500/80 bg-yellow-900/20 border border-yellow-800/30 rounded px-3 py-1 inline-block">
            Sinh ngày giáp ranh — cung có thể lệch ±1 ngày tùy năm sinh
          </p>
        )}
      </div>

      {/* Keyword tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sign.strengths.map((s) => (
          <span key={s} className="text-xs bg-purple-900/40 text-purple-300 border border-purple-800/40 rounded-full px-3 py-1">
            {s}
          </span>
        ))}
      </div>

      {/* Expandable sections */}
      <ExpandableSection title="Tính cách" defaultOpen>
        <p className="text-sm text-gray-300 leading-relaxed">{sign.personality}</p>
      </ExpandableSection>

      <ExpandableSection title="Sự nghiệp">
        <p className="text-sm text-gray-300 leading-relaxed">{sign.career}</p>
      </ExpandableSection>

      <ExpandableSection title="Tình yêu">
        <p className="text-sm text-gray-300 leading-relaxed">{sign.love}</p>
      </ExpandableSection>

      <ExpandableSection title="Sức khỏe">
        <p className="text-sm text-gray-300 leading-relaxed">{sign.health}</p>
        <p className="text-xs text-gray-500 mt-2">Bộ phận liên quan: {sign.bodyPart}</p>
      </ExpandableSection>

      <ExpandableSection title="Điểm mạnh & Điểm yếu">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs text-green-400 font-semibold mb-2">Điểm mạnh</h4>
            <ul className="space-y-1">
              {sign.strengths.map((s) => (
                <li key={s} className="text-sm text-gray-300 flex items-center gap-1.5">
                  <span className="text-green-500 text-xs">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-red-400 font-semibold mb-2">Điểm yếu</h4>
            <ul className="space-y-1">
              {sign.weaknesses.map((w) => (
                <li key={w} className="text-sm text-gray-300 flex items-center gap-1.5">
                  <span className="text-red-500 text-xs">-</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableSection>

      {/* Compatibility */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-purple-300 mb-3">Tương hợp</h3>
        <CompatibilityList currentSign={sign.id} label="Rất hợp" signs={sign.bestMatch} colorClass="text-green-400" barColor="bg-green-500" />
        <CompatibilityList currentSign={sign.id} label="Hợp" signs={sign.goodMatch} colorClass="text-blue-400" barColor="bg-blue-500" />
        <CompatibilityList currentSign={sign.id} label="Thử thách" signs={sign.challengeMatch} colorClass="text-orange-400" barColor="bg-orange-500" />
      </div>

      {/* AI Analysis */}
      <AIAnalysisSection
        title="AI Phân Tích Chiêm Tinh"
        description="Phân tích kết hợp Big 3 + Decan bằng AI — sâu hơn template có sẵn"
        quickQuestions={ASTROLOGY_QUICK_QUESTIONS}
        onAnalyze={handleAnalyze}
        onAskQuestion={handleAskQuestion}
        result={ai.result}
        loading={ai.loading}
        error={ai.error}
        conversationHistory={ai.conversationHistory}
      />

      {/* Lucky info */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-purple-300 mb-3">Thông tin may mắn</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Số may mắn</span>
            <p className="text-gray-200">{sign.luckyNumbers.join(', ')}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Màu may mắn</span>
            <p className="text-gray-200">{sign.luckyColors.join(', ')}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Ngày may mắn</span>
            <p className="text-gray-200">{sign.luckyDay}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Cực tính</span>
            <p className="text-gray-200">{sign.polarity === 'positive' ? 'Dương (+)' : 'Âm (-)'}</p>
          </div>
        </div>
      </div>

      {/* Celebrities */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-purple-300 mb-2">Người nổi tiếng cùng cung</h3>
        <p className="text-sm text-gray-300">{sign.celebrities.join(' • ')}</p>
      </div>
    </div>
  );
}

// --- Sub-components ---

function ExpandableSection({ title, children, defaultOpen = false }: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-200 hover:bg-gray-800/50 transition-colors"
      >
        <span>{title}</span>
        <span className="text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function CompatibilityList({ currentSign, label, signs, colorClass, barColor }: {
  currentSign: ZodiacSign;
  label: string;
  signs: ZodiacSign[];
  colorClass: string;
  barColor: string;
}) {
  if (signs.length === 0) return null;

  return (
    <div className="mb-3 last:mb-0">
      <span className={`text-xs font-medium ${colorClass}`}>{label}</span>
      <div className="mt-1 space-y-1.5">
        {signs.map((s) => {
          const info = ZODIAC_SIGNS[s];
          const score = getCompatibilityScore(currentSign, s);
          return (
            <div key={s} className="flex items-center gap-2">
              <span className="text-sm w-24 text-gray-300 truncate">{info.symbol} {info.name}</span>
              <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">{score}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
