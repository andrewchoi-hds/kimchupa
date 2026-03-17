import { kimchiRepository } from "../repositories/kimchi.repository";

export const kimchiService = {
  /** Get all kimchi with pagination */
  async getAll(options?: { page?: number; limit?: number }) {
    return kimchiRepository.findAll(options);
  },

  /** Get a single kimchi by its URL slug */
  async getBySlug(slug: string) {
    return kimchiRepository.findBySlug(slug);
  },

  /** Get a single kimchi by ID */
  async getById(id: string) {
    return kimchiRepository.findById(id);
  },

  /** Search kimchi by query string */
  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return kimchiRepository.search(query.trim());
  },

  /** Get kimchi filtered by region */
  async getByRegion(region: string) {
    return kimchiRepository.findByRegion(region);
  },

  /** Get kimchi filtered by spicy level range */
  async getBySpicyLevel(minLevel: number, maxLevel: number) {
    return kimchiRepository.findBySpicyLevel(minLevel, maxLevel);
  },

  /** Get total count of kimchi in the database */
  async getCount() {
    return kimchiRepository.count();
  },
};
