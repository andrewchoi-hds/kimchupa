import { prisma } from "@kimchupa/db";
import { userRepository } from "../repositories/user.repository";
import { getLevelByXp, getXpProgress } from "../utils/level-calculator";

export const xpService = {
  /**
   * Add XP to a user, record in history, and check for level up.
   * Returns the updated user and level-up info if applicable.
   */
  async addXp(
    userId: string,
    amount: number,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<{
    newXp: number;
    newLevel: number;
    leveledUp: boolean;
    previousLevel: number;
    levelName: string;
  }> {
    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const previousLevel = user.level;
    const newXp = user.xp + amount;

    // Calculate new level from XP
    const levelInfo = getLevelByXp(newXp);
    const newLevel = levelInfo.level;

    // Record XP history
    await prisma.xpHistory.create({
      data: {
        userId,
        amount,
        reason,
        metadata: metadata ?? undefined,
      },
    });

    // Update user XP and level
    await userRepository.updateXpAndLevel(userId, newXp, newLevel);

    return {
      newXp,
      newLevel,
      leveledUp: newLevel > previousLevel,
      previousLevel,
      levelName: levelInfo.name,
    };
  },

  /** Get XP history for a user */
  async getHistory(userId: string, options?: { limit?: number; offset?: number }) {
    const { limit = 20, offset = 0 } = options || {};

    const [history, total] = await Promise.all([
      prisma.xpHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.xpHistory.count({ where: { userId } }),
    ]);

    return { history, total };
  },

  /** Get total XP earned by a user (from history) */
  async getTotalXp(userId: string) {
    const result = await prisma.xpHistory.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  },

  /** Get XP earned today */
  async getTodayXp(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.xpHistory.aggregate({
      where: {
        userId,
        createdAt: { gte: today },
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  },

  /** Get XP earned this week */
  async getWeekXp(userId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const result = await prisma.xpHistory.aggregate({
      where: {
        userId,
        createdAt: { gte: weekAgo },
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  },

  /** Get XP progress toward next level */
  async getProgress(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    return getXpProgress(user.xp);
  },

  /** Get full XP summary for a user */
  async getSummary(userId: string) {
    const [todayXp, weekXp, totalXp, progress] = await Promise.all([
      this.getTodayXp(userId),
      this.getWeekXp(userId),
      this.getTotalXp(userId),
      this.getProgress(userId),
    ]);

    return {
      todayXp,
      weekXp,
      totalXp,
      ...progress,
    };
  },
};
