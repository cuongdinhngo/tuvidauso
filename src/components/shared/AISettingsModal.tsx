import { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, Check, Loader2, ExternalLink } from 'lucide-react';
import { useAIStore, getDefaultModel } from '../../store/aiStore';
import { callProvider } from '../../core/ai/callProvider';
import { PROVIDER_MODELS, PROVIDER_INFO, PROVIDER_ORDER } from '../../core/ai/providerData';
import type { AIProviderType } from '../../core/ai/types';

export default function AISettingsModal() {
  const { providerConfig, setProviderConfig, clearProviderConfig, showSettingsModal, setShowSettingsModal } = useAIStore();

  const [selectedType, setSelectedType] = useState<AIProviderType>(providerConfig?.type || 'google');
  const [apiKey, setApiKey] = useState(providerConfig?.apiKey || '');
  const [model, setModel] = useState(providerConfig?.model || getDefaultModel('google'));
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testError, setTestError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // Sync local state when modal opens
  useEffect(() => {
    if (showSettingsModal) {
      setSelectedType(providerConfig?.type || 'google');
      setApiKey(providerConfig?.apiKey || '');
      setModel(providerConfig?.model || getDefaultModel(providerConfig?.type || 'google'));
      setShowKey(false);
      setTestResult(null);
      setTestError('');
    }
  }, [showSettingsModal, providerConfig]);

  // Focus management & escape key
  useEffect(() => {
    if (!showSettingsModal) return;

    previousFocusRef.current = document.activeElement;
    requestAnimationFrame(() => inputRef.current?.focus());

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSettingsModal(false);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [showSettingsModal, setShowSettingsModal]);

  if (!showSettingsModal) return null;

  const handleSelectProvider = (type: AIProviderType) => {
    setSelectedType(type);
    setModel(providerConfig?.type === type ? providerConfig.model : getDefaultModel(type));
    setApiKey(providerConfig?.type === type ? providerConfig.apiKey : '');
    setTestResult(null);
  };

  const handleSave = () => {
    if (!apiKey.trim()) return;
    setProviderConfig({ type: selectedType, apiKey: apiKey.trim(), model });
    setShowSettingsModal(false);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      await callProvider(
        { type: selectedType, apiKey: apiKey.trim(), model },
        { system: 'Respond with OK', messages: [{ role: 'user', content: 'test' }], maxTokens: 10 },
      );
      setTestResult('success');
    } catch (err: unknown) {
      setTestResult('error');
      setTestError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = () => {
    clearProviderConfig();
    setApiKey('');
    setTestResult(null);
  };

  const info = PROVIDER_INFO[selectedType];
  const models = PROVIDER_MODELS[selectedType];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-settings-title"
      onClick={() => setShowSettingsModal(false)}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 id="ai-settings-title" className="text-lg font-semibold text-purple-300">Cài đặt AI</h2>
          <button onClick={() => setShowSettingsModal(false)} className="text-gray-500 hover:text-gray-300 transition-colors" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Provider Selection */}
          <div>
            <label id="provider-group-label" className="block text-sm text-gray-400 mb-2">Chọn nhà cung cấp AI:</label>
            <div role="radiogroup" aria-labelledby="provider-group-label" className="space-y-2">
              {PROVIDER_ORDER.map((type) => {
                const p = PROVIDER_INFO[type];
                const isSelected = selectedType === type;
                const isActive = providerConfig?.type === type;
                return (
                  <button
                    key={type}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectProvider(type)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      isSelected
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-200">{p.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.hasFree
                            ? 'bg-green-900/40 text-green-400 border border-green-800/40'
                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}>
                          {p.hasFree ? 'MIỄN PHÍ' : 'TRẢ PHÍ'}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-purple-400 font-medium">ĐANG DÙNG</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{p.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-purple-500' : 'border-gray-600'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700/50" />

          {/* Configuration for selected provider */}
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Cấu hình {info.name}:</p>

            {/* API Key */}
            <div>
              <label htmlFor="ai-api-key" className="block text-xs text-gray-500 mb-1">API Key</label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="ai-api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
                  placeholder={info.keyPrefix + '...'}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  aria-label={showKey ? 'Ẩn API key' : 'Hiện API key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <a
                  href={info.apiKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
                >
                  Lấy API key tại đây <ExternalLink className="w-2.5 h-2.5" />
                </a>
                {info.hasFree && (
                  <span className="text-[10px] text-gray-600"> — Không cần thẻ tín dụng</span>
                )}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label htmlFor="ai-model" className="block text-xs text-gray-500 mb-1">Model</label>
              <select
                id="ai-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Security Disclaimer */}
          <p className="text-[10px] text-gray-600 leading-relaxed">
            🔒 Key chỉ lưu trong phiên hiện tại (đóng tab = xóa). API call gửi trực tiếp từ trình duyệt đến nhà cung cấp — không qua server trung gian nào.
          </p>

          {/* Test Result */}
          {testResult === 'success' && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 border border-green-800/30 rounded-lg px-3 py-2">
              <Check className="w-4 h-4" /> Kết nối {info.name} thành công!
            </div>
          )}
          {testResult === 'error' && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
              {testError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={!apiKey.trim() || testing}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 text-sm rounded-lg px-3 py-2 transition-colors"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Kiểm tra kết nối
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm rounded-lg px-3 py-2 transition-colors"
            >
              Lưu
            </button>
          </div>

          {/* Disconnect */}
          {providerConfig && (
            <button
              onClick={handleDisconnect}
              className="w-full text-red-400 hover:text-red-300 text-xs py-1 transition-colors"
            >
              Ngắt kết nối AI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
