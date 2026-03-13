import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, AlertCircle, RotateCcw, Key } from 'lucide-react';
import type { TuViChart } from '../../core/types';
import { useAIInterpretation } from '../../hooks/useAIInterpretation';
import { renderMarkdown } from '../../utils/markdownRenderer';
import APIKeyModal from '../shared/APIKeyModal';

interface AILuanGiaiProps {
  chart: TuViChart;
}

const QUICK_QUESTIONS = [
  'Nghề nào phù hợp nhất với tôi?',
  'Khi nào tốt nhất để kết hôn?',
  'Sức khỏe tôi cần lưu ý gì?',
  'Phân tích cung Quan Lộc chi tiết',
  'Giai đoạn nào sự nghiệp phát triển nhất?',
  'Tôi có nên đầu tư BĐS?',
];

type Mode = 'idle' | 'overview' | 'yearly' | 'chat';

export default function AILuanGiai({ chart }: AILuanGiaiProps) {
  const ai = useAIInterpretation();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [mode, setMode] = useState<Mode>('idle');
  const [question, setQuestion] = useState('');
  const [yearlyYear, setYearlyYear] = useState(new Date().getFullYear());
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to result when it appears
  useEffect(() => {
    if (ai.result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [ai.result]);

  const ensureKey = (callback: () => void) => {
    if (!ai.hasKey) {
      setShowKeyModal(true);
      return;
    }
    callback();
  };

  const handleOverview = () => {
    ensureKey(() => {
      setMode('overview');
      ai.getOverview(chart);
    });
  };

  const handleYearly = () => {
    ensureKey(() => {
      setMode('yearly');
      ai.getYearlyForecast(chart, yearlyYear);
    });
  };

  const handleAskQuestion = (q?: string) => {
    const text = q || question.trim();
    if (!text) return;
    ensureKey(() => {
      setMode('chat');
      setQuestion('');
      ai.askQuestion(chart, text);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-purple-300">AI Luận Giải</h3>
        </div>
        <div className="flex items-center gap-2">
          {ai.cooldown > 0 && (
            <span className="text-xs text-gray-500">Đợi {ai.cooldown}s</span>
          )}
          <span className="text-xs text-gray-600">{ai.sessionRequestCount}/{ai.maxRequests}</span>
          <button
            onClick={() => setShowKeyModal(true)}
            className="text-gray-500 hover:text-gray-300 p-1"
            title="Cài đặt API key"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={handleOverview}
          disabled={ai.loading || ai.cooldown > 0}
          className="bg-purple-900/30 border border-purple-800/40 rounded-lg px-3 py-2.5 text-sm text-purple-300 hover:bg-purple-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
        >
          <span className="block font-medium">Tổng Quan Lá Số</span>
          <span className="text-xs text-gray-500">Phân tích toàn diện</span>
        </button>

        <div className="bg-purple-900/30 border border-purple-800/40 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <button
            onClick={handleYearly}
            disabled={ai.loading || ai.cooldown > 0}
            className="flex-1 text-sm text-purple-300 text-left disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="block font-medium">Dự Báo Năm</span>
            <span className="text-xs text-gray-500">Vận hạn chi tiết</span>
          </button>
          <select
            value={yearlyYear}
            onChange={e => setYearlyYear(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-xs text-gray-300"
          >
            {Array.from({ length: 10 }, (_, i) => currentYear - 2 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => inputRef.current?.focus()}
          className="bg-purple-900/30 border border-purple-800/40 rounded-lg px-3 py-2.5 text-sm text-purple-300 hover:bg-purple-900/50 transition-colors text-left"
        >
          <span className="block font-medium">Hỏi Đáp Tự Do</span>
          <span className="text-xs text-gray-500">Hỏi bất kỳ điều gì</span>
        </button>
      </div>

      {/* Chat history */}
      {ai.conversationHistory.length > 0 && mode === 'chat' && (
        <div className="space-y-3 max-h-96 overflow-y-auto" ref={resultRef}>
          {ai.conversationHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-purple-900/40 text-purple-200'
                  : 'bg-gray-800/80 text-gray-300'
              }`}>
                {msg.role === 'assistant' ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} className="ai-content" />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result (for overview/yearly modes) */}
      {ai.result && mode !== 'chat' && (
        <div ref={resultRef} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(ai.result) }} className="ai-content" />
        </div>
      )}

      {/* Loading state */}
      {ai.loading && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 text-center space-y-3">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Đang phân tích lá số...</p>
          <p className="text-xs text-gray-600">Khoảng 10-15 giây</p>
        </div>
      )}

      {/* Error state */}
      {ai.error && (
        <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-400">{ai.error}</p>
          </div>
          <button
            onClick={() => {
              if (mode === 'overview') handleOverview();
              else if (mode === 'yearly') handleYearly();
            }}
            className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Thử lại
          </button>
        </div>
      )}

      {/* Quick questions */}
      {(mode === 'idle' || mode === 'chat') && !ai.loading && (
        <div className="flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAskQuestion(q)}
              disabled={ai.loading || ai.cooldown > 0}
              className="text-xs bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-purple-300 hover:border-purple-700/50 rounded-full px-3 py-1 transition-colors disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ví dụ: Tôi có nên chuyển việc năm nay?"
          disabled={ai.loading}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
        />
        <button
          onClick={() => handleAskQuestion()}
          disabled={ai.loading || ai.cooldown > 0 || !question.trim()}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
        >
          {ai.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 leading-relaxed">
        Phân tích được tạo bởi AI (Claude), chỉ mang tính tham khảo giải trí. Không thay thế tư vấn chuyên gia.
        Tử Vi không quyết định cuộc đời — bạn mới là người nắm giữ vận mệnh của mình.
      </p>

      {/* API Key Modal */}
      {showKeyModal && (
        <APIKeyModal
          onClose={() => setShowKeyModal(false)}
          onSaved={() => setShowKeyModal(false)}
        />
      )}
    </div>
  );
}
