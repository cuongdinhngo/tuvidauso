import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Header() {
  const { pathname } = useLocation();

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
        <nav className="flex gap-4 text-sm">
          <Link to="/" className={linkClass(pathname === '/')}>Trang chủ</Link>
          <Link to="/input" className={linkClass(pathname === '/input' || pathname === '/result')}>Lập lá số</Link>
          <Link to="/compare" className={linkClass(pathname.startsWith('/compare'))}>Hợp Duyên</Link>
        </nav>
      </div>
    </header>
  );
}
