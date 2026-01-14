import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarksState {
  // postId 목록
  bookmarkedPosts: string[];

  // Actions
  toggleBookmark: (postId: string) => boolean; // returns new state
  isBookmarked: (postId: string) => boolean;
  getBookmarkCount: () => number;
  clearAll: () => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarkedPosts: [],

      toggleBookmark: (postId) => {
        const current = get().bookmarkedPosts;
        const isCurrentlyBookmarked = current.includes(postId);

        if (isCurrentlyBookmarked) {
          // 북마크 해제
          set({
            bookmarkedPosts: current.filter((id) => id !== postId),
          });
          return false;
        } else {
          // 북마크 추가
          set({
            bookmarkedPosts: [...current, postId],
          });
          return true;
        }
      },

      isBookmarked: (postId) => {
        return get().bookmarkedPosts.includes(postId);
      },

      getBookmarkCount: () => {
        return get().bookmarkedPosts.length;
      },

      clearAll: () => {
        set({ bookmarkedPosts: [] });
      },
    }),
    {
      name: "kimchupa-bookmarks",
      partialize: (state) => ({
        bookmarkedPosts: state.bookmarkedPosts,
      }),
    }
  )
);
