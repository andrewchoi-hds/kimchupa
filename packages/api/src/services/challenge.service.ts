import { challengeRepository } from "../repositories/challenge.repository";
import { xpService } from "./xp.service";

export const challengeService = {
  /** Get the currently active challenge */
  async getActive() {
    return challengeRepository.getActive();
  },

  /** List all challenges with pagination */
  async getAll(page: number = 1, limit: number = 10) {
    const { challenges, total } = await challengeRepository.getAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      challenges,
      page,
      limit,
      total,
      totalPages,
    };
  },

  /** Get a single challenge by ID */
  async getById(id: string) {
    return challengeRepository.getById(id);
  },

  /** Join a challenge */
  async join(challengeId: string, userId: string) {
    // Check if challenge exists
    const challenge = await challengeRepository.getById(challengeId);
    if (!challenge) {
      throw new Error("챌린지를 찾을 수 없습니다");
    }

    // Check if already joined
    const alreadyJoined = await challengeRepository.isJoined(challengeId, userId);
    if (alreadyJoined) {
      throw new Error("이미 참여한 챌린지입니다");
    }

    return challengeRepository.join(challengeId, userId);
  },

  /** Complete a challenge and award XP */
  async complete(challengeId: string, userId: string, postId?: string) {
    // Check if challenge exists
    const challenge = await challengeRepository.getById(challengeId);
    if (!challenge) {
      throw new Error("챌린지를 찾을 수 없습니다");
    }

    // Check if user has joined
    const participant = await challengeRepository.getParticipantStatus(challengeId, userId);
    if (!participant) {
      throw new Error("먼저 챌린지에 참여해주세요");
    }

    if (participant.status === "completed") {
      throw new Error("이미 완료한 챌린지입니다");
    }

    // Mark as completed
    const updated = await challengeRepository.complete(challengeId, userId, postId);

    // Award XP
    await xpService.addXp(userId, challenge.xpReward, "challenge_complete", {
      challengeId,
      challengeTitle: challenge.title,
    });

    return { participant: updated, xpAwarded: challenge.xpReward };
  },

  /** Get participants of a challenge */
  async getParticipants(challengeId: string) {
    return challengeRepository.getParticipants(challengeId);
  },

  /** Check if a user has joined a challenge */
  async isJoined(challengeId: string, userId: string) {
    return challengeRepository.isJoined(challengeId, userId);
  },

  /** Get participant status (joined/completed) */
  async getParticipantStatus(challengeId: string, userId: string) {
    return challengeRepository.getParticipantStatus(challengeId, userId);
  },

  /** Get participant count for a challenge */
  async getParticipantCount(challengeId: string) {
    return challengeRepository.getParticipantCount(challengeId);
  },
};
