import { Outlet } from 'react-router-dom';
import Header from './Header';
import AISettingsModal from '../shared/AISettingsModal';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-purple-900/30 py-4 text-center text-xs text-gray-500">
        <p>Tử Vi Đẩu Số Online — Kết quả chỉ mang tính tham khảo</p>
      </footer>
      <AISettingsModal />
    </div>
  );
}
