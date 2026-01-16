import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KIMCHI_DATA } from "@/constants/kimchi";

// Collection status types
export type CollectionStatus = "tried" | "made" | "want" | null;

export interface KimchiEntry {
  kimchiId: string;
  status: CollectionStatus;
  rating: number | null; // 1-5 stars
  memo: string;
  collectedAt: string | null; // ISO date
  updatedAt: string;
}

interface KimchiDexState {
  // Map of kimchiId to entry
  entries: Record<string, KimchiEntry>;

  // Actions
  setStatus: (kimchiId: string, status: CollectionStatus) => void;
  setRating: (kimchiId: string, rating: number | null) => void;
  setMemo: (kimchiId: string, memo: string) => void;
  getEntry: (kimchiId: string) => KimchiEntry | null;

  // Statistics
  getCollectedCount: () => number;
  getTriedCount: () => number;
  getMadeCount: () => number;
  getWantCount: () => number;
  getProgress: () => number; // percentage
  getTotalKimchiCount: () => number;

  // Filtered lists
  getCollectedKimchi: () => string[];
  getTriedKimchi: () => string[];
  getMadeKimchi: () => string[];
  getWantKimchi: () => string[];
  getUncollectedKimchi: () => string[];

  // Reset
  resetEntry: (kimchiId: string) => void;
}

const getToday = () => new Date().toISOString();

export const useKimchiDexStore = create<KimchiDexState>()(
  persist(
    (set, get) => ({
      entries: {},

      setStatus: (kimchiId: string, status: CollectionStatus) => {
        const now = getToday();
        set((state) => {
          const existingEntry = state.entries[kimchiId];

          if (status === null) {
            // Remove entry if status is null
            const { [kimchiId]: _, ...rest } = state.entries;
            return { entries: rest };
          }

          return {
            entries: {
              ...state.entries,
              [kimchiId]: {
                kimchiId,
                status,
                rating: existingEntry?.rating ?? null,
                memo: existingEntry?.memo ?? "",
                collectedAt: existingEntry?.collectedAt ?? (status ? now : null),
                updatedAt: now,
              },
            },
          };
        });
      },

      setRating: (kimchiId: string, rating: number | null) => {
        const now = getToday();
        set((state) => {
          const existingEntry = state.entries[kimchiId];
          if (!existingEntry) return state;

          return {
            entries: {
              ...state.entries,
              [kimchiId]: {
                ...existingEntry,
                rating: rating !== null ? Math.min(5, Math.max(1, rating)) : null,
                updatedAt: now,
              },
            },
          };
        });
      },

      setMemo: (kimchiId: string, memo: string) => {
        const now = getToday();
        set((state) => {
          const existingEntry = state.entries[kimchiId];
          if (!existingEntry) return state;

          return {
            entries: {
              ...state.entries,
              [kimchiId]: {
                ...existingEntry,
                memo,
                updatedAt: now,
              },
            },
          };
        });
      },

      getEntry: (kimchiId: string) => {
        return get().entries[kimchiId] || null;
      },

      getCollectedCount: () => {
        const entries = get().entries;
        return Object.values(entries).filter(
          (e) => e.status === "tried" || e.status === "made"
        ).length;
      },

      getTriedCount: () => {
        const entries = get().entries;
        return Object.values(entries).filter((e) => e.status === "tried").length;
      },

      getMadeCount: () => {
        const entries = get().entries;
        return Object.values(entries).filter((e) => e.status === "made").length;
      },

      getWantCount: () => {
        const entries = get().entries;
        return Object.values(entries).filter((e) => e.status === "want").length;
      },

      getProgress: () => {
        const collected = get().getCollectedCount();
        const total = KIMCHI_DATA.length;
        return Math.round((collected / total) * 100);
      },

      getTotalKimchiCount: () => KIMCHI_DATA.length,

      getCollectedKimchi: () => {
        const entries = get().entries;
        return Object.values(entries)
          .filter((e) => e.status === "tried" || e.status === "made")
          .map((e) => e.kimchiId);
      },

      getTriedKimchi: () => {
        const entries = get().entries;
        return Object.values(entries)
          .filter((e) => e.status === "tried")
          .map((e) => e.kimchiId);
      },

      getMadeKimchi: () => {
        const entries = get().entries;
        return Object.values(entries)
          .filter((e) => e.status === "made")
          .map((e) => e.kimchiId);
      },

      getWantKimchi: () => {
        const entries = get().entries;
        return Object.values(entries)
          .filter((e) => e.status === "want")
          .map((e) => e.kimchiId);
      },

      getUncollectedKimchi: () => {
        const entries = get().entries;
        const collectedIds = new Set(
          Object.values(entries)
            .filter((e) => e.status === "tried" || e.status === "made")
            .map((e) => e.kimchiId)
        );
        return KIMCHI_DATA.filter((k) => !collectedIds.has(k.id)).map((k) => k.id);
      },

      resetEntry: (kimchiId: string) => {
        set((state) => {
          const { [kimchiId]: _, ...rest } = state.entries;
          return { entries: rest };
        });
      },
    }),
    {
      name: "kimchupa-kimchi-dex",
      partialize: (state) => ({
        entries: state.entries,
      }),
    }
  )
);

// Status labels and colors
export const STATUS_CONFIG = {
  tried: {
    label: "먹어봤어요",
    emoji: "😋",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    borderColor: "border-green-500",
  },
  made: {
    label: "담가봤어요",
    emoji: "👨‍🍳",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    borderColor: "border-blue-500",
  },
  want: {
    label: "도전할래요",
    emoji: "🎯",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    borderColor: "border-amber-500",
  },
} as const;
