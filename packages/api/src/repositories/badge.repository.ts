import { prisma } from "@kimchupa/db";

export const badgeRepository = {
  async findAll() {
    return prisma.badge.findMany({
      orderBy: { createdAt: "asc" },
    });
  },

  async findBySlug(slug: string) {
    return prisma.badge.findUnique({
      where: { slug },
    });
  },

  async findById(id: string) {
    return prisma.badge.findUnique({
      where: { id },
    });
  },

  async findUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });
  },

  async awardBadge(userId: string, badgeId: string) {
    // Check if already awarded
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    });

    if (existing) return null; // already awarded

    return prisma.userBadge.create({
      data: { userId, badgeId },
      include: { badge: true },
    });
  },

  async hasBadge(userId: string, badgeId: string) {
    const badge = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    });
    return !!badge;
  },

  async hasBadgeBySlug(userId: string, slug: string) {
    const badge = await prisma.badge.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!badge) return false;

    return this.hasBadge(userId, badge.id);
  },

  async getEarnedCount(userId: string) {
    return prisma.userBadge.count({ where: { userId } });
  },

  async getAllWithUserStatus(userId: string) {
    const [allBadges, userBadges] = await Promise.all([
      prisma.badge.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.userBadge.findMany({
        where: { userId },
        select: { badgeId: true, earnedAt: true },
      }),
    ]);

    const earnedMap = new Map(userBadges.map((ub) => [ub.badgeId, ub.earnedAt]));

    return allBadges.map((badge) => ({
      ...badge,
      earned: earnedMap.has(badge.id),
      earnedAt: earnedMap.get(badge.id) || null,
    }));
  },
};
