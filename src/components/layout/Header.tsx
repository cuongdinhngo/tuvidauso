import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Settings } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';

export default function Header() {
  const { pathname } = useLocation();
  const apiKey = useAIStore((s) => s.apiKey);
  const setShowApiKeyModal = useAIStore((s) => s.setShowApiKeyModal);

  const linkClass = (active: boolean) =>
    active
      ? 'text-purple-300 font-medium transition-colors'
      : 'text-gray-400 hover:text-purple-300 transition-colors';

  return (
    <header className="border-b border-purple-900/50 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-purple-300 hover:text-purple-200 transition-colors">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <span>Tử Vi Đẩu Số</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm">
            <Link to="/" className={linkClass(pathname === '/')}>Trang chủ</Link>
            <Link to="/input" className={linkClass(pathname === '/input' || pathname === '/result')}>Lập lá số</Link>
            <Link to="/calendar" className={linkClass(pathname.startsWith('/calendar'))}>Xem Ngày</Link>
            <Link to="/compare" className={linkClass(pathname.startsWith('/compare'))}>Hợp Duyên</Link>
          </nav>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="relative text-gray-500 hover:text-purple-300 transition-colors"
            title="Cài đặt AI"
          >
            <Settings className="w-4 h-4" />
            {apiKey && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
