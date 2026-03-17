import { prisma } from "@kimchupa/db";

export const searchService = {
  /**
   * Search across posts and kimchi.
   * Returns combined results from both sources.
   */
  async search(query: string, options?: { limit?: number }) {
    const { limit = 20 } = options || {};

    if (!query || query.trim().length === 0) {
      return { posts: [], kimchis: [], totalResults: 0 };
    }

    const searchTerm = query.trim();

    const [posts, kimchis] = await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { content: { contains: searchTerm, mode: "insensitive" } },
            { excerpt: { contains: searchTerm, mode: "insensitive" } },
            { tags: { some: { tag: { contains: searchTerm, mode: "insensitive" } } } },
          ],
        },
        include: {
          author: true,
          tags: true,
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.kimchi.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { nameEn: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { region: { contains: searchTerm, mode: "insensitive" } },
            { tags: { some: { tag: { contains: searchTerm, mode: "insensitive" } } } },
          ],
        },
        include: {
          ingredients: true,
          tags: true,
        },
        orderBy: { name: "asc" },
        take: limit,
      }),
    ]);

    return {
      posts,
      kimchis,
      totalResults: posts.length + kimchis.length,
    };
  },
};
