import { prisma } from "@kimchupa/db";

export const challengeRepository = {
  async getActive() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    return prisma.challenge.findFirst({
      where: {
        active: true,
        startDate: { lte: today },
        endDate: { gte: today },
      },
      include: {
        _count: { select: { participants: true } },
      },
    });
  },

  async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        orderBy: { startDate: "desc" },
        skip,
        take: limit,
        include: {
          _count: { select: { participants: true } },
        },
      }),
      prisma.challenge.count(),
    ]);

    return { challenges, total };
  },

  async getById(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
      include: {
        _count: { select: { participants: true } },
      },
    });
  },

  async join(challengeId: string, userId: string) {
    return prisma.challengeParticipant.create({
      data: {
        challengeId,
        userId,
        status: "joined",
      },
    });
  },

  async complete(challengeId: string, userId: string, postId?: string) {
    return prisma.challengeParticipant.update({
      where: {
        challengeId_userId: { challengeId, userId },
      },
      data: {
        status: "completed",
        completedAt: new Date(),
        postId: postId ?? null,
      },
    });
  },

  async getParticipants(challengeId: string) {
    return prisma.challengeParticipant.findMany({
      where: { challengeId },
      orderBy: { createdAt: "desc" },
    });
  },

  async isJoined(challengeId: string, userId: string) {
    const participant = await prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });
    return !!participant;
  },

  async getParticipantStatus(challengeId: string, userId: string) {
    return prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });
  },

  async getParticipantCount(challengeId: string) {
    return prisma.challengeParticipant.count({
      where: { challengeId },
    });
  },
};
