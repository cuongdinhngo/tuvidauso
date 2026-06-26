import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Star, Clock, Columns3, Grid3X3, BookOpen, TrendingUp, Trash2, Heart, CalendarDays } from 'lucide-react';
import { useTuViStore, type ChartHistoryEntry } from '../store/tuViStore';
import { DIA_CHI_HOURS } from '../core/types';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const FEATURES = [
  { title: 'Bát Tự', desc: 'Tứ Trụ, Ngũ Hành, Thập Thần, Nhật Chủ, Đại Vận', icon: Columns3 },
  { title: 'Tử Vi', desc: '14 chính tinh, 60+ phụ tinh, Tứ Hóa, Tuần Triệt', icon: Grid3X3 },
  { title: 'Luận Giải', desc: '210 quy tắc luận giải, tam hợp chiếu, đánh giá sao', icon: BookOpen },
  { title: 'Vận Hạn', desc: 'Đại hạn, tiểu hạn, lưu niên Tứ Hóa 3 tầng', icon: TrendingUp },
  { title: 'Hợp Duyên', desc: 'So sánh tương hợp, 7 tiêu chí phân tích, xếp hạng', icon: Heart, link: '/compare' },
  { title: 'Xem Ngày', desc: 'Lịch Vạn Niên, chọn ngày tốt, giờ Hoàng Đạo', icon: CalendarDays, link: '/calendar' },
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
    <div className="stagger-in flex flex-col items-center px-4 max-w-5xl mx-auto">
      {/* Hero */}
      <section style={{ ['--i' as string]: 0 }} className="text-center pt-16 pb-12 md:pt-20 md:pb-16">
        <Sparkles className="w-12 h-12 text-gold mx-auto mb-5" />
        <h1 className="font-display text-h1 md:text-[3.25rem] md:leading-[1.05] font-bold text-ink mb-4">
          Tử Vi Đẩu Số
        </h1>
        <p className="text-ink-muted max-w-lg mx-auto text-lg mb-2">
          Lập lá số Tử Vi Đẩu Số miễn phí, tính toán hoàn toàn trên trình duyệt.
        </p>
        <p className="text-ink-muted/70 text-sm mb-8">
          Hơn 100 sao, Bát Tự Tứ Trụ, luận giải vận mệnh và tam hợp chiếu.
        </p>

        <Link to="/input" className="inline-block group">
          <Button size="lg">
            <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Lập Lá Số
          </Button>
        </Link>
      </section>

      {/* Feature cards */}
      <section style={{ ['--i' as string]: 1 }} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {FEATURES.map(({ title, desc, icon: Icon, link }) => {
          const card = (
            <Card interactive className="h-full flex flex-col items-center text-center group">
              <Icon className="w-8 h-8 text-gold mb-3" />
              <h3 className="font-display text-ink font-semibold mb-1">{title}</h3>
              <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
            </Card>
          );
          return link
            ? <Link key={title} to={link} className="block h-full">{card}</Link>
            : <div key={title} className="h-full">{card}</div>;
        })}
      </section>

      {/* Stats row */}
      <section style={{ ['--i' as string]: 2 }} className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-x-12">
        {STATS.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="font-display text-2xl font-bold text-gold">{value}</div>
            <div className="text-xs text-ink-muted mt-0.5">{label}</div>
          </div>
        ))}
      </section>

      {/* Recent history */}
      {history.length > 0 && (
        <section style={{ ['--i' as string]: 3 }} className="mt-14 w-full max-w-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-ink-muted flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Lá số gần đây
            </h2>
            <button
              onClick={clearHistory}
              className="text-xs text-ink-muted hover:text-bad flex items-center gap-1 transition-colors min-h-[36px] px-2"
            >
              <Trash2 className="w-3 h-3" /> Xóa
            </button>
          </div>
          <div className="space-y-2">
            {history.slice(0, 5).map((entry, i) => (
              <button
                key={i}
                onClick={() => loadChart(entry)}
                className="w-full text-left bg-surface border border-white/[0.08] hover:border-gold/40 rounded-md px-4 py-3 transition-colors hover:bg-raised"
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <span className="text-ink text-sm font-medium">
                      {entry.name || `${entry.solarDate.day}/${entry.solarDate.month}/${entry.solarDate.year}`}
                    </span>
                    <span className="text-ink-muted text-xs ml-2">
                      {entry.gender === 'male' ? 'Nam' : 'Nữ'} &middot; {DIA_CHI_HOURS[entry.hour]?.name}
                    </span>
                  </div>
                  <div className="text-xs text-ink-muted shrink-0">
                    {entry.yearCanChi} &middot; {entry.napAm}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <p style={{ ['--i' as string]: 4 }} className="mt-16 mb-8 text-center text-xs text-ink-muted/70 max-w-md">
        Tử Vi chỉ mang tính tham khảo. Kết quả được tính toán tự động trên trình duyệt.
      </p>
    </div>
  );
}
