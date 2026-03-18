import { prisma } from "@kimchupa/db";

export const notificationRepository = {
  async findByUser(userId: string, limit = 20, includeRead = false) {
    return prisma.notification.findMany({
      where: { userId, ...(includeRead ? {} : { read: false }) },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, read: false } });
  },

  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    metadata?: object;
  }) {
    return prisma.notification.create({ data });
  },

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },
};
