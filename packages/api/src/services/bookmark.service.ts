import { bookmarkRepository } from "../repositories/bookmark.repository";

export const bookmarkService = {
  /** Get all bookmarked posts for a user */
  async getByUser(userId: string, options?: { page?: number; limit?: number }) {
    return bookmarkRepository.findByUser(userId, options);
  },

  /** Toggle bookmark on a post. Returns true if bookmarked, false if removed. */
  async toggle(userId: string, postId: string) {
    return bookmarkRepository.toggle(userId, postId);
  },

  /** Check if a post is bookmarked by a user */
  async isBookmarked(userId: string, postId: string) {
    return bookmarkRepository.exists(userId, postId);
  },

  /** Get total bookmark count for a user */
  async getCount(userId: string) {
    return bookmarkRepository.count(userId);
  },

  /** Remove all bookmarks for a user */
  async clearAll(userId: string) {
    return bookmarkRepository.removeAll(userId);
  },
};
