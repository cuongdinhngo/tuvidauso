import { useState } from 'react';
import { X, Eye, EyeOff, Key } from 'lucide-react';
import { getApiKey, setApiKey, clearApiKey } from '../../services/claudeAPI';

interface APIKeyModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function APIKeyModal({ onClose, onSaved }: APIKeyModalProps) {
  const [key, setKey] = useState(getApiKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Vui lòng nhập API key.');
      return;
    }
    if (!trimmed.startsWith('sk-ant-')) {
      setError('API key phải bắt đầu bằng "sk-ant-". Kiểm tra lại key của bạn.');
      return;
    }
    setApiKey(trimmed);
    onSaved();
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-100">Nhập Claude API Key</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-400">
          Để sử dụng tính năng AI Luận Giải, bạn cần API key từ Anthropic.
        </p>

        {/* Input */}
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            placeholder="sk-ant-api03-..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Xác nhận
          </button>
          {getApiKey() && (
            <button
              onClick={handleClear}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm transition-colors"
            >
              Xóa key
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Bỏ qua
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-gray-500">
          Key chỉ được lưu trên trình duyệt của bạn (localStorage), không gửi đến server nào khác ngoài Anthropic API.
          Lấy API key tại console.anthropic.com
        </p>
      </div>
    </div>
  );
}
