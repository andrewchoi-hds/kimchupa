import { prisma } from "@kimchupa/db";

export const followRepository = {
  async toggle(followerId: string, followingId: string): Promise<boolean> {
    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return false; // unfollowed
    } else {
      await prisma.follow.create({ data: { followerId, followingId } });
      return true; // followed
    }
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return !!follow;
  },

  async getFollowers(userId: string, limit = 20) {
    return prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: { select: { id: true, nickname: true, image: true, level: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async getFollowing(userId: string, limit = 20) {
    return prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: { id: true, nickname: true, image: true, level: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async getFollowerCount(userId: string): Promise<number> {
    return prisma.follow.count({ where: { followingId: userId } });
  },

  async getFollowingCount(userId: string): Promise<number> {
    return prisma.follow.count({ where: { followerId: userId } });
  },
};
