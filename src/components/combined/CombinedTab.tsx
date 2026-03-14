import { useCallback } from 'react';
import type { TuViChart, BirthInfo } from '../../core/types';
import type { NumerologyChart } from '../../core/numerology/types';
import type { Big3Result } from '../../core/astrology/types';
import { LIFE_PATH_MEANINGS, PERSONAL_YEAR_MEANINGS, NUMBER_MEANINGS } from '../../data/numerologyData';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { buildCombinedAIPrompt, buildUnifiedQuestionPrompt } from '../../core/ai/prompts/combinedPrompt';
import AIAnalysisSection from '../shared/AIAnalysisSection';
import { COMBINED_QUICK_QUESTIONS } from '../../data/aiQuickQuestions';
import { useAIStore } from '../../store/aiStore';
import { getModelTier } from '../../core/ai/types';

const ELEMENT_VI: Record<string, string> = {
  fire: 'Hỏa', earth: 'Thổ', air: 'Khí', water: 'Nước',
};

interface CombinedTabProps {
  tuViChart: TuViChart;
  numerologyChart: NumerologyChart | null;
  big3: Big3Result;
  birthInfo: BirthInfo;
}

export default function CombinedTab({ tuViChart, numerologyChart, big3, birthInfo }: CombinedTabProps) {
  const currentYear = new Date().getFullYear();
  const fullName = birthInfo.name || '';
  const ai = useAIAnalysis('combined');

  const menhPalace = tuViChart.palaces.find((p) => p.name === 'Mệnh');
  const quanLocPalace = tuViChart.palaces.find((p) => p.name === 'Quan Lộc');
  const phuThePalace = tuViChart.palaces.find((p) => p.name === 'Phu Thê');
  const getStars = (palace: typeof menhPalace) =>
    palace?.stars.filter((s) => s.type === 'chinh').map((s) => s.name).join(', ') || '—';

  const lpMeaning = numerologyChart ? LIFE_PATH_MEANINGS[numerologyChart.lifePath.value] : null;
  const exprMeaning = numerologyChart ? NUMBER_MEANINGS[numerologyChart.expression.value] : null;
  const pyMeaning = numerologyChart ? PERSONAL_YEAR_MEANINGS[numerologyChart.personalYear.value] : null;

  const sunName = big3.sun.sign.name;
  const sunNameEn = big3.sun.sign.nameEn;
  const sunElement = ELEMENT_VI[big3.sun.sign.element] || big3.sun.sign.element;

  const handleAnalyze = useCallback(() => {
    if (!numerologyChart) return;
    const prompt = buildCombinedAIPrompt(tuViChart, numerologyChart, big3, fullName, currentYear);
    ai.analyze(prompt);
  }, [tuViChart, numerologyChart, big3, fullName, currentYear, ai]);

  const handleAskQuestion = useCallback((question: string) => {
    const config = useAIStore.getState().providerConfig;
    const tier = config ? getModelTier(config.type, config.model) : 'strong';
    const prompt = buildUnifiedQuestionPrompt(
      question, tuViChart, numerologyChart, big3, fullName, ai.conversationHistory, tier,
    );
    ai.askQuestion(prompt, question);
  }, [tuViChart, numerologyChart, big3, fullName, ai]);

  return (
    <div className="space-y-6">
      {/* System badges */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-purple-900/30 border border-purple-800/40 rounded-lg px-3 py-1.5 text-sm text-purple-300">
          Tử Vi Đẩu Số
        </div>
        <div className="bg-blue-900/30 border border-blue-800/40 rounded-lg px-3 py-1.5 text-sm text-blue-300">
          Thần Số Học
        </div>
        <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-lg px-3 py-1.5 text-sm text-emerald-300">
          Cung Hoàng Đạo
        </div>
      </div>

      {/* 3-way comparison table */}
      <div>
        <h3 className="text-sm font-semibold text-purple-300 mb-3">So Sánh 3 Hệ Thống</h3>
        <div className="bg-gray-900/80 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium w-[18%]"></th>
                  <th className="text-left px-4 py-2 text-xs text-purple-400 font-medium">Tử Vi Đẩu Số</th>
                  <th className="text-left px-4 py-2 text-xs text-blue-400 font-medium">Thần Số Học</th>
                  <th className="text-left px-4 py-2 text-xs text-emerald-400 font-medium">Hoàng Đạo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="px-4 py-2.5 text-xs text-gray-400">Tính cách</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">{getStars(menhPalace)}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {numerologyChart ? `Số ${numerologyChart.lifePath.value} — ${lpMeaning?.title || ''}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {big3.sun.sign.symbol} {sunName} ({sunElement})
                  </td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="px-4 py-2.5 text-xs text-gray-400">Sự nghiệp</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">{getStars(quanLocPalace)}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {numerologyChart && numerologyChart.expression.value > 0
                      ? `Số ${numerologyChart.expression.value} — ${exprMeaning?.title || ''}`
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {sunNameEn} — {big3.sun.sign.career ? big3.sun.sign.career.slice(0, 40) + '...' : ''}
                  </td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="px-4 py-2.5 text-xs text-gray-400">Tình yêu</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">{getStars(phuThePalace)}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {numerologyChart ? `SU ${numerologyChart.soulUrge.value}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {big3.moon ? `Moon ${big3.moon.sign.name}` : sunName}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-xs text-gray-400">Năm {currentYear}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">{tuViChart.menhPalaceName}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {numerologyChart ? `Năm ${numerologyChart.personalYear.value} — ${pyMeaning?.theme || ''}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-200">
                    {sunNameEn}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-800">
            <p className="text-[10px] text-gray-500">
              So sánh 3 hệ thống Đông — Tây để có cái nhìn toàn diện. Khi cả 3 đồng nhất, đó là điểm rất đáng tin cậy.
            </p>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {numerologyChart && (
        <AIAnalysisSection
          title="AI Phân Tích Kết Hợp Đông-Tây"
          quickQuestions={COMBINED_QUICK_QUESTIONS}
          onAnalyze={handleAnalyze}
          onAskQuestion={handleAskQuestion}
          result={ai.result}
          initialResult={ai.initialResult}
          loading={ai.loading}
          error={ai.error}
          conversationHistory={ai.conversationHistory}
        />
      )}
    </div>
  );
}
