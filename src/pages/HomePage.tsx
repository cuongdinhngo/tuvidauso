import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Star, Clock, Columns3, Grid3X3, BookOpen, TrendingUp, Trash2 } from 'lucide-react';
import { useTuViStore, type ChartHistoryEntry } from '../store/tuViStore';
import { DIA_CHI_HOURS } from '../core/types';

const FEATURES = [
  { title: 'Bát Tự', desc: 'Tứ Trụ, Ngũ Hành, Thập Thần, Nhật Chủ, Đại Vận', icon: Columns3 },
  { title: 'Tử Vi', desc: '14 chính tinh, 60+ phụ tinh, Tứ Hóa, Tuần Triệt', icon: Grid3X3 },
  { title: 'Luận Giải', desc: '210 quy tắc luận giải, tam hợp chiếu, đánh giá ⭐', icon: BookOpen },
  { title: 'Vận Hạn', desc: 'Đại hạn, tiểu hạn, lưu niên Tứ Hóa 3 tầng', icon: TrendingUp },
];

const STATS = [
  { label: 'Chính Tinh', value: '14' },
  { label: 'Phụ Tinh', value: '60+' },
  { label: 'Tứ Hóa', value: '3 tầng' },
  { label: 'Cung', value: '12' },
  { label: 'Đại Hạn', value: '120 năm' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const calculate = useTuViStore((s) => s.calculate);
  const [history, setHistory] = useState<ChartHistoryEntry[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tuvi_history') || '[]');
      setHistory(saved);
    } catch { /* ignore */ }
  }, []);

  function loadChart(entry: ChartHistoryEntry) {
    calculate({
      name: entry.name,
      solarDate: entry.solarDate,
      hour: entry.hour,
      gender: entry.gender,
    });
    navigate('/result');
  }

  function clearHistory() {
    localStorage.removeItem('tuvi_history');
    setHistory([]);
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4">
      {/* Hero */}
      <div className="relative text-center py-16 md:py-24">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse" />
        </div>

        <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-[pulse_3s_ease-in-out_infinite]" />
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 via-purple-300 to-yellow-200 bg-clip-text text-transparent mb-4">
          Tử Vi Đẩu Số
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-lg mb-2">
          Lập lá số Tử Vi Đẩu Số miễn phí — Tính toán hoàn toàn trên trình duyệt
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Hơn 100 sao &bull; Bát Tự Tứ Trụ &bull; Luận Giải Vận Mệnh &bull; Tam Hợp Chiếu
        </p>

        <Link
          to="/input"
          className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
        >
          <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Lập Lá Số
        </Link>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full">
        {FEATURES.map(({ title, desc, icon: Icon }) => (
          <div
            key={title}
            className="p-5 rounded-xl border border-purple-900/30 bg-gray-900/50 hover:border-purple-700/50 hover:bg-gray-900/80 transition-all hover:scale-[1.02] group"
          >
            <Icon className="w-8 h-8 text-purple-400 mb-3 group-hover:text-purple-300 transition-colors" />
            <h3 className="text-purple-300 font-semibold mb-1">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
        {STATS.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-bold text-purple-300">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent history */}
      {history.length > 0 && (
        <div className="mt-14 w-full max-w-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Lá số gần đây
            </h2>
            <button
              onClick={clearHistory}
              className="text-xs text-gray-600 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Xóa
            </button>
          </div>
          <div className="space-y-2">
            {history.slice(0, 5).map((entry, i) => (
              <button
                key={i}
                onClick={() => loadChart(entry)}
                className="w-full text-left bg-gray-900/80 border border-gray-800 hover:border-purple-700 rounded-lg px-4 py-3 transition-all hover:bg-gray-900"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-200 text-sm font-medium">
                      {entry.name || `${entry.solarDate.day}/${entry.solarDate.month}/${entry.solarDate.year}`}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">
                      {entry.gender === 'male' ? 'Nam' : 'Nữ'} &bull; {DIA_CHI_HOURS[entry.hour]?.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.yearCanChi} &bull; {entry.napAm}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 mb-8 text-center space-y-2">
        <p className="text-xs text-gray-600">
          Tử Vi chỉ mang tính tham khảo. Kết quả được tính toán tự động trên trình duyệt.
        </p>
        <p className="text-xs text-gray-700">
          Powered by Claude Code &bull; v1.0
        </p>
      </footer>
    </div>
  );
}
