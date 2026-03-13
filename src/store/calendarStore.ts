import { create } from 'zustand';

interface CalendarStore {
  viewMonth: number;
  viewYear: number;
  selectedDate: { year: number; month: number; day: number } | null;
  activeTab: 'calendar' | 'pick' | 'today';

  selectDate: (date: { year: number; month: number; day: number } | null) => void;
  setActiveTab: (tab: 'calendar' | 'pick' | 'today') => void;
  navigateMonth: (delta: number) => void;
}

const now = new Date();

export const useCalendarStore = create<CalendarStore>((set) => ({
  viewMonth: now.getMonth() + 1,
  viewYear: now.getFullYear(),
  selectedDate: null,
  activeTab: 'calendar',

  selectDate: (date) => set({ selectedDate: date }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  navigateMonth: (delta) =>
    set((state) => {
      let m = state.viewMonth + delta;
      let y = state.viewYear;
      if (m < 1) { m = 12; y--; }
      if (m > 12) { m = 1; y++; }
      return { viewMonth: m, viewYear: y, selectedDate: null };
    }),
}));
