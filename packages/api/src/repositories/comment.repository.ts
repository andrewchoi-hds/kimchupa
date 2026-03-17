import { prisma } from "@kimchupa/db";

export const commentRepository = {
  async findByPostId(postId: string) {
    return prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: true,
        replies: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  async findById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        replies: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  async findReplies(commentId: string) {
    return prisma.comment.findMany({
      where: { parentId: commentId },
      include: { author: true },
      orderBy: { createdAt: "asc" },
    });
  },

  async create(data: {
    postId: string;
    authorId: string;
    content: string;
    parentId?: string | null;
  }) {
    return prisma.comment.create({
      data: {
        postId: data.postId,
        authorId: data.authorId,
        content: data.content,
        parentId: data.parentId || null,
      },
      include: { author: true },
    });
  },

  async update(id: string, data: { content: string }) {
    return prisma.comment.update({
      where: { id },
      data: { content: data.content },
      include: { author: true },
    });
  },

  async delete(id: string) {
    return prisma.comment.delete({ where: { id } });
  },

  async toggleLike(commentId: string) {
    return prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    });
  },

  async countByPostId(postId: string) {
    return prisma.comment.count({ where: { postId } });
  },

  async countByUserId(userId: string) {
    return prisma.comment.count({ where: { authorId: userId } });
  },

  async findByUserId(userId: string, options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = options || {};
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { authorId: userId },
        include: { author: true, post: { select: { id: true, title: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where: { authorId: userId } }),
    ]);

    return { comments, total, page, limit, totalPages: Math.ceil(total / limit) };
  },
};
