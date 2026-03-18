import { prisma } from "@kimchupa/db";
import crypto from "crypto";

export const passwordResetRepository = {
  async create(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return prisma.passwordResetToken.create({
      data: { userId, token, expiresAt },
    });
  },

  async findByToken(token: string) {
    return prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
  },

  async markUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { used: true },
    });
  },
};
