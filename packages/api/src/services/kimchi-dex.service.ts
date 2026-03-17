import { kimchiDexRepository } from "../repositories/kimchi-dex.repository";
import type { KimchiDexStatus } from "@kimchupa/db";

export const kimchiDexService = {
  /** Get all dex entries for a user */
  async getByUser(userId: string) {
    return kimchiDexRepository.findByUser(userId);
  },

  /** Get a specific entry */
  async getEntry(userId: string, kimchiId: string) {
    return kimchiDexRepository.findByUserAndKimchi(userId, kimchiId);
  },

  /** Set or update the status of a kimchi in the user's dex */
  async setStatus(
    userId: string,
    kimchiId: string,
    status: KimchiDexStatus,
    rating?: number | null,
    memo?: string | null
  ) {
    return kimchiDexRepository.upsert(userId, kimchiId, status, rating, memo);
  },

  /** Update rating for a kimchi entry */
  async setRating(userId: string, kimchiId: string, rating: number | null) {
    const entry = await kimchiDexRepository.findByUserAndKimchi(userId, kimchiId);
    if (!entry) {
      throw new Error("Entry not found. Set a status first.");
    }
    return kimchiDexRepository.upsert(userId, kimchiId, entry.status, rating);
  },

  /** Update memo for a kimchi entry */
  async setMemo(userId: string, kimchiId: string, memo: string) {
    const entry = await kimchiDexRepository.findByUserAndKimchi(userId, kimchiId);
    if (!entry) {
      throw new Error("Entry not found. Set a status first.");
    }
    return kimchiDexRepository.upsert(userId, kimchiId, entry.status, undefined, memo);
  },

  /** Remove a kimchi entry from the user's dex */
  async removeEntry(userId: string, kimchiId: string) {
    return kimchiDexRepository.remove(userId, kimchiId);
  },

  /** Get collection statistics for a user */
  async getStats(userId: string) {
    return kimchiDexRepository.getStats(userId);
  },

  /** Get list of collected kimchi IDs */
  async getCollectedIds(userId: string) {
    return kimchiDexRepository.getCollectedKimchiIds(userId);
  },
};
