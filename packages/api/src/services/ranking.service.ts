import { prisma } from "@kimchupa/db";

export const rankingService = {
  // Overall XP ranking
  async getXpRanking(limit = 20) {
    return prisma.user.findMany({
      select: { id: true, nickname: true, name: true, image: true, level: true, xp: true },
      orderBy: { xp: "desc" },
      take: limit,
    });
  },

  // Weekly XP ranking (users who gained most XP this week)
  async getWeeklyXpRanking(limit = 20) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyXp = await prisma.xpHistory.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: weekAgo } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: limit,
    });

    const userIds = weeklyXp.map((r) => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, nickname: true, name: true, image: true, level: true, xp: true },
    });

    return weeklyXp.map((r) => ({
      ...users.find((u) => u.id === r.userId),
      weeklyXp: r._sum.amount || 0,
    }));
  },

  // Top contributors (most posts)
  async getTopContributors(limit = 20) {
    const contributors = await prisma.post.groupBy({
      by: ["authorId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: limit,
    });

    const userIds = contributors.map((c) => c.authorId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, nickname: true, name: true, image: true, level: true },
    });

    return contributors.map((c) => ({
      ...users.find((u) => u.id === c.authorId),
      postCount: c._count.id,
    }));
  },

  // Attendance kings (longest streaks)
  async getAttendanceKings(limit = 20) {
    const attendance = await prisma.attendance.findMany({
      select: { userId: true, streak: true },
      orderBy: { streak: "desc" },
      distinct: ["userId"],
      take: limit,
    });

    const userIds = attendance.map((a) => a.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, nickname: true, name: true, image: true, level: true },
    });

    return attendance.map((a) => ({
      ...users.find((u) => u.id === a.userId),
      streak: a.streak,
    }));
  },
};
