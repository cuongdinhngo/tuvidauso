import { useState, useCallback } from 'react';
import type { NumerologyChart, NumberResult } from '../../core/numerology/types';
import type { BirthInfo, TuViChart } from '../../core/types';
import { useTuViStore } from '../../store/tuViStore';
import {
  LIFE_PATH_MEANINGS,
  NUMBER_MEANINGS,
  PERSONAL_YEAR_MEANINGS,
  KARMIC_DEBT_MEANINGS,
  INCLUSION_MEANINGS,
} from '../../data/numerologyData';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { buildNumerologyAIPrompt } from '../../core/ai/prompts/numerologyPrompt';
import { buildUnifiedQuestionPrompt } from '../../core/ai/prompts/combinedPrompt';
import AIAnalysisSection from '../shared/AIAnalysisSection';
import { NUMEROLOGY_QUICK_QUESTIONS } from '../../data/aiQuickQuestions';
import { useAIStore } from '../../store/aiStore';
import { getModelTier } from '../../core/ai/types';

interface NumerologyTabProps {
  chart: NumerologyChart;
  birthInfo: BirthInfo;
  tuViChart: TuViChart;
  hasName: boolean;
}

export default function NumerologyTab({ chart, birthInfo, tuViChart, hasName }: NumerologyTabProps) {
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthInfo.solarDate.year;
  const ai = useAIAnalysis('numerology');
  const fullName = birthInfo.name || '';

  const handleAnalyze = useCallback(() => {
    const prompt = buildNumerologyAIPrompt(chart, fullName, currentYear, birthInfo.solarDate.year);
    ai.analyze(prompt);
  }, [chart, fullName, currentYear, birthInfo.solarDate.year, ai]);

  const handleAskQuestion = useCallback((question: string) => {
    const config = useAIStore.getState().providerConfig;
    const tier = config ? getModelTier(config.type, config.model) : 'strong';
    const prompt = buildUnifiedQuestionPrompt(question, tuViChart, chart, null, fullName, ai.conversationHistory, tier);
    ai.askQuestion(prompt, question);
  }, [chart, tuViChart, fullName, ai]);

  return (
    <div className="space-y-8">
      {/* No-name banner */}
      {!hasName && <NameBanner birthInfo={birthInfo} />}

      {/* Life Path hero */}
      <LifePathCard result={chart.lifePath} />

      {/* Karmic Debt */}
      {chart.karmicDebt.length > 0 && <KarmicDebtSection debts={chart.karmicDebt} />}

      {/* Core Numbers */}
      <CoreNumbersGrid
        expression={chart.expression}
        soulUrge={chart.soulUrge}
        personality={chart.personality}
        birthday={chart.birthday}
        attitude={chart.attitude}
        hasName={hasName}
      />

      {/* Personal Year */}
      <PersonalYearCard
        personalYear={chart.personalYear}
        personalMonth={chart.personalMonth}
        currentYear={currentYear}
      />

      {/* Inclusion Chart */}
      {hasName && (
        <InclusionSection
          inclusionChart={chart.inclusionChart}
          karmicLessons={chart.karmicLesson}
          hiddenPassion={chart.hiddenPassion}
        />
      )}

      {/* Pinnacles & Challenges */}
      <PinnaclesAndChallenges
        pinnacles={chart.pinnacles}
        challenges={chart.challenges}
        currentAge={currentAge}
      />

      {/* Birth Pyramid */}
      <BirthPyramid pyramid={chart.birthChart} />

      {/* East-West comparison */}
      <EastWestSection chart={chart} tuViChart={tuViChart} currentYear={currentYear} />

      {/* AI Analysis */}
      <AIAnalysisSection
        title="AI Phân Tích Thần Số Học"
        quickQuestions={NUMEROLOGY_QUICK_QUESTIONS}
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

// ============================================
// NAME BANNER
// ============================================

function NameBanner({ birthInfo }: { birthInfo: BirthInfo }) {
  const [name, setName] = useState('');
  const calculate = useTuViStore((s) => s.calculate);

  function handleSubmit() {
    if (!name.trim()) return;
    calculate({ ...birthInfo, name: name.trim() });
  }

  return (
    <div className="bg-thuy/20 border border-thuy/50 rounded-lg p-4">
      <p className="text-sm text-thuy mb-3">
        Nhập họ tên đầy đủ để xem phân tích Thần Số Học hoàn chỉnh (Số Vận Mệnh, Số Linh Hồn, Biểu đồ Inclusion...)
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Nhập họ tên đầy đủ…"
          className="flex-1 bg-surface border border-white/10 rounded-lg px-3 py-2 text-ink text-sm focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        />
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="px-4 py-2 bg-gold hover:bg-gold/90 text-base font-semibold text-sm rounded-md min-h-[44px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xem
        </button>
      </div>
    </div>
  );
}

// ============================================
// LIFE PATH CARD
// ============================================

function LifePathCard({ result }: { result: NumberResult }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const meaning = LIFE_PATH_MEANINGS[result.value];
  if (!meaning) return null;

  const toggle = (key: string) => setExpanded(expanded === key ? null : key);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gold mb-3">Số Chủ Đạo (Life Path)</h3>
      <div className="bg-surface border border-white/10 rounded-lg p-5">
        {/* Hero number */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold ${
            result.masterNumber
              ? 'bg-gradient-to-br from-warn/30 to-gold/30 border-2 border-warn/50 text-warn'
              : 'bg-gold/40 border-2 border-gold/50 text-gold'
          }`}>
            {result.value}
          </div>
          <h4 className="text-lg font-semibold text-ink mt-3">{meaning.title}</h4>
          {result.masterNumber && (
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-warn/40 text-warn border border-warn/40 rounded">
              Master Number
            </span>
          )}
          <p className="text-xs text-ink-muted mt-2">{result.reductionPath}</p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {meaning.keywords.map((kw) => (
            <span key={kw} className="px-2.5 py-1 text-xs bg-gold/30 text-gold border border-gold/40 rounded-full">
              {kw}
            </span>
          ))}
        </div>

        {/* Expandable sections */}
        {([
          ['personality', 'Tính cách', meaning.personality],
          ['career', 'Sự nghiệp', meaning.career],
          ['love', 'Tình yêu', meaning.love],
          ['challenge', 'Thử thách', meaning.challenge],
        ] as const).map(([key, label, text]) => (
          <div key={key} className="border-t border-white/10">
            <button
              onClick={() => toggle(key)}
              className="w-full flex justify-between items-center py-3 text-sm text-ink hover:text-gold transition-colors"
            >
              <span className="font-medium">{label}</span>
              <span className="text-ink-muted">{expanded === key ? '▲' : '▼'}</span>
            </button>
            {expanded === key && (
              <p className="text-sm text-ink-muted pb-3 leading-relaxed">{text}</p>
            )}
          </div>
        ))}

        {/* Celebrities */}
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-ink-muted">
            Người nổi tiếng: {meaning.celebrities.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// KARMIC DEBT
// ============================================

function KarmicDebtSection({ debts }: { debts: number[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-bad mb-3">Nợ Nghiệp (Karmic Debt)</h3>
      <div className="space-y-2">
        {debts.map((n) => {
          const info = KARMIC_DEBT_MEANINGS[n];
          if (!info) return null;
          return (
            <div key={n} className="bg-bad/10 border border-bad/30 rounded-lg p-3">
              <div className="text-sm font-medium text-bad">{info.title}</div>
              <p className="text-xs text-ink-muted mt-1">{info.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// CORE NUMBERS GRID
// ============================================

function CoreNumbersGrid({
  expression, soulUrge, personality, birthday, attitude, hasName,
}: {
  expression: NumberResult;
  soulUrge: NumberResult;
  personality: NumberResult;
  birthday: NumberResult;
  attitude: NumberResult;
  hasName: boolean;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gold mb-3">Bộ Số Cốt Lõi</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <NumberCard label="Số Vận Mệnh" sublabel="Expression" result={expression} disabled={!hasName} />
        <NumberCard label="Số Linh Hồn" sublabel="Soul Urge" result={soulUrge} disabled={!hasName} />
        <NumberCard label="Số Nhân Cách" sublabel="Personality" result={personality} disabled={!hasName} />
        <NumberCard label="Số Ngày Sinh" sublabel="Birthday" result={birthday} disabled={false} />
        <NumberCard label="Số Thái Độ" sublabel="Attitude" result={attitude} disabled={false} />
      </div>
    </div>
  );
}

function NumberCard({ label, sublabel, result, disabled }: {
  label: string;
  sublabel: string;
  result: NumberResult;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const meaning = NUMBER_MEANINGS[result.value];

  if (disabled) {
    return (
      <div className="bg-surface border border-white/10 rounded-lg p-3 opacity-50">
        <div className="text-xs text-ink-muted">{label}</div>
        <div className="text-lg font-bold text-ink-muted mt-1">-</div>
        <div className="text-[10px] text-ink-muted">{sublabel}</div>
        <p className="text-[10px] text-ink-muted mt-1">Nhập họ tên để xem</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-surface border border-white/10 rounded-lg p-3 hover:border-gold/50 transition-colors"
    >
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className={`text-lg font-bold ${result.masterNumber ? 'text-warn' : 'text-ink'}`}>
          {result.value}
        </span>
        {result.masterNumber && <span className="text-[9px] text-warn">Master</span>}
      </div>
      <div className="text-[10px] text-ink-muted">{sublabel}</div>
      {meaning && (
        <div className="text-[10px] text-ink-muted mt-1">{meaning.title}</div>
      )}
      {open && meaning && (
        <p className="text-xs text-ink-muted mt-2 border-t border-white/10 pt-2">{meaning.brief}</p>
      )}
      <div className="text-[10px] text-ink-muted mt-1">{result.reductionPath}</div>
    </button>
  );
}

// ============================================
// PERSONAL YEAR
// ============================================

function PersonalYearCard({
  personalYear, personalMonth, currentYear,
}: {
  personalYear: NumberResult;
  personalMonth: NumberResult;
  currentYear: number;
}) {
  const yearMeaning = PERSONAL_YEAR_MEANINGS[personalYear.value];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gold mb-3">Năm Cá Nhân {currentYear}</h3>
      <div className="bg-surface border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gold/40 border border-gold/40">
            <span className="text-2xl font-bold text-gold">{personalYear.value}</span>
          </div>
          <div>
            {yearMeaning && (
              <>
                <h4 className="text-base font-semibold text-ink">Năm {personalYear.value} - {yearMeaning.theme}</h4>
                <p className="text-xs text-ink-muted mt-1">{yearMeaning.description}</p>
              </>
            )}
          </div>
        </div>

        {yearMeaning && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {yearMeaning.doList.length > 0 && (
              <div>
                <div className="text-xs font-medium text-good mb-1.5">Nên</div>
                <div className="flex flex-wrap gap-1.5">
                  {yearMeaning.doList.map((item) => (
                    <span key={item} className="px-2 py-0.5 text-[10px] bg-good/20 text-good border border-good/30 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {yearMeaning.dontList.length > 0 && (
              <div>
                <div className="text-xs font-medium text-bad mb-1.5">Tránh</div>
                <div className="flex flex-wrap gap-1.5">
                  {yearMeaning.dontList.map((item) => (
                    <span key={item} className="px-2 py-0.5 text-[10px] bg-bad/20 text-bad border border-bad/30 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Personal Month sub-card */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">Tháng Cá Nhân (tháng {new Date().getMonth() + 1}):</span>
            <span className="text-sm font-semibold text-ink">{personalMonth.value}</span>
            {NUMBER_MEANINGS[personalMonth.value] && (
              <span className="text-xs text-ink-muted">- {NUMBER_MEANINGS[personalMonth.value].title}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// INCLUSION CHART
// ============================================

function InclusionSection({
  inclusionChart, karmicLessons, hiddenPassion,
}: {
  inclusionChart: Record<number, number>;
  karmicLessons: number[];
  hiddenPassion: number[];
}) {
  const maxCount = Math.max(...Object.values(inclusionChart), 1);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gold mb-3">Biểu Đồ Inclusion</h3>
      <div className="bg-surface border border-white/10 rounded-lg p-4">
        <div className="space-y-2">
          {Object.entries(inclusionChart).map(([num, count]) => {
            const n = parseInt(num);
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isMissing = count === 0;
            const isPassion = hiddenPassion.includes(n);
            const meaning = INCLUSION_MEANINGS[n];
            return (
              <div key={num} className="flex items-center gap-2">
                <span className={`text-sm w-5 text-center font-medium ${isMissing ? 'text-bad' : isPassion ? 'text-warn' : 'text-ink'}`}>
                  {num}
                </span>
                <div className="flex-1 h-5 bg-raised rounded-full overflow-hidden">
                  {count > 0 && (
                    <div
                      className={`h-full rounded-full ${isPassion ? 'bg-warn/70' : 'bg-gold/60'}`}
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  )}
                </div>
                <span className="w-4 text-right text-[10px] font-medium text-ink-muted tabular-nums">
                  {count > 0 ? count : ''}
                </span>
                {isMissing && (
                  <span className="text-[10px] bg-bad/30 text-bad border border-bad/30 rounded px-1.5 py-0.5 whitespace-nowrap">
                    Thiếu
                  </span>
                )}
                {isPassion && (
                  <span className="text-[10px] bg-warn/30 text-warn border border-warn/30 rounded px-1.5 py-0.5 whitespace-nowrap">
                    Đam mê
                  </span>
                )}
                {meaning && (
                  <span className="text-[10px] text-ink-muted hidden md:inline">
                    {isMissing ? meaning.missing : meaning.present}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
          {karmicLessons.length > 0 && (
            <p className="text-xs text-ink-muted">
              <span className="text-bad">Bài học nghiệp:</span>{' '}
              {karmicLessons.map((n) => (
                <span key={n} className="inline-block px-1.5 py-0.5 bg-bad/20 text-bad border border-bad/30 rounded text-[10px] mr-1">
                  {n}
                </span>
              ))}
            </p>
          )}
          {hiddenPassion.length > 0 && (
            <p className="text-xs text-ink-muted">
              <span className="text-warn">Đam mê ẩn:</span>{' '}
              {hiddenPassion.map((n) => (
                <span key={n} className="inline-block px-1.5 py-0.5 bg-warn/20 text-warn border border-warn/30 rounded text-[10px] mr-1">
                  {n}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PINNACLES & CHALLENGES
// ============================================

function PinnaclesAndChallenges({
  pinnacles, challenges, currentAge,
}: {
  pinnacles: NumerologyChart['pinnacles'];
  challenges: NumerologyChart['challenges'];
  currentAge: number;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gold mb-3">Đỉnh Cao & Thử Thách</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pinnacles */}
        <div className="bg-surface border border-white/10 rounded-lg p-4">
          <h4 className="text-xs font-medium text-good mb-3">4 Đỉnh Cao (Pinnacles)</h4>
          <div className="space-y-2">
            {pinnacles.map((p, i) => {
              const isCurrent = currentAge >= p.startAge && (p.endAge === null || currentAge <= p.endAge);
              return (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isCurrent ? 'bg-good/20 border border-good/30' : ''}`}>
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                    isCurrent ? 'bg-good/40 text-good border border-good/40' : 'bg-raised text-ink-muted'
                  }`}>
                    {p.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${isCurrent ? 'text-good' : 'text-ink'}`}>
                        Đỉnh {i + 1}
                      </span>
                      <span className="text-[10px] text-ink-muted">
                        ({p.startAge}-{p.endAge ?? '∞'} tuổi)
                      </span>
                      {isCurrent && <span className="text-[9px] bg-good/40 text-good rounded px-1">Hiện tại</span>}
                    </div>
                    <div className="text-[10px] text-ink-muted truncate">{p.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-surface border border-white/10 rounded-lg p-4">
          <h4 className="text-xs font-medium text-warn mb-3">4 Thử Thách (Challenges)</h4>
          <div className="space-y-2">
            {challenges.map((c, i) => {
              const isCurrent = currentAge >= c.startAge && (c.endAge === null || currentAge <= c.endAge);
              return (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isCurrent ? 'bg-warn/20 border border-warn/30' : ''}`}>
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                    isCurrent ? 'bg-warn/40 text-warn border border-warn/40' : 'bg-raised text-ink-muted'
                  }`}>
                    {c.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${isCurrent ? 'text-warn' : 'text-ink'}`}>
                        Thử thách {i + 1}
                      </span>
                      <span className="text-[10px] text-ink-muted">
                        ({c.startAge}-{c.endAge ?? '∞'} tuổi)
                      </span>
                      {isCurrent && <span className="text-[9px] bg-warn/40 text-warn rounded px-1">Hiện tại</span>}
                    </div>
                    <div className="text-[10px] text-ink-muted truncate">{c.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BIRTH PYRAMID
// ============================================

function BirthPyramid({ pyramid }: { pyramid: number[][] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gold mb-3">Kim Tự Tháp Ngày Sinh</h3>
      <div className="bg-surface border border-white/10 rounded-lg p-4">
        <div className="flex flex-col items-center gap-1">
          {pyramid.map((row, ri) => (
            <div key={ri} className="flex gap-1 justify-center">
              {row.map((digit, di) => (
                <div
                  key={di}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium ${
                    ri === 0
                      ? 'bg-gold/40 text-gold border border-gold/40'
                      : ri === pyramid.length - 1
                        ? 'bg-warn/30 text-warn border border-warn/40'
                        : 'bg-raised text-ink-muted'
                  }`}
                >
                  {digit}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-ink-muted text-center mt-3">
          Hàng trên: các chữ số ngày sinh • Hàng dưới: kết quả cộng dồn
        </p>
      </div>
    </div>
  );
}

// ============================================
// EAST-WEST COMPARISON
// ============================================

function EastWestSection({
  chart, tuViChart, currentYear,
}: {
  chart: NumerologyChart;
  tuViChart: TuViChart;
  currentYear: number;
}) {
  const lifeMeaning = LIFE_PATH_MEANINGS[chart.lifePath.value];
  const menhPalace = tuViChart.palaces.find(p => p.name === 'Mệnh');
  const quanLocPalace = tuViChart.palaces.find(p => p.name === 'Quan Lộc');

  const menhStars = menhPalace?.stars.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '-';
  const quanLocStars = quanLocPalace?.stars.filter(s => s.type === 'chinh').map(s => s.name).join(', ') || '-';

  const personalYearMeaning = PERSONAL_YEAR_MEANINGS[chart.personalYear.value];
  const expressionMeaning = NUMBER_MEANINGS[chart.expression.value];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gold mb-3">Đông Tây Kết Hợp</h3>
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-2 text-xs text-ink-muted font-medium w-1/4"></th>
              <th className="text-left px-4 py-2 text-xs text-gold font-medium">Tử Vi Đẩu Số</th>
              <th className="text-left px-4 py-2 text-xs text-thuy font-medium">Thần Số Học</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="px-4 py-2.5 text-xs text-ink-muted">Tính cách</td>
              <td className="px-4 py-2.5 text-xs text-ink">{menhStars}</td>
              <td className="px-4 py-2.5 text-xs text-ink">
                Số {chart.lifePath.value} - {lifeMeaning?.title || ''}
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="px-4 py-2.5 text-xs text-ink-muted">Sự nghiệp</td>
              <td className="px-4 py-2.5 text-xs text-ink">{quanLocStars}</td>
              <td className="px-4 py-2.5 text-xs text-ink">
                {chart.expression.value > 0 ? `Số ${chart.expression.value} - ${expressionMeaning?.title || ''}` : '-'}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-xs text-ink-muted">Năm {currentYear}</td>
              <td className="px-4 py-2.5 text-xs text-ink">
                {tuViChart.menhPalaceName}
              </td>
              <td className="px-4 py-2.5 text-xs text-ink">
                Năm {chart.personalYear.value} - {personalYearMeaning?.theme || ''}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-[10px] text-ink-muted">
            So sánh 2 hệ thống Đông - Tây để có cái nhìn toàn diện. Khi cả 2 đồng nhất, đó là điểm rất đáng tin cậy.
          </p>
        </div>
      </div>
    </div>
  );
}
