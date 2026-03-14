import { useState, useRef } from 'react';
import { Sparkles, Send, Loader2, AlertCircle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIMessage } from '../../core/ai/types';

interface AIAnalysisSectionProps {
  title: string;
  description: string;
  quickQuestions: string[];
  onAnalyze: () => void;
  onAskQuestion: (question: string) => void;
  result: string | null;
  loading: boolean;
  error: string | null;
  conversationHistory?: AIMessage[];
}

type ListType = 'ul' | 'ol';

function FormatAIResponse({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: ListType | null = null;
  let listKey = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    const cls = listType === 'ol' ? 'list-decimal' : 'list-disc';
    elements.push(
      <Tag key={`list-${listKey}`} className={`space-y-1 ml-4 ${cls} text-sm text-gray-300 leading-relaxed`}>
        {listItems}
      </Tag>,
    );
    listItems = [];
    listType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = line.startsWith('- ') || line.startsWith('* ');
    const isNumbered = /^\d+\.\s/.test(line);

    if (isBullet) {
      if (listType !== 'ul') { flushList(); listType = 'ul'; listKey = i; }
      listItems.push(<li key={i}>{formatInline(line.slice(2))}</li>);
    } else if (isNumbered) {
      if (listType !== 'ol') { flushList(); listType = 'ol'; listKey = i; }
      listItems.push(<li key={i}>{formatInline(line.replace(/^\d+\.\s/, ''))}</li>);
    } else {
      flushList();
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={i} className="text-base font-semibold text-purple-300 mt-5 mb-2">
            {line.slice(3)}
          </h3>,
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h4 key={i} className="text-sm font-semibold text-purple-200 mt-3 mb-1">
            {line.slice(4)}
          </h4>,
        );
      } else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-sm text-gray-300 leading-relaxed">
            {formatInline(line)}
          </p>,
        );
      }
    }
  }
  flushList();

  return <div>{elements}</div>;
}

function formatInline(text: string): React.ReactNode {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-100 font-medium">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function AIAnalysisSection({
  title,
  description,
  quickQuestions,
  onAnalyze,
  onAskQuestion,
  result,
  loading,
  error,
  conversationHistory = [],
}: AIAnalysisSectionProps) {
  const [question, setQuestion] = useState('');
  const [expanded, setExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const q = question.trim();
    if (!q || loading) return;
    setQuestion('');
    onAskQuestion(q);
  };

  const handleQuickQuestion = (q: string) => {
    setQuestion('');
    onAskQuestion(q);
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold text-purple-300">{title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-xs text-gray-500">{description}</p>

          {/* Main analyze button */}
          {!result && !loading && (
            <button
              onClick={onAnalyze}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Phân Tích Tổng Hợp
            </button>
          )}

          {/* Quick questions */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Hoặc hỏi cụ thể:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  disabled={loading}
                  className="text-[11px] bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-400 hover:text-gray-200 border border-gray-700 rounded-full px-2.5 py-1 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Custom question input */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi AI bất kỳ điều gì..."
              disabled={loading}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={!question.trim() || loading}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 py-6 justify-center">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-sm text-gray-400">AI đang phân tích...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={onAnalyze}
                  className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200 mt-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Conversation history */}
          {conversationHistory.length > 0 && (
            <div className="space-y-3 border-t border-gray-800 pt-3">
              {conversationHistory.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                  {msg.role === 'user' ? (
                    <div className="inline-block bg-purple-900/40 border border-purple-800/30 rounded-lg px-3 py-2 text-sm text-purple-200 max-w-[85%] text-left">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3">
                      <FormatAIResponse text={msg.content} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Result (non-chat mode) */}
          {result && conversationHistory.length === 0 && (
            <div className="border-t border-gray-800 pt-3">
              <FormatAIResponse text={result} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
