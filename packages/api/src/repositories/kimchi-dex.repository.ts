import { prisma } from "@kimchupa/db";
import type { KimchiDexStatus } from "@kimchupa/db";

export const kimchiDexRepository = {
  async findByUser(userId: string) {
    return prisma.kimchiDexEntry.findMany({
      where: { userId },
      include: { kimchi: true },
      orderBy: { updatedAt: "desc" },
    });
  },

  async findByUserAndKimchi(userId: string, kimchiId: string) {
    return prisma.kimchiDexEntry.findUnique({
      where: { userId_kimchiId: { userId, kimchiId } },
      include: { kimchi: true },
    });
  },

  async upsert(
    userId: string,
    kimchiId: string,
    status: KimchiDexStatus,
    rating?: number | null,
    memo?: string | null
  ) {
    return prisma.kimchiDexEntry.upsert({
      where: { userId_kimchiId: { userId, kimchiId } },
      create: {
        userId,
        kimchiId,
        status,
        rating: rating != null ? Math.min(5, Math.max(1, rating)) : null,
        memo: memo || null,
        triedAt: status === "tried" || status === "favorite" ? new Date() : null,
      },
      update: {
        status,
        rating: rating !== undefined ? (rating != null ? Math.min(5, Math.max(1, rating)) : null) : undefined,
        memo: memo !== undefined ? (memo || null) : undefined,
        triedAt: status === "tried" || status === "favorite" ? new Date() : undefined,
      },
      include: { kimchi: true },
    });
  },

  async remove(userId: string, kimchiId: string) {
    return prisma.kimchiDexEntry.delete({
      where: { userId_kimchiId: { userId, kimchiId } },
    }).catch(() => null); // return null if entry doesn't exist
  },

  async getStats(userId: string) {
    const entries = await prisma.kimchiDexEntry.findMany({
      where: { userId },
      select: { status: true },
    });

    const totalKimchi = await prisma.kimchi.count();

    const triedCount = entries.filter((e) => e.status === "tried").length;
    const favoriteCount = entries.filter((e) => e.status === "favorite").length;
    const wantToTryCount = entries.filter((e) => e.status === "want_to_try").length;
    const collectedCount = triedCount + favoriteCount;
    const progress = totalKimchi > 0 ? Math.round((collectedCount / totalKimchi) * 100) : 0;

    return {
      triedCount,
      favoriteCount,
      wantToTryCount,
      collectedCount,
      totalKimchi,
      progress,
    };
  },

  async getCollectedKimchiIds(userId: string) {
    const entries = await prisma.kimchiDexEntry.findMany({
      where: {
        userId,
        status: { in: ["tried", "favorite"] },
      },
      select: { kimchiId: true },
    });
    return entries.map((e) => e.kimchiId);
  },
};
