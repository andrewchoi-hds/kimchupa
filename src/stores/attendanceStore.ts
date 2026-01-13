import { create } from "zustand";
import { persist } from "zustand/middleware";
import { XP_REWARDS } from "@/constants/levels";

// Streak bonus thresholds
const STREAK_BONUSES = [
  { days: 7, bonus: 10, name: "7일 연속" },
  { days: 14, bonus: 20, name: "2주 연속" },
  { days: 30, bonus: 50, name: "한 달 연속" },
] as const;

interface AttendanceState {
  // Attended dates in ISO format (YYYY-MM-DD)
  attendedDates: string[];
  // Current streak count
  currentStreak: number;
  // Longest streak ever
  longestStreak: number;
  // Total XP earned from attendance
  totalXpEarned: number;
  // Last check-in date
  lastCheckIn: string | null;

  // Actions
  checkIn: () => { success: boolean; xpEarned: number; bonusInfo: string | null; newStreak: number };
  canCheckInToday: () => boolean;
  getMonthAttendance: (year: number, month: number) => number[];
  getStreakBonus: (streak: number) => { bonus: number; name: string } | null;
}

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

// Get yesterday's date in YYYY-MM-DD format
const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

// Calculate streak from attended dates
const calculateStreak = (attendedDates: string[], includeToday: boolean): number => {
  if (attendedDates.length === 0) return 0;

  const sortedDates = [...attendedDates].sort().reverse();
  const today = getToday();
  const yesterday = getYesterday();

  // Check if the most recent date is today or yesterday
  const mostRecent = sortedDates[0];
  if (!includeToday && mostRecent !== yesterday && mostRecent !== today) {
    return 0;
  }
  if (includeToday && mostRecent !== today) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(mostRecent);

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = prevDate.toISOString().split("T")[0];

    if (sortedDates[i] === prevDateStr) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      attendedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      totalXpEarned: 0,
      lastCheckIn: null,

      checkIn: () => {
        const state = get();
        const today = getToday();

        // Already checked in today
        if (state.attendedDates.includes(today)) {
          return { success: false, xpEarned: 0, bonusInfo: null, newStreak: state.currentStreak };
        }

        // Calculate new streak
        const yesterday = getYesterday();
        const wasYesterdayAttended = state.attendedDates.includes(yesterday);
        const newStreak = wasYesterdayAttended ? state.currentStreak + 1 : 1;

        // Calculate XP
        let xpEarned = XP_REWARDS.attendance;
        let bonusInfo: string | null = null;

        // Check for streak bonuses
        const streakBonus = get().getStreakBonus(newStreak);
        if (streakBonus) {
          xpEarned += streakBonus.bonus;
          bonusInfo = `${streakBonus.name} 보너스! +${streakBonus.bonus} XP`;
        }

        // Update state
        set((state) => ({
          attendedDates: [...state.attendedDates, today],
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          totalXpEarned: state.totalXpEarned + xpEarned,
          lastCheckIn: today,
        }));

        return { success: true, xpEarned, bonusInfo, newStreak };
      },

      canCheckInToday: () => {
        const state = get();
        const today = getToday();
        return !state.attendedDates.includes(today);
      },

      getMonthAttendance: (year: number, month: number) => {
        const state = get();
        const prefix = `${year}-${String(month).padStart(2, "0")}`;

        return state.attendedDates
          .filter((date) => date.startsWith(prefix))
          .map((date) => parseInt(date.split("-")[2], 10));
      },

      getStreakBonus: (streak: number) => {
        // Find the highest applicable bonus
        for (let i = STREAK_BONUSES.length - 1; i >= 0; i--) {
          if (streak === STREAK_BONUSES[i].days) {
            return { bonus: STREAK_BONUSES[i].bonus, name: STREAK_BONUSES[i].name };
          }
        }
        return null;
      },
    }),
    {
      name: "kimchupa-attendance",
      partialize: (state) => ({
        attendedDates: state.attendedDates,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        totalXpEarned: state.totalXpEarned,
        lastCheckIn: state.lastCheckIn,
      }),
    }
  )
);
