import { attendanceRepository } from "../repositories/attendance.repository";
import { xpService } from "./xp.service";

// Streak bonus thresholds (from attendanceStore.ts)
const STREAK_BONUSES = [
  { days: 7, bonus: 10, name: "7일 연속" },
  { days: 14, bonus: 20, name: "2주 연속" },
  { days: 30, bonus: 50, name: "한 달 연속" },
] as const;

// Base attendance XP reward
const BASE_ATTENDANCE_XP = 5;

export const attendanceService = {
  /**
   * Check in for today.
   * - Creates an attendance record
   * - Calculates streak
   * - Awards base XP + streak bonus XP
   */
  async checkIn(userId: string): Promise<{
    success: boolean;
    xpEarned: number;
    bonusInfo: string | null;
    newStreak: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const todayRecord = await attendanceRepository.findByDate(userId, today);
    if (todayRecord) {
      const currentStreak = await attendanceRepository.getStreak(userId);
      return { success: false, xpEarned: 0, bonusInfo: null, newStreak: currentStreak };
    }

    // Calculate new streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayRecord = await attendanceRepository.findByDate(userId, yesterday);
    const previousStreak = yesterdayRecord ? await attendanceRepository.getStreak(userId) : 0;
    const newStreak = yesterdayRecord ? previousStreak + 1 : 1;

    // Calculate XP
    let xpEarned = BASE_ATTENDANCE_XP;
    let bonusInfo: string | null = null;
    let bonusLabel: string | null = null;

    // Check for streak bonuses
    const streakBonus = getStreakBonus(newStreak);
    if (streakBonus) {
      xpEarned += streakBonus.bonus;
      bonusInfo = `${streakBonus.name} 보너스! +${streakBonus.bonus} XP`;
      bonusLabel = `${streakBonus.days}_day_streak`;
    }

    // Create attendance record
    await attendanceRepository.create({
      userId,
      date: today,
      streak: newStreak,
      xpEarned,
      bonus: bonusLabel,
    });

    // Award XP
    await xpService.addXp(userId, xpEarned, "attendance", {
      streak: newStreak,
      bonus: bonusLabel,
    });

    return { success: true, xpEarned, bonusInfo, newStreak };
  },

  /** Check if user can check in today */
  async canCheckInToday(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const record = await attendanceRepository.findByDate(userId, today);
    return !record;
  },

  /** Get current streak for a user */
  async getStreak(userId: string) {
    return attendanceRepository.getStreak(userId);
  },

  /** Get longest streak for a user */
  async getLongestStreak(userId: string) {
    return attendanceRepository.getLongestStreak(userId);
  },

  /** Get attendance days for a specific month */
  async getMonthAttendance(userId: string, year: number, month: number) {
    return attendanceRepository.getMonthAttendance(userId, year, month);
  },

  /** Get total XP earned from attendance */
  async getTotalXpEarned(userId: string) {
    return attendanceRepository.getTotalXpEarned(userId);
  },

  /** Get full attendance summary */
  async getSummary(userId: string) {
    const [currentStreak, longestStreak, totalXpEarned, canCheckIn] = await Promise.all([
      attendanceRepository.getStreak(userId),
      attendanceRepository.getLongestStreak(userId),
      attendanceRepository.getTotalXpEarned(userId),
      this.canCheckInToday(userId),
    ]);

    return {
      currentStreak,
      longestStreak,
      totalXpEarned,
      canCheckInToday: canCheckIn,
    };
  },
};

/** Find the highest applicable streak bonus for a given streak count */
function getStreakBonus(streak: number): { days: number; bonus: number; name: string } | null {
  for (let i = STREAK_BONUSES.length - 1; i >= 0; i--) {
    if (streak === STREAK_BONUSES[i].days) {
      return {
        days: STREAK_BONUSES[i].days,
        bonus: STREAK_BONUSES[i].bonus,
        name: STREAK_BONUSES[i].name,
      };
    }
  }
  return null;
}
