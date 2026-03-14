import { useState, useRef, type ReactNode } from 'react';
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

// --- AI Content Renderer: smart parsing + styled output ---

type Block =
  | { type: 'system-insight'; system: 'tuvi' | 'thanso' | 'hoangdao'; text: string }
  | { type: 'conclusion'; text: string }
  | { type: 'agreement'; text: string }
  | { type: 'difference'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; listType: 'ul' | 'ol'; items: string[] };

interface Section {
  heading?: string;
  emoji?: string;
  rating?: number;
  blocks: Block[];
}

function extractEmoji(text: string): string | undefined {
  const match = text.match(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u);
  return match ? match[0] : undefined;
}

function extractRating(text: string): number | undefined {
  const stars = text.match(/[⭐]+/);
  if (!stars) return undefined;
  return stars[0].length;
}

function parseIntoSections(raw: string): Section[] {
  const lines = raw.split('\n');
  const sections: Section[] = [];
  let current: Section = { blocks: [] };
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length === 0) return;
    current.blocks.push({ type: 'list', listType: listType!, items: [...listItems] });
    listItems = [];
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    // Headings
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList();
      if (current.blocks.length > 0 || current.heading) {
        sections.push(current);
      }
      const headingText = trimmed.replace(/^#+\s*/, '');
      const emoji = extractEmoji(headingText);
      const rating = extractRating(headingText);
      current = {
        heading: headingText.replace(/[\u2B50\u2606]/g, '').replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, '').trim(),
        emoji,
        rating,
        blocks: [],
      };
      continue;
    }

    // [Tử Vi]: ...
    if (trimmed.startsWith('[Tử Vi]') || trimmed.startsWith('[Tử vi]')) {
      flushList();
      const text = trimmed.replace(/^\[Tử [Vv]i\]:?\s*/, '');
      current.blocks.push({ type: 'system-insight', system: 'tuvi', text });
      continue;
    }

    // [Thần Số]: ...
    if (trimmed.startsWith('[Thần Số]') || trimmed.startsWith('[Thần số]')) {
      flushList();
      const text = trimmed.replace(/^\[Thần [Ss]ố\]:?\s*/, '');
      current.blocks.push({ type: 'system-insight', system: 'thanso', text });
      continue;
    }

    // [Hoàng Đạo]: ...
    if (trimmed.startsWith('[Hoàng Đạo]') || trimmed.startsWith('[Hoàng đạo]')) {
      flushList();
      const text = trimmed.replace(/^\[Hoàng [Đđ]ạo\]:?\s*/, '');
      current.blocks.push({ type: 'system-insight', system: 'hoangdao', text });
      continue;
    }

    // → conclusion
    if (trimmed.startsWith('→') || trimmed.startsWith('->')) {
      flushList();
      const text = trimmed.replace(/^(→|->)\s*(Kết hợp:?)?\s*/, '');
      current.blocks.push({ type: 'conclusion', text });
      continue;
    }

    // ✅ agreement
    if (trimmed.startsWith('✅')) {
      flushList();
      current.blocks.push({ type: 'agreement', text: trimmed.replace('✅', '').trim() });
      continue;
    }

    // ⚠️ or 🔄 difference
    if (trimmed.startsWith('⚠️') || trimmed.startsWith('🔄')) {
      flushList();
      current.blocks.push({ type: 'difference', text: trimmed.replace(/^(⚠️|🔄)\s*/, '').trim() });
      continue;
    }

    // Bullet lists
    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
    if (isBullet) {
      if (listType !== 'ul') { flushList(); listType = 'ul'; }
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Numbered lists
    const isNumbered = /^\d+\.\s/.test(trimmed);
    if (isNumbered) {
      if (listType !== 'ol') { flushList(); listType = 'ol'; }
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
      continue;
    }

    // Regular paragraph
    flushList();
    current.blocks.push({ type: 'paragraph', text: trimmed });
  }

  flushList();
  if (current.blocks.length > 0 || current.heading) {
    sections.push(current);
  }

  return sections;
}

function formatInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-100 font-medium">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

const SYSTEM_CONFIG = {
  tuvi: {
    label: 'Tử Vi',
    icon: '🔮',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-400',
    borderColor: 'border-l-purple-500',
  },
  thanso: {
    label: 'Thần Số',
    icon: '🔢',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
    borderColor: 'border-l-amber-500',
  },
  hoangdao: {
    label: 'Hoàng Đạo',
    icon: '♈',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-400',
    borderColor: 'border-l-blue-500',
  },
} as const;

function SystemInsight({ system, text }: { system: 'tuvi' | 'thanso' | 'hoangdao'; text: string }) {
  const config = SYSTEM_CONFIG[system];
  return (
    <div className={`border-l-[3px] ${config.borderColor} pl-3 py-1.5 my-1`}>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText} mb-1`}>
        {config.icon} {config.label}
      </span>
      <p className="text-gray-300 text-sm leading-relaxed">{formatInline(text)}</p>
    </div>
  );
}

function ConclusionCard({ text }: { text: string }) {
  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg px-4 py-3 my-2">
      <p className="text-white text-sm font-medium leading-relaxed">
        <span className="text-purple-400 mr-1">💡</span> {formatInline(text)}
      </p>
    </div>
  );
}

function AgreementBadge({ text }: { text: string }) {
  return (
    <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-4 py-2 my-1">
      <p className="text-emerald-300 text-sm">
        <span className="font-semibold">✅ Đồng nhất:</span> {formatInline(text)}
      </p>
    </div>
  );
}

function DifferenceBadge({ text }: { text: string }) {
  return (
    <div className="bg-yellow-900/15 border border-yellow-500/15 rounded-lg px-4 py-2 my-1">
      <p className="text-yellow-300 text-sm">
        <span className="font-semibold">🔄 Góc nhìn khác:</span> {formatInline(text)}
      </p>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 bg-yellow-900/30 px-2 py-0.5 rounded text-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>⭐</span>
      ))}
    </span>
  );
}

function RenderSection({ section }: { section: Section }) {
  return (
    <div className="mb-6">
      {section.heading && (
        <div className="flex items-center gap-2 mb-3">
          {section.emoji && <span className="text-xl">{section.emoji}</span>}
          <h3 className="text-lg font-bold text-white">{section.heading}</h3>
          {section.rating && <StarRating rating={section.rating} />}
        </div>
      )}
      <div className="space-y-1.5">
        {section.blocks.map((block, i) => {
          switch (block.type) {
            case 'system-insight':
              return <SystemInsight key={i} system={block.system} text={block.text} />;
            case 'conclusion':
              return <ConclusionCard key={i} text={block.text} />;
            case 'agreement':
              return <AgreementBadge key={i} text={block.text} />;
            case 'difference':
              return <DifferenceBadge key={i} text={block.text} />;
            case 'list': {
              const Tag = block.listType === 'ol' ? 'ol' : 'ul';
              const cls = block.listType === 'ol' ? 'list-decimal' : 'list-disc';
              return (
                <Tag key={i} className={`space-y-1 ml-4 ${cls} text-sm text-gray-300 leading-relaxed`}>
                  {block.items.map((item, j) => <li key={j}>{formatInline(item)}</li>)}
                </Tag>
              );
            }
            case 'paragraph':
              return <p key={i} className="text-sm text-gray-300 leading-relaxed">{formatInline(block.text)}</p>;
          }
        })}
      </div>
    </div>
  );
}

function AIContentRenderer({ content }: { content: string }) {
  const sections = parseIntoSections(content);
  return (
    <div className="ai-content space-y-4">
      {sections.map((section, i) => (
        <RenderSection key={i} section={section} />
      ))}
    </div>
  );
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
                      <AIContentRenderer content={msg.content} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Result (non-chat mode) */}
          {result && conversationHistory.length === 0 && (
            <div className="border-t border-gray-800 pt-3">
              <AIContentRenderer content={result} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
