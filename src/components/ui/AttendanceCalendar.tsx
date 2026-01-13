"use client";

import { useState } from "react";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { toast } from "@/stores/toastStore";

interface AttendanceCalendarProps {
  onXpEarned?: (xp: number) => void;
}

export default function AttendanceCalendar({ onXpEarned }: AttendanceCalendarProps) {
  const {
    currentStreak,
    longestStreak,
    checkIn,
    canCheckInToday,
    getMonthAttendance
  } = useAttendanceStore();

  const [checkInResult, setCheckInResult] = useState<{
    xpEarned: number;
    bonusInfo: string | null;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // Get attendance for current month
  const attendedDays = getMonthAttendance(currentYear, currentMonth);

  // Calculate days in month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Calculate first day of month (0 = Sunday)
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleCheckIn = () => {
    if (!canCheckInToday()) return;

    setIsAnimating(true);
    const result = checkIn();

    if (result.success) {
      setCheckInResult({
        xpEarned: result.xpEarned,
        bonusInfo: result.bonusInfo,
      });
      onXpEarned?.(result.xpEarned);

      // Show global toast
      toast.xp(result.xpEarned, "출석 체크");
      if (result.bonusInfo) {
        toast.success("연속 출석 보너스!", result.bonusInfo);
      }

      // Reset animation and result after delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      setTimeout(() => {
        setCheckInResult(null);
      }, 3000);
    }
  };

  const canCheckIn = canCheckInToday();
  const monthAttendanceCount = attendedDays.length;

  // Day of week headers
  const dayHeaders = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          {currentMonth}월 출석
        </h2>
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 text-orange-500">
            <span className="text-xl">🔥</span>
            <span className="font-bold">{currentStreak}일 연속</span>
          </div>
        )}
      </div>

      {/* Check-in Button */}
      <div className="mb-6">
        {canCheckIn ? (
          <button
            onClick={handleCheckIn}
            disabled={isAnimating}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isAnimating
                ? "bg-green-500 text-white scale-95"
                : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 hover:shadow-lg"
            }`}
          >
            {isAnimating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">✨</span>
                출석 완료!
                <span className="animate-bounce">✨</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>📅</span>
                오늘 출석 체크하기
              </span>
            )}
          </button>
        ) : (
          <div className="w-full py-4 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-center">
            <span className="text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2">
              <span>✅</span>
              오늘 출석 완료!
            </span>
          </div>
        )}

        {/* XP Earned Notification */}
        {checkInResult && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center animate-fade-in">
            <p className="text-green-600 dark:text-green-400 font-medium">
              +{checkInResult.xpEarned} XP 획득!
            </p>
            {checkInResult.bonusInfo && (
              <p className="text-sm text-orange-500 mt-1">
                🎉 {checkInResult.bonusInfo}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayHeaders.map((day, idx) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-1 ${
              idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-zinc-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const isAttended = attendedDays.includes(day);
          const isToday = day === currentDay;
          const isPast = day < currentDay;
          const isFuture = day > currentDay;

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                isToday
                  ? isAttended
                    ? "bg-green-500 text-white font-bold ring-2 ring-green-300"
                    : "bg-purple-600 text-white font-bold ring-2 ring-purple-300"
                  : isAttended
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : isPast
                  ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"
                  : isFuture
                  ? "bg-zinc-50 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
              }`}
            >
              {isAttended && !isToday ? (
                <span className="text-base">✓</span>
              ) : (
                day
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">이번 달 출석</span>
          <span className="font-medium text-purple-600">{monthAttendanceCount}일</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-zinc-500">현재 연속 출석</span>
          <span className="font-medium text-orange-500">{currentStreak}일 🔥</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-zinc-500">최장 연속 기록</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{longestStreak}일</span>
        </div>
      </div>

      {/* Streak Bonus Info */}
      <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg">
        <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-2">
          🎁 연속 출석 보너스
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={currentStreak >= 7 ? "text-orange-600 font-medium" : "text-zinc-500"}>
            <span className="block text-lg mb-1">7일</span>
            +10 XP
          </div>
          <div className={currentStreak >= 14 ? "text-orange-600 font-medium" : "text-zinc-500"}>
            <span className="block text-lg mb-1">14일</span>
            +20 XP
          </div>
          <div className={currentStreak >= 30 ? "text-orange-600 font-medium" : "text-zinc-500"}>
            <span className="block text-lg mb-1">30일</span>
            +50 XP
          </div>
        </div>
      </div>
    </div>
  );
}
