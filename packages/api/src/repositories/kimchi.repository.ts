import { prisma } from "@kimchupa/db";

export const kimchiRepository = {
  async findAll(options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = options || {};

    const [kimchis, total] = await Promise.all([
      prisma.kimchi.findMany({
        include: {
          ingredients: true,
          pairings: true,
          healthBenefits: true,
          tags: true,
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.kimchi.count(),
    ]);

    return { kimchis, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findBySlug(slug: string) {
    return prisma.kimchi.findUnique({
      where: { slug },
      include: {
        ingredients: true,
        pairings: true,
        healthBenefits: true,
        tags: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.kimchi.findUnique({
      where: { id },
      include: {
        ingredients: true,
        pairings: true,
        healthBenefits: true,
        tags: true,
      },
    });
  },

  async search(query: string) {
    const searchTerm = `%${query}%`;

    return prisma.kimchi.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { nameEn: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { region: { contains: query, mode: "insensitive" } },
          { tags: { some: { tag: { contains: query, mode: "insensitive" } } } },
        ],
      },
      include: {
        ingredients: true,
        pairings: true,
        healthBenefits: true,
        tags: true,
      },
      orderBy: { name: "asc" },
    });
  },

  async findByRegion(region: string) {
    return prisma.kimchi.findMany({
      where: { region: { contains: region, mode: "insensitive" } },
      include: {
        ingredients: true,
        tags: true,
      },
      orderBy: { name: "asc" },
    });
  },

  async findBySpicyLevel(minLevel: number, maxLevel: number) {
    return prisma.kimchi.findMany({
      where: {
        spicyLevel: { gte: minLevel, lte: maxLevel },
      },
      include: {
        ingredients: true,
        tags: true,
      },
      orderBy: { name: "asc" },
    });
  },

  async count() {
    return prisma.kimchi.count();
  },
};
