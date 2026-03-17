import { prisma } from "@kimchupa/db";

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        badges: { include: { badge: true } },
      },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        badges: { include: { badge: true } },
      },
    });
  },

  async create(data: {
    email: string;
    password?: string;
    name?: string;
    nickname?: string;
    image?: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        nickname: data.nickname,
        image: data.image,
        level: 1,
        xp: 0,
      },
    });
  },

  async update(
    id: string,
    data: {
      nickname?: string;
      bio?: string;
      image?: string;
      name?: string;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async updateXpAndLevel(id: string, xp: number, level: number) {
    return prisma.user.update({
      where: { id },
      data: { xp, level },
    });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async exists(id: string) {
    const count = await prisma.user.count({ where: { id } });
    return count > 0;
  },

  async existsByEmail(email: string) {
    const count = await prisma.user.count({ where: { email: email.toLowerCase() } });
    return count > 0;
  },
};
