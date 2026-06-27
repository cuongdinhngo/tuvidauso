import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Settings, Menu, X } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { PROVIDER_INFO } from '../../core/ai/providerData';

export default function Header() {
  const { pathname } = useLocation();
  const providerConfig = useAIStore((s) => s.providerConfig);
  const setShowSettingsModal = useAIStore((s) => s.setShowSettingsModal);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const linkClass = (active: boolean) =>
    active
      ? 'text-gold font-medium transition-colors'
      : 'text-ink-muted hover:text-ink transition-colors';

  const info = providerConfig ? PROVIDER_INFO[providerConfig.type] : null;

  const navLinks = [
    { to: '/', label: 'Trang chủ', active: pathname === '/' },
    { to: '/input', label: 'Lập lá số', active: pathname === '/input' || pathname === '/result' },
    { to: '/calendar', label: 'Xem Ngày', active: pathname.startsWith('/calendar') },
    { to: '/compare', label: 'Hợp Duyên', active: pathname.startsWith('/compare') },
  ];

  const settingsInner = info ? (
    <>
      <span>{info.icon}</span>
      <span className="hidden sm:inline">{info.name.split('(')[0].trim()}</span>
      <span className="text-good">✓</span>
    </>
  ) : (
    <>
      <Settings className="w-4 h-4" />
      <span className="hidden sm:inline">Cài đặt AI</span>
    </>
  );

  return (
    <header className="border-b border-white/[0.08] bg-base/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink hover:text-gold transition-colors">
          <Sparkles className="w-6 h-6 text-gold" />
          <span>Tử Vi Đẩu Số</span>
        </Link>

        {/* Desktop nav (md+) */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex gap-4 text-sm">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass(l.active)}>{l.label}</Link>
            ))}
          </nav>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-gold transition-colors"
            title="Cài đặt AI"
          >
            {settingsInner}
          </button>
        </div>

        {/* Mobile hamburger toggle (below md) */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2 text-ink-muted hover:text-gold transition-colors"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown panel (below md) */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/[0.08] bg-base/95 backdrop-blur-sm px-4 py-2">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center min-h-[44px] text-sm ${linkClass(l.active)}`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { setShowSettingsModal(true); setMenuOpen(false); }}
            className="flex items-center gap-1.5 min-h-[44px] w-full text-sm text-ink-muted hover:text-gold transition-colors"
            title="Cài đặt AI"
          >
            {settingsInner}
          </button>
        </nav>
      )}
    </header>
  );
}
