"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";
import { toast } from "@/stores/toastStore";

const LEVEL_NAMES: Record<number, string> = {
  1: "김치 새싹",
  2: "김치 입문자",
  3: "김치 수습생",
  4: "김치 요리사",
  5: "김치 장인",
  6: "김치 달인",
  7: "김치 명인",
};

export function useLevelUp() {
  const celebrate = useCallback((newLevel: number) => {
    const levelName = LEVEL_NAMES[newLevel] || `레벨 ${newLevel}`;

    // Toast notification
    toast.levelUp(newLevel, levelName);

    // Confetti effect
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ["#e53e3e", "#ed8936", "#ecc94b", "#48bb78", "#4299e1"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return { celebrate };
}
