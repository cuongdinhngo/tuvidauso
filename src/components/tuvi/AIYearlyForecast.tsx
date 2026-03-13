import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, RotateCcw, Key } from 'lucide-react';
import type { TuViChart } from '../../core/types';
import { useAIInterpretation } from '../../hooks/useAIInterpretation';
import { renderMarkdown } from '../../utils/markdownRenderer';
import APIKeyModal from '../shared/APIKeyModal';

interface AIYearlyForecastProps {
  chart: TuViChart;
  year: number;
}

export default function AIYearlyForecast({ chart, year }: AIYearlyForecastProps) {
  const ai = useAIInterpretation();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleAnalyze = () => {
    if (!ai.hasKey) {
      setShowKeyModal(true);
      return;
    }
    setExpanded(true);
    ai.getYearlyForecast(chart, year);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleAnalyze}
        disabled={ai.loading || ai.cooldown > 0}
        className="flex items-center gap-2 text-xs bg-purple-900/20 border border-purple-800/30 text-purple-300 hover:bg-purple-900/40 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-3 py-1.5 transition-colors"
      >
        {ai.loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        AI phân tích năm {year}
        {ai.cooldown > 0 && <span className="text-gray-500">({ai.cooldown}s)</span>}
      </button>

      {expanded && (
        <div className="space-y-2">
          {ai.loading && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-400">Đang phân tích vận hạn năm {year}...</p>
            </div>
          )}

          {ai.error && (
            <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-2 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-xs text-red-400 flex-1">{ai.error}</span>
              {ai.error.includes('API key') ? (
                <button onClick={() => setShowKeyModal(true)} className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1">
                  <Key className="w-3 h-3" /> Key
                </button>
              ) : (
                <button onClick={handleAnalyze} className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Thử lại
                </button>
              )}
            </div>
          )}

          {ai.result && (
            <div className="bg-gray-800/30 border border-gray-700/40 rounded-lg p-4">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(ai.result) }} className="ai-content" />
              <p className="text-[10px] text-gray-600 mt-3">
                Phân tích bởi AI, chỉ mang tính tham khảo.
              </p>
            </div>
          )}
        </div>
      )}

      {showKeyModal && (
        <APIKeyModal
          onClose={() => setShowKeyModal(false)}
          onSaved={() => { setShowKeyModal(false); handleAnalyze(); }}
        />
      )}
    </div>
  );
}
