import { prisma } from "@kimchupa/db";

export const reportRepository = {
  async create(data: {
    reporterId: string;
    targetType: string;
    targetId: string;
    reason: string;
    description?: string;
  }) {
    return prisma.report.create({ data });
  },

  async findByReporter(userId: string) {
    return prisma.report.findMany({
      where: { reporterId: userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByTarget(targetType: string, targetId: string) {
    return prisma.report.findMany({
      where: { targetType, targetId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findAll(options: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 20 } = options;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: { id: true, nickname: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(id: string, status: string) {
    return prisma.report.update({
      where: { id },
      data: { status },
    });
  },
};
