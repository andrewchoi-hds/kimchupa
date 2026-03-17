import { prisma } from "@kimchupa/db";

export const attendanceRepository = {
  async findLatest(userId: string) {
    return prisma.attendance.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    });
  },

  async findByDate(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: startOfDay,
        },
      },
    });
  },

  async create(data: {
    userId: string;
    date: Date;
    streak: number;
    xpEarned: number;
    bonus?: string | null;
  }) {
    const dateOnly = new Date(data.date);
    dateOnly.setHours(0, 0, 0, 0);

    return prisma.attendance.create({
      data: {
        userId: data.userId,
        date: dateOnly,
        streak: data.streak,
        xpEarned: data.xpEarned,
        bonus: data.bonus || null,
      },
    });
  },

  async getStreak(userId: string): Promise<number> {
    // Get all attendance records for user, sorted by date descending
    const records = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      select: { date: true },
    });

    if (records.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecentDate = new Date(records[0].date);
    mostRecentDate.setHours(0, 0, 0, 0);

    // If the most recent attendance is not today or yesterday, streak is broken
    if (mostRecentDate.getTime() !== today.getTime() && mostRecentDate.getTime() !== yesterday.getTime()) {
      return 0;
    }

    let streak = 1;
    let currentDate = mostRecentDate;

    for (let i = 1; i < records.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      prevDate.setHours(0, 0, 0, 0);

      const recordDate = new Date(records[i].date);
      recordDate.setHours(0, 0, 0, 0);

      if (recordDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = recordDate;
      } else {
        break;
      }
    }

    return streak;
  },

  async getMonthAttendance(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // last day of month

    const records = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    return records.map((r) => new Date(r.date).getDate());
  },

  async getTotalXpEarned(userId: string) {
    const result = await prisma.attendance.aggregate({
      where: { userId },
      _sum: { xpEarned: true },
    });
    return result._sum.xpEarned || 0;
  },

  async getLongestStreak(userId: string): Promise<number> {
    const records = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      select: { date: true },
    });

    if (records.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < records.length; i++) {
      const prevDate = new Date(records[i - 1].date);
      const currDate = new Date(records[i].date);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  },
};
