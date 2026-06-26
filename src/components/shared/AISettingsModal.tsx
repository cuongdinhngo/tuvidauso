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
        className="bg-surface border border-white/10 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-raised"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 id="ai-settings-title" className="font-display text-lg font-semibold text-gold">Cài đặt AI</h2>
          <button onClick={() => setShowSettingsModal(false)} className="text-ink-muted hover:text-ink transition-colors" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Provider Selection */}
          <div>
            <label id="provider-group-label" className="block text-sm text-ink-muted mb-2">Chọn nhà cung cấp AI:</label>
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
                    className={`w-full flex items-center gap-3 p-3 rounded-md border transition-colors text-left ${
                      isSelected
                        ? 'border-gold bg-gold/10'
                        : 'border-white/10 bg-raised hover:border-white/25'
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">{p.name}</span>
                        <span className={`text-2xs font-bold px-1.5 py-0.5 rounded-sm border ${
                          p.hasFree
                            ? 'bg-good/15 text-good border-good/30'
                            : 'bg-raised text-ink-muted border-white/10'
                        }`}>
                          {p.hasFree ? 'MIỄN PHÍ' : 'TRẢ PHÍ'}
                        </span>
                        {isActive && (
                          <span className="text-2xs text-gold font-medium">ĐANG DÙNG</span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted mt-0.5 truncate">{p.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-gold' : 'border-white/25'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-gold" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Configuration for selected provider */}
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">Cấu hình {info.name}:</p>

            {/* API Key */}
            <div>
              <label htmlFor="ai-api-key" className="block text-xs text-ink-muted mb-1">API Key</label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="ai-api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setTestResult(null); }}
                  placeholder={info.keyPrefix + '…'}
                  className="w-full bg-raised border border-white/10 rounded-md px-3 py-2 pr-10 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus:border-gold"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
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
                  className="text-2xs text-jade hover:text-jade/80 flex items-center gap-0.5"
                >
                  Lấy API key tại đây <ExternalLink className="w-2.5 h-2.5" />
                </a>
                {info.hasFree && (
                  <span className="text-2xs text-ink-muted"> - Không cần thẻ tín dụng</span>
                )}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label htmlFor="ai-model" className="block text-xs text-ink-muted mb-1">Model</label>
              <select
                id="ai-model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-raised border border-white/10 rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus:border-gold"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Security Disclaimer */}
          <p className="text-2xs text-ink-muted leading-relaxed">
            🔒 Key chỉ lưu trong phiên hiện tại (đóng tab = xóa). API call gửi trực tiếp từ trình duyệt đến nhà cung cấp - không qua server trung gian nào.
          </p>

          {/* Test Result */}
          {testResult === 'success' && (
            <div className="flex items-center gap-2 text-good text-sm bg-good/15 border border-good/30 rounded-md px-3 py-2">
              <Check className="w-4 h-4" /> Kết nối {info.name} thành công!
            </div>
          )}
          {testResult === 'error' && (
            <div className="text-bad text-sm bg-bad/15 border border-bad/30 rounded-md px-3 py-2">
              {testError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={!apiKey.trim() || testing}
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px] bg-raised hover:bg-white/5 border border-white/10 disabled:opacity-40 text-ink text-sm rounded-md px-3 py-2 transition-colors"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Kiểm tra kết nối
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 min-h-[44px] bg-gold hover:bg-gold/90 disabled:opacity-40 text-base font-semibold text-sm rounded-md px-3 py-2 transition-colors"
            >
              Lưu
            </button>
          </div>

          {/* Disconnect */}
          {providerConfig && (
            <button
              onClick={handleDisconnect}
              className="w-full text-bad hover:text-bad/80 text-xs py-1 transition-colors"
            >
              Ngắt kết nối AI
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
