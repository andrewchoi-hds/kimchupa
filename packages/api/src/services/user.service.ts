import { userRepository } from "../repositories/user.repository";

export const userService = {
  async getById(id: string) {
    return userRepository.findById(id);
  },

  async getByEmail(email: string) {
    return userRepository.findByEmail(email);
  },

  async updateProfile(
    id: string,
    data: {
      nickname?: string;
      bio?: string;
      image?: string;
    }
  ) {
    // Validate nickname length if provided
    if (data.nickname !== undefined && data.nickname.trim().length < 2) {
      throw new Error("닉네임은 2자 이상이어야 합니다.");
    }

    return userRepository.update(id, {
      nickname: data.nickname?.trim(),
      bio: data.bio,
      image: data.image,
    });
  },

  async createFromSSO(data: { email: string; name?: string; nickname?: string }) {
    await userRepository.create({
      email: data.email.toLowerCase(),
      name: data.name,
      nickname: data.nickname || data.email.split("@")[0],
    });
    // create 후 findByEmail로 badges 포함된 full user 반환
    return userRepository.findByEmail(data.email.toLowerCase());
  },

  async exists(id: string) {
    return userRepository.exists(id);
  },

  async existsByEmail(email: string) {
    return userRepository.existsByEmail(email);
  },

  async delete(id: string) {
    return userRepository.delete(id);
  },
};
