import { useState, useRef, useEffect, type ReactNode, type RefObject, type KeyboardEvent } from 'react';
import { Sparkles, Send, AlertCircle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIMessage } from '../../core/ai/types';

interface AIAnalysisSectionProps {
  title: string;
  quickQuestions: string[];
  onAnalyze: () => void;
  onAskQuestion: (question: string) => void;
  result: string | null;
  initialResult?: string | null;
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

function normalizeSystemLines(rawLines: string[]): string[] {
  const SYSTEM_TAG_RE = /(?:\*\*)?(?:Tử [Vv]i|Thần [Ss]ố|Hoàng [Đđ]ạo)(?:\*\*)?\s*:/g;
  // Match system tag positions for manual splitting (avoids variable-length lookbehind)
  const TAG_POS_RE = /(?:\*\*)?(?:Tử [Vv]i|Thần [Ss]ố|Hoàng [Đđ]ạo)(?:\*\*)?\s*:/g;

  const result: string[] = [];
  for (const line of rawLines) {
    const trimmed = line.trim();
    const matches = trimmed.match(SYSTEM_TAG_RE);
    if (matches && matches.length >= 2) {
      // Find split points: where a system tag starts after sentence-ending punctuation
      const splitPoints: number[] = [];
      let m: RegExpExecArray | null;
      TAG_POS_RE.lastIndex = 0;
      while ((m = TAG_POS_RE.exec(trimmed)) !== null) {
        if (m.index > 0) {
          const before = trimmed.slice(0, m.index).trimEnd();
          if (/[.!?;]$/.test(before)) {
            splitPoints.push(m.index);
          }
        }
      }

      if (splitPoints.length > 0) {
        let prev = 0;
        for (const pos of splitPoints) {
          const chunk = trimmed.slice(prev, pos).trim();
          if (chunk) result.push(normalizeTag(chunk));
          prev = pos;
        }
        const last = trimmed.slice(prev).trim();
        if (last) result.push(normalizeTag(last));
      } else {
        result.push(trimmed);
      }
    } else {
      result.push(trimmed);
    }
  }
  return result;
}

function normalizeTag(text: string): string {
  return text
    .replace(/^\*\*(Tử [Vv]i)\*\*\s*:/, '[$1]:')
    .replace(/^\*\*(Thần [Ss]ố)\*\*\s*:/, '[$1]:')
    .replace(/^\*\*(Hoàng [Đđ]ạo)\*\*\s*:/, '[$1]:')
    .replace(/^(Tử [Vv]i)\s*:/, '[$1]:')
    .replace(/^(Thần [Ss]ố)\s*:/, '[$1]:')
    .replace(/^(Hoàng [Đđ]ạo)\s*:/, '[$1]:');
}

function parseIntoSections(raw: string): Section[] {
  const rawLines = raw.split('\n');
  const lines = normalizeSystemLines(rawLines);
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

    // [Tử Vi]: ... or **Tử Vi**: ... or Tử Vi: ...
    if (/^(?:\[Tử [Vv]i\]|\*\*Tử [Vv]i\*\*|Tử [Vv]i)\s*:/.test(trimmed)) {
      flushList();
      const text = trimmed.replace(/^(?:\[Tử [Vv]i\]|\*\*Tử [Vv]i\*\*|Tử [Vv]i)\s*:\s*/, '');
      current.blocks.push({ type: 'system-insight', system: 'tuvi', text });
      continue;
    }

    // [Thần Số]: ... or **Thần Số**: ... or Thần Số: ...
    if (/^(?:\[Thần [Ss]ố\]|\*\*Thần [Ss]ố\*\*|Thần [Ss]ố)\s*:/.test(trimmed)) {
      flushList();
      const text = trimmed.replace(/^(?:\[Thần [Ss]ố\]|\*\*Thần [Ss]ố\*\*|Thần [Ss]ố)\s*:\s*/, '');
      current.blocks.push({ type: 'system-insight', system: 'thanso', text });
      continue;
    }

    // [Hoàng Đạo]: ... or **Hoàng Đạo**: ... or Hoàng Đạo: ...
    if (/^(?:\[Hoàng [Đđ]ạo\]|\*\*Hoàng [Đđ]ạo\*\*|Hoàng [Đđ]ạo)\s*:/.test(trimmed)) {
      flushList();
      const text = trimmed.replace(/^(?:\[Hoàng [Đđ]ạo\]|\*\*Hoàng [Đđ]ạo\*\*|Hoàng [Đđ]ạo)\s*:\s*/, '');
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

const INLINE_SYSTEM_STYLES: Record<string, { label: string; color: string }> = {
  'Tử Vi': { label: 'Tử Vi', color: 'text-purple-400' },
  'Tử vi': { label: 'Tử Vi', color: 'text-purple-400' },
  'Thần Số': { label: 'Thần Số', color: 'text-amber-400' },
  'Thần số': { label: 'Thần Số', color: 'text-amber-400' },
  'Hoàng Đạo': { label: 'Hoàng Đạo', color: 'text-blue-400' },
  'Hoàng đạo': { label: 'Hoàng Đạo', color: 'text-blue-400' },
};

function formatInline(text: string): ReactNode {
  // Split on **bold** and [System] inline references
  const parts = text.split(/(\*\*[^*]+\*\*|\[(?:Tử [Vv]i|Thần [Ss]ố|Hoàng [Đđ]ạo)\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-100 font-medium">{part.slice(2, -2)}</strong>;
    }
    // Inline system badge: [Tử Vi], [Thần Số], [Hoàng Đạo]
    const sysMatch = part.match(/^\[(Tử [Vv]i|Thần [Ss]ố|Hoàng [Đđ]ạo)\]$/);
    if (sysMatch) {
      const style = INLINE_SYSTEM_STYLES[sysMatch[1]];
      if (style) {
        return <span key={i} className={`${style.color} font-semibold`}>{style.label}</span>;
      }
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

// --- Chat sub-components ---

function UserBubble({ message }: { message: AIMessage }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-purple-600/20 border border-purple-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
        <p className="text-purple-100 text-sm">{message.displayContent || message.content}</p>
      </div>
    </div>
  );
}

function AIBubble({ message }: { message: AIMessage }) {
  const content = message.displayContent || message.content;
  return (
    <div className="flex justify-start mb-3 gap-2">
      <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center shrink-0 mt-1">
        <span className="text-xs">🤖</span>
      </div>
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
        <AIContentRenderer content={content} />
        <SystemsUsedBadge content={content} />
      </div>
    </div>
  );
}

function SystemsUsedBadge({ content }: { content: string }) {
  const systems: { key: string; icon: string; label: string; color: string }[] = [];

  if (content.includes('[Tử Vi]') || content.includes('Tử Vi')) {
    systems.push({ key: 'tv', icon: '🔮', label: 'Tử Vi', color: 'text-purple-400 bg-purple-400/10' });
  }
  if (content.includes('[Thần Số]') || content.includes('Thần Số')) {
    systems.push({ key: 'ts', icon: '🔢', label: 'Thần Số', color: 'text-amber-400 bg-amber-400/10' });
  }
  if (content.includes('[Hoàng Đạo]') || content.includes('Hoàng Đạo')) {
    systems.push({ key: 'hd', icon: '♈', label: 'Hoàng Đạo', color: 'text-blue-400 bg-blue-400/10' });
  }

  if (systems.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-700/30">
      <span className="text-gray-600 text-xs">Nguồn:</span>
      {systems.map(s => (
        <span key={s.key} className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${s.color}`}>
          {s.icon} {s.label}
        </span>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3 gap-2">
      <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center shrink-0 mt-1">
        <span className="text-xs">🤖</span>
      </div>
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Đang phân tích</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickQuestions({ questions, onSelect, onAnalyze, disabled }: {
  questions: string[];
  onSelect: (q: string) => void;
  onAnalyze: () => void;
  disabled: boolean;
}) {
  return (
    <div className="px-4 py-6">
      <p className="text-gray-400 text-sm text-center mb-4">
        Hỏi AI bất kỳ điều gì về lá số của bạn
      </p>
      <button
        onClick={onAnalyze}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors mb-3"
      >
        <Sparkles className="w-4 h-4" />
        Phân Tích Tổng Hợp
      </button>
      <div className="grid grid-cols-2 gap-2">
        {questions.map(q => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50
                       border border-gray-700/50 hover:border-purple-500/30
                       rounded-xl px-3 py-2.5 text-left transition-all disabled:opacity-40"
          >
            <span className="text-gray-300 text-xs leading-tight">{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function generateFollowUpSuggestions(content: string, fallbackQuestions: string[]): string[] {
  const suggestions: string[] = [];
  const lower = content.toLowerCase();

  const topicMap: [string[], string][] = [
    [['sự nghiệp', 'nghề', 'quan lộc', 'công việc', 'career'], 'Tháng nào tốt nhất để thay đổi công việc?'],
    [['tài chính', 'tiền', 'tài bạch', 'đầu tư', 'thu nhập'], 'Chiến lược tài chính tối ưu theo cả 3 hệ thống?'],
    [['tình yêu', 'phu thê', 'hôn nhân', 'đối tượng', 'bạn đời'], 'Người phù hợp nhất với tôi theo cả 3?'],
    [['sức khỏe', 'tật ách', 'bệnh', 'cơ thể'], 'Bộ phận nào cần chú ý nhất năm nay?'],
    [['đại hạn', 'tiểu hạn', 'lưu niên', 'vận hạn'], 'Phân tích chi tiết Tứ Hóa lưu niên?'],
    [['năm nay', '2026', '2025', 'năm cá nhân'], 'Tháng nào tốt nhất và xấu nhất năm nay?'],
    [['lãnh đạo', 'quản lý', 'kinh doanh'], 'Phong cách lãnh đạo phù hợp nhất với tôi?'],
    [['sáng tạo', 'nghệ thuật', 'nghiên cứu'], 'Làm sao phát huy tối đa khả năng sáng tạo?'],
    [['nợ nghiệp', 'karmic', 'số thiếu'], 'Nợ nghiệp ảnh hưởng cuộc sống thế nào?'],
    [['tử vi', 'thần số', 'hoàng đạo', 'đồng nhất', 'khác biệt'], 'Điểm nào cả 3 hệ thống đồng nhất nhất?'],
  ];

  for (const [keywords, question] of topicMap) {
    if (keywords.some(kw => lower.includes(kw))) {
      suggestions.push(question);
    }
    if (suggestions.length >= 4) break;
  }

  if (suggestions.length < 3) {
    for (const q of fallbackQuestions) {
      if (!suggestions.includes(q)) {
        suggestions.push(q);
      }
      if (suggestions.length >= 4) break;
    }
  }

  return suggestions.slice(0, 4);
}

function FollowUpSuggestions({ content, fallbackQuestions, onSelect }: {
  content: string;
  fallbackQuestions: string[];
  onSelect: (q: string) => void;
}) {
  const suggestions = generateFollowUpSuggestions(content, fallbackQuestions);
  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto">
      {suggestions.map(s => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="whitespace-nowrap text-xs bg-gray-800/50 hover:bg-purple-900/30
                     border border-gray-700/30 hover:border-purple-500/30
                     rounded-full px-3 py-1.5 text-gray-400 hover:text-purple-300
                     transition-all shrink-0"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function ChatInput({ value, onChange, onSend, isLoading, inputRef }: {
  value: string;
  onChange: (v: string) => void;
  onSend: (v: string) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) onSend(value.trim());
    }
  };

  return (
    <div className="px-4 py-2 border-t border-gray-800">
      <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50
                      rounded-xl px-3 py-2 focus-within:border-purple-500/50 transition">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi AI bất kỳ điều gì..."
          disabled={isLoading}
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500
                     outline-none disabled:opacity-50"
        />
        <button
          onClick={() => { if (value.trim() && !isLoading) onSend(value.trim()); }}
          disabled={!value.trim() || isLoading}
          className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500
                     disabled:bg-gray-700 disabled:opacity-50 transition"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

// --- Main component ---

export default function AIAnalysisSection({
  title,
  quickQuestions,
  onAnalyze,
  onAskQuestion,
  result,
  initialResult,
  loading,
  error,
  conversationHistory = [],
}: AIAnalysisSectionProps) {
  const [question, setQuestion] = useState('');
  const [expanded, setExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = conversationHistory.length > 0 || result !== null || initialResult !== null;

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, result, loading]);

  const handleSend = (text: string) => {
    setQuestion('');
    onAskQuestion(text);
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {expanded && (
        <div className="flex flex-col">
          {/* Quick questions — empty state */}
          {!hasMessages && !loading && (
            <QuickQuestions
              questions={quickQuestions}
              onSelect={handleSend}
              onAnalyze={onAnalyze}
              disabled={loading}
            />
          )}

          {/* Chat area */}
          {(hasMessages || loading || error) && (
            <div className="overflow-y-auto px-4 py-3 space-y-1 max-h-[60vh]">
              {/* Initial analysis result — always show at top */}
              {initialResult && (
                <AIBubble message={{ role: 'assistant', content: initialResult, displayContent: initialResult }} />
              )}

              {/* Conversation messages */}
              {conversationHistory.map((msg, i) => (
                msg.role === 'user'
                  ? <UserBubble key={i} message={msg} />
                  : <AIBubble key={i} message={msg} />
              ))}

              {/* Loading indicator */}
              {loading && <TypingIndicator />}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2.5 mb-2">
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

              <div ref={chatEndRef} />
            </div>
          )}

          {/* Follow-up suggestions — after AI response, not loading */}
          {hasMessages && !loading && (() => {
            const lastAssistant = [...conversationHistory].reverse().find(m => m.role === 'assistant');
            const lastContent = lastAssistant?.content || initialResult || '';
            return (
              <FollowUpSuggestions
                content={lastContent}
                fallbackQuestions={quickQuestions}
                onSelect={handleSend}
              />
            );
          })()}

          {/* Input bar */}
          <ChatInput
            value={question}
            onChange={setQuestion}
            onSend={handleSend}
            isLoading={loading}
            inputRef={inputRef}
          />

          {/* Disclaimer */}
          <p className="text-center text-gray-600 text-xs py-1">
            AI phân tích chỉ mang tính tham khảo
          </p>
        </div>
      )}
    </div>
  );
}
