import { prisma } from "@kimchupa/db";
import type { PostType } from "@kimchupa/db";

export const postRepository = {
  async findMany(options: {
    page?: number;
    limit?: number;
    type?: PostType;
    tag?: string;
    authorId?: string;
  }) {
    const { page = 1, limit = 20, type, tag, authorId } = options;
    const where: any = {};
    if (type) where.type = type;
    if (authorId) where.authorId = authorId;
    if (tag) where.tags = { some: { tag } };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: true,
          tags: true,
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findManyPopular(options: {
    type?: PostType;
  }) {
    const where: any = {};
    if (options.type) where.type = options.type;

    return prisma.post.findMany({
      where,
      include: {
        author: true,
        tags: true,
        _count: { select: { comments: true, likes: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  async create(data: {
    type: PostType;
    title: string;
    content: string;
    excerpt: string;
    authorId: string;
    tags?: string[];
    images?: string[];
  }) {
    const { tags, ...postData } = data;
    return prisma.post.create({
      data: {
        ...postData,
        images: data.images || [],
        tags: tags ? { create: tags.map((tag) => ({ tag })) } : undefined,
      },
      include: { author: true, tags: true },
    });
  },

  async update(
    id: string,
    data: { title?: string; content?: string; excerpt?: string; tags?: string[] }
  ) {
    const { tags, ...postData } = data;
    // Delete existing tags if new tags provided
    if (tags) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
    }
    return prisma.post.update({
      where: { id },
      data: {
        ...postData,
        ...(tags ? { tags: { create: tags.map((tag) => ({ tag })) } } : {}),
      },
      include: { author: true, tags: true },
    });
  },

  async delete(id: string) {
    return prisma.post.delete({ where: { id } });
  },

  async incrementViewCount(id: string) {
    return prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  },

  async toggleLike(postId: string, userId: string) {
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existing.id } }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);
      return false; // unliked
    } else {
      await prisma.$transaction([
        prisma.like.create({ data: { userId, postId } }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);
      return true; // liked
    }
  },

  async isLikedByUser(postId: string, userId: string) {
    const like = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!like;
  },

  async getAdjacentPosts(currentId: string) {
    const current = await prisma.post.findUnique({
      where: { id: currentId },
      select: { createdAt: true },
    });

    if (!current) return { prev: null, next: null };

    const [prev, next] = await Promise.all([
      prisma.post.findFirst({
        where: { createdAt: { gt: current.createdAt } },
        orderBy: { createdAt: "asc" },
        include: { author: true, tags: true },
      }),
      prisma.post.findFirst({
        where: { createdAt: { lt: current.createdAt } },
        orderBy: { createdAt: "desc" },
        include: { author: true, tags: true },
      }),
    ]);

    return { prev, next };
  },

  async getUserStats(userId: string) {
    const [postCount, commentCount, posts] = await Promise.all([
      prisma.post.count({ where: { authorId: userId } }),
      prisma.comment.count({ where: { authorId: userId } }),
      prisma.post.aggregate({
        where: { authorId: userId },
        _sum: { likeCount: true },
      }),
    ]);

    return {
      posts: postCount,
      comments: commentCount,
      likesReceived: posts._sum.likeCount || 0,
    };
  },

  async getPopularTags(limit = 10) {
    const tags = await prisma.postTag.groupBy({
      by: ["tag"],
      _count: { tag: true },
      orderBy: { _count: { tag: "desc" } },
      take: limit,
    });

    return tags.map((t) => ({ tag: t.tag, count: t._count.tag }));
  },
};
