import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface XpHistoryEntry {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

interface XpHistoryState {
  history: XpHistoryEntry[];

  // Actions
  addEntry: (amount: number, reason: string) => void;
  getRecentHistory: (count?: number) => XpHistoryEntry[];
  getTotalXp: () => number;
  getTodayXp: () => number;
  getWeekXp: () => number;
  clearHistory: () => void;
}

export const useXpHistoryStore = create<XpHistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addEntry: (amount, reason) => {
        const entry: XpHistoryEntry = {
          id: `xp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount,
          reason,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          history: [entry, ...state.history].slice(0, 100), // 최근 100개만 유지
        }));
      },

      getRecentHistory: (count = 20) => {
        return get().history.slice(0, count);
      },

      getTotalXp: () => {
        return get().history.reduce((sum, entry) => sum + entry.amount, 0);
      },

      getTodayXp: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return get().history
          .filter((entry) => new Date(entry.timestamp) >= today)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },

      getWeekXp: () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);

        return get().history
          .filter((entry) => new Date(entry.timestamp) >= weekAgo)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: "kimchupa-xp-history",
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);
