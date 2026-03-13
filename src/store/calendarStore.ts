import { create } from 'zustand';
import type { Purpose } from '../core/types';

interface CalendarStore {
  // View state
  viewMonth: number;
  viewYear: number;
  selectedDate: { year: number; month: number; day: number } | null;
  activeTab: 'calendar' | 'pick' | 'today';

  // Pick mode
  selectedPurpose: Purpose | null;

  // Actions
  setViewMonth: (month: number, year: number) => void;
  selectDate: (date: { year: number; month: number; day: number } | null) => void;
  setActiveTab: (tab: 'calendar' | 'pick' | 'today') => void;
  setPurpose: (purpose: Purpose | null) => void;
  navigateMonth: (delta: number) => void;
}

const now = new Date();

export const useCalendarStore = create<CalendarStore>((set) => ({
  viewMonth: now.getMonth() + 1,
  viewYear: now.getFullYear(),
  selectedDate: null,
  activeTab: 'calendar',
  selectedPurpose: null,

  setViewMonth: (month, year) => set({ viewMonth: month, viewYear: year, selectedDate: null }),

  selectDate: (date) => set({ selectedDate: date }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setPurpose: (purpose) => set({ selectedPurpose: purpose }),

  navigateMonth: (delta) =>
    set((state) => {
      let m = state.viewMonth + delta;
      let y = state.viewYear;
      if (m < 1) { m = 12; y--; }
      if (m > 12) { m = 1; y++; }
      return { viewMonth: m, viewYear: y, selectedDate: null };
    }),
}));
