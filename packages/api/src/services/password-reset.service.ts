import bcrypt from "bcryptjs";
import { prisma } from "@kimchupa/db";
import { userRepository } from "../repositories/user.repository";
import { passwordResetRepository } from "../repositories/password-reset.repository";

const SALT_ROUNDS = 12;

export const passwordResetService = {
  async requestReset(email: string): Promise<string | null> {
    const normalizedEmail = email.toLowerCase();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      return null;
    }

    const resetToken = await passwordResetRepository.create(user.id);
    return resetToken.token;
  },

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    const resetToken = await passwordResetRepository.findByToken(token);

    if (!resetToken) {
      return { success: false, error: "유효하지 않은 토큰입니다." };
    }

    if (resetToken.used) {
      return { success: false, error: "이미 사용된 토큰입니다." };
    }

    if (resetToken.expiresAt < new Date()) {
      return { success: false, error: "만료된 토큰입니다. 다시 요청해주세요." };
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: passwordHash },
    });

    await passwordResetRepository.markUsed(resetToken.id);

    return { success: true };
  },
};
