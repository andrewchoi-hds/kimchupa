"use client";

import { useEffect, useState } from "react";
import { useToastStore, Toast as ToastType } from "@/stores/toastStore";

const toastIcons: Record<ToastType["type"], string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  xp: "✨",
  levelup: "🎉",
};

const toastColors: Record<ToastType["type"], string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  xp: "bg-purple-500",
  levelup: "bg-gradient-to-r from-yellow-500 to-orange-500",
};

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Trigger leave animation before removal
    if (toast.duration) {
      const leaveTimer = setTimeout(() => {
        setIsLeaving(true);
      }, toast.duration - 300);

      return () => clearTimeout(leaveTimer);
    }
  }, [toast.duration]);

  const handleClick = () => {
    setIsLeaving(true);
    setTimeout(onRemove, 300);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        transform transition-all duration-300 ease-out cursor-pointer
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      {toast.type === "levelup" ? (
        // Special level up toast
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 shadow-2xl min-w-[280px] animate-bounce-once">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <p className="font-bold text-lg">{toast.message}</p>
              <p className="text-white/90 text-sm">{toast.description}</p>
            </div>
          </div>
        </div>
      ) : toast.type === "xp" ? (
        // XP toast
        <div className="bg-purple-600 text-white rounded-xl p-3 shadow-xl min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-pulse">✨</span>
            <div>
              <p className="font-bold">{toast.message}</p>
              {toast.description && (
                <p className="text-purple-200 text-sm">{toast.description}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Standard toast
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-xl min-w-[280px] border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 ${toastColors[toast.type]} rounded-full flex items-center justify-center text-white flex-shrink-0`}
            >
              {toastIcons[toast.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-900 dark:text-white">
                {toast.message}
              </p>
              {toast.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
