import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";

const SALT_ROUNDS = 12;
const DEMO_EMAIL = "demo@kimchupa.com";
const DEMO_PASSWORD = "demo1234";

export const authService = {
  async register(email: string, password: string, nickname: string) {
    const normalizedEmail = email.toLowerCase();

    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      return null;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userRepository.create({
      email: normalizedEmail,
      password: passwordHash,
      nickname: nickname.trim(),
      name: nickname.trim(),
    });

    return user;
  },

  async authenticate(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    // Demo account shortcut
    if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const existing = await userRepository.findByEmail(DEMO_EMAIL);
      if (existing) return existing;

      await userRepository.create({
        email: DEMO_EMAIL,
        password: await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS),
        nickname: "김치새싹",
        name: "김치새싹",
      });
      return await userRepository.findByEmail(DEMO_EMAIL);
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user || !user.password) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }

    return user;
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};
