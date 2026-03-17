import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "xp" | "levelup";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  xpAmount?: number;
  newLevel?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const generateId = () => `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = {
      id,
      duration: 3000,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

// Helper functions for common toast types
export const toast = {
  success: (message: string, description?: string) => {
    useToastStore.getState().addToast({ type: "success", message, description });
  },
  error: (message: string, description?: string) => {
    useToastStore.getState().addToast({ type: "error", message, description, duration: 5000 });
  },
  info: (message: string, description?: string) => {
    useToastStore.getState().addToast({ type: "info", message, description });
  },
  xp: (amount: number, reason: string) => {
    useToastStore.getState().addToast({
      type: "xp",
      message: `+${amount} XP`,
      description: reason,
      xpAmount: amount,
      duration: 4000,
    });
  },
  levelUp: (newLevel: number, levelName: string) => {
    useToastStore.getState().addToast({
      type: "levelup",
      message: "레벨 업!",
      description: `Lv.${newLevel} ${levelName} 달성!`,
      newLevel,
      duration: 6000,
    });
  },
};
