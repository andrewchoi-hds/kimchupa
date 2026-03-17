import { prisma } from "@kimchupa/db";

export const bookmarkRepository = {
  async findByUser(userId: string, options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = options || {};

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        include: {
          post: {
            include: {
              author: true,
              tags: true,
              _count: { select: { comments: true, likes: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);

    return { bookmarks, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async toggle(userId: string, postId: string): Promise<boolean> {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return false; // removed bookmark
    } else {
      await prisma.bookmark.create({ data: { userId, postId } });
      return true; // added bookmark
    }
  },

  async exists(userId: string, postId: string): Promise<boolean> {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!bookmark;
  },

  async count(userId: string) {
    return prisma.bookmark.count({ where: { userId } });
  },

  async removeAll(userId: string) {
    return prisma.bookmark.deleteMany({ where: { userId } });
  },
};
