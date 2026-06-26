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
  fire:  { name: 'Hỏa', icon: '🔥', color: 'text-bad' },
  earth: { name: 'Thổ', icon: '🌍', color: 'text-warn' },
  air:   { name: 'Khí', icon: '💨', color: 'text-thuy' },
  water: { name: 'Nước', icon: '💧', color: 'text-thuy' },
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
    ai.askQuestion(prompt, question);
  }, [big3, ai]);

  return (
    <div className="space-y-6">
      {/* Big 3 Section */}
      <Big3Card big3={big3} />

      {/* Divider */}
      <div className="border-t border-white/10 pt-4">
        <h3 className="text-sm font-semibold text-gold mb-4">Chi tiết Sun Sign</h3>
      </div>

      {/* Hero Card */}
      <div className="bg-surface border border-white/10 rounded-xl p-6 text-center">
        <div className="text-5xl mb-2">{sign.symbol}</div>
        <h2 className="text-2xl font-bold text-gold">{sign.name}</h2>
        <p className="text-ink-muted text-sm">{sign.nameEn}</p>
        <p className="text-ink-muted text-xs mt-1">{sign.dateRange}</p>

        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span className={element.color}>
            {element.icon} {element.name}
          </span>
          <span className="text-ink-muted">|</span>
          <span className="text-ink">{MODALITY_LABELS[sign.modality]}</span>
          <span className="text-ink-muted">|</span>
          <span className="text-ink">{planet.symbol} {planet.name}</span>
        </div>

        <div className="mt-3 text-xs text-ink-muted">
          Decan {decan} ({decanPlanet.symbol} {decanPlanet.name}) - {degree.toFixed(1)}°
        </div>

        {cuspDate && (
          <p className="mt-2 text-xs text-warn/80 bg-warn/20 border border-warn/30 rounded px-3 py-1 inline-block">
            Sinh ngày giáp ranh - cung có thể lệch ±1 ngày tùy năm sinh
          </p>
        )}
      </div>

      {/* Keyword tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sign.strengths.map((s) => (
          <span key={s} className="text-xs bg-gold/40 text-gold border border-gold/40 rounded-full px-3 py-1">
            {s}
          </span>
        ))}
      </div>

      {/* Expandable sections */}
      <ExpandableSection title="Tính cách" defaultOpen>
        <p className="text-sm text-ink leading-relaxed">{sign.personality}</p>
      </ExpandableSection>

      <ExpandableSection title="Sự nghiệp">
        <p className="text-sm text-ink leading-relaxed">{sign.career}</p>
      </ExpandableSection>

      <ExpandableSection title="Tình yêu">
        <p className="text-sm text-ink leading-relaxed">{sign.love}</p>
      </ExpandableSection>

      <ExpandableSection title="Sức khỏe">
        <p className="text-sm text-ink leading-relaxed">{sign.health}</p>
        <p className="text-xs text-ink-muted mt-2">Bộ phận liên quan: {sign.bodyPart}</p>
      </ExpandableSection>

      <ExpandableSection title="Điểm mạnh & Điểm yếu">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs text-good font-semibold mb-2">Điểm mạnh</h4>
            <ul className="space-y-1">
              {sign.strengths.map((s) => (
                <li key={s} className="text-sm text-ink flex items-center gap-1.5">
                  <span className="text-good text-xs">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-bad font-semibold mb-2">Điểm yếu</h4>
            <ul className="space-y-1">
              {sign.weaknesses.map((w) => (
                <li key={w} className="text-sm text-ink flex items-center gap-1.5">
                  <span className="text-bad text-xs">-</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableSection>

      {/* Compatibility */}
      <div className="bg-surface border border-white/10 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gold mb-3">Tương hợp</h3>
        <CompatibilityList currentSign={sign.id} label="Rất hợp" signs={sign.bestMatch} colorClass="text-good" barColor="bg-good" />
        <CompatibilityList currentSign={sign.id} label="Hợp" signs={sign.goodMatch} colorClass="text-thuy" barColor="bg-thuy" />
        <CompatibilityList currentSign={sign.id} label="Thử thách" signs={sign.challengeMatch} colorClass="text-warn" barColor="bg-warn" />
      </div>

      {/* Lucky info */}
      <div className="bg-surface border border-white/10 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gold mb-3">Thông tin may mắn</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-ink-muted text-xs">Số may mắn</span>
            <p className="text-ink">{sign.luckyNumbers.join(', ')}</p>
          </div>
          <div>
            <span className="text-ink-muted text-xs">Màu may mắn</span>
            <p className="text-ink">{sign.luckyColors.join(', ')}</p>
          </div>
          <div>
            <span className="text-ink-muted text-xs">Ngày may mắn</span>
            <p className="text-ink">{sign.luckyDay}</p>
          </div>
          <div>
            <span className="text-ink-muted text-xs">Cực tính</span>
            <p className="text-ink">{sign.polarity === 'positive' ? 'Dương (+)' : 'Âm (-)'}</p>
          </div>
        </div>
      </div>

      {/* Celebrities */}
      <div className="bg-surface border border-white/10 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gold mb-2">Người nổi tiếng cùng cung</h3>
        <p className="text-sm text-ink">{sign.celebrities.join(' • ')}</p>
      </div>

      {/* AI Analysis */}
      <AIAnalysisSection
        title="AI Phân Tích Chiêm Tinh"
        quickQuestions={ASTROLOGY_QUICK_QUESTIONS}
        onAnalyze={handleAnalyze}
        onAskQuestion={handleAskQuestion}
        result={ai.result}
        initialResult={ai.initialResult}
        initialSuggestions={ai.initialSuggestions}
        loading={ai.loading}
        error={ai.error}
        conversationHistory={ai.conversationHistory}
      />
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
    <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-ink hover:bg-raised transition-colors"
      >
        <span>{title}</span>
        <span className="text-ink-muted text-xs">{open ? '▲' : '▼'}</span>
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
              <span className="text-sm w-24 text-ink truncate">{info.symbol} {info.name}</span>
              <div className="flex-1 h-4 bg-raised rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-xs text-ink-muted w-8 text-right">{score}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
