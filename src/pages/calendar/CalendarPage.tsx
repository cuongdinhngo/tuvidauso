import { CalendarDays, Search, Sun } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';
import MonthlyCalendar from '../../components/calendar/MonthlyCalendar';
import GoodDayPicker from '../../components/calendar/GoodDayPicker';
import TodayDigest from '../../components/calendar/TodayDigest';

type Tab = 'calendar' | 'pick' | 'today';

const TABS: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: 'calendar', label: 'Lịch Tháng', icon: CalendarDays },
  { id: 'pick', label: 'Chọn Ngày Tốt', icon: Search },
  { id: 'today', label: 'Hôm Nay', icon: Sun },
];

export default function CalendarPage() {
  const activeTab = useCalendarStore((s) => s.activeTab);
  const setActiveTab = useCalendarStore((s) => s.setActiveTab);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-purple-300 mb-6 text-center">Xem Ngày Tốt</h1>

      {/* Tab bar */}
      <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === id
                ? 'text-purple-300 border-b-2 border-purple-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'calendar' && <MonthlyCalendar />}
      {activeTab === 'pick' && <GoodDayPicker />}
      {activeTab === 'today' && <TodayDigest />}
    </div>
  );
}
