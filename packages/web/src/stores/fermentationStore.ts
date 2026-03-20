import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FermentationEntry {
  id: string;
  kimchiName: string;
  kimchiId?: string;
  startDate: string; // ISO date
  estimatedDays: number;
  temperature: string; // "냉장" | "실온" | "김치냉장고"
  memo: string;
  completed: boolean;
  completedAt?: string;
}

interface FermentationState {
  entries: FermentationEntry[];
  addEntry: (entry: Omit<FermentationEntry, "id" | "completed">) => void;
  removeEntry: (id: string) => void;
  completeEntry: (id: string) => void;
  updateMemo: (id: string, memo: string) => void;
}

export const useFermentationStore = create<FermentationState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...entry, id: `ferm_${Date.now()}`, completed: false },
          ],
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      completeEntry: (id) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id
              ? { ...e, completed: true, completedAt: new Date().toISOString() }
              : e
          ),
        })),
      updateMemo: (id, memo) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, memo } : e
          ),
        })),
    }),
    {
      name: "kimchupa-fermentation",
      partialize: (state) => ({
        entries: state.entries,
      }),
    }
  )
);
