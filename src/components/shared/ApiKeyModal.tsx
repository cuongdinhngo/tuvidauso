import { useState } from 'react';
import { X, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { callClaude } from '../../core/ai/claudeService';

const MODELS = [
  { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (Nhanh)' },
  { id: 'claude-opus-4-20250514', label: 'Claude Opus 4 (Mạnh nhất)' },
  { id: 'claude-haiku-4-20250506', label: 'Claude Haiku 4.5 (Tiết kiệm)' },
];

export default function ApiKeyModal() {
  const { apiKey, model, setApiKey, clearApiKey, setModel, showApiKeyModal, setShowApiKeyModal } = useAIStore();
  const [key, setKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testError, setTestError] = useState('');

  if (!showApiKeyModal) return null;

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      setTestResult(null);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    setTestResult(null);
  };

  const handleTest = async () => {
    if (!key.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      await callClaude(
        { apiKey: key.trim(), model },
        { system: 'Respond with OK', messages: [{ role: 'user', content: 'test' }], maxTokens: 10 },
      );
      setTestResult('success');
      setApiKey(key.trim());
    } catch (err: unknown) {
      setTestResult('error');
      setTestError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowApiKeyModal(false)}>
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-purple-300">Cài đặt AI</h2>
          <button onClick={() => setShowApiKeyModal(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">API Key (Anthropic)</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => { setKey(e.target.value); setTestResult(null); }}
                placeholder="sk-ant-..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              Key được lưu trong trình duyệt. Không gửi đến server nào ngoài Anthropic.
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {testResult === 'success' && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 border border-green-800/30 rounded-lg px-3 py-2">
              <Check className="w-4 h-4" /> Kết nối thành công!
            </div>
          )}
          {testResult === 'error' && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
              {testError}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={!key.trim() || testing}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 text-sm rounded-lg px-3 py-2 transition-colors"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Kiểm tra kết nối
            </button>
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm rounded-lg px-3 py-2 transition-colors"
            >
              Lưu
            </button>
          </div>

          {apiKey && (
            <button
              onClick={handleClear}
              className="w-full text-red-400 hover:text-red-300 text-xs py-1 transition-colors"
            >
              Xóa API key
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
