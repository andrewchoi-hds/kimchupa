import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockPost, MockComment, MockUser, MOCK_POSTS, MOCK_COMMENTS } from "@/constants/mockData";

interface PostsState {
  posts: MockPost[];
  comments: MockComment[];

  // Actions
  addPost: (
    post: Omit<MockPost, "id" | "author" | "createdAt" | "likeCount" | "likedBy" | "commentCount" | "viewCount">,
    author: MockUser
  ) => string;
  updatePost: (id: string, updates: Partial<Pick<MockPost, "title" | "content" | "tags" | "type">>) => void;
  deletePost: (id: string) => void;
  incrementViewCount: (id: string) => void;
  toggleLike: (postId: string, userId: string) => boolean; // returns: true if liked, false if unliked

  // Comments
  addComment: (postId: string, content: string, author: MockUser, parentId?: string | null) => void;
  deleteComment: (commentId: string) => void;
  toggleCommentLike: (commentId: string) => void;
  getReplies: (commentId: string) => MockComment[];

  // Utils
  getPostById: (id: string) => MockPost | undefined;
  getCommentsByPostId: (postId: string) => MockComment[];
  isLikedByUser: (postId: string, userId: string) => boolean;
  getAdjacentPosts: (currentId: string) => { prev: MockPost | null; next: MockPost | null };

  // User Statistics
  getUserStats: (userId: string) => {
    posts: number;
    comments: number;
    likesReceived: number;
  };
  getUserPosts: (userId: string) => MockPost[];
  getUserComments: (userId: string) => MockComment[];

  // Tag Statistics
  getPopularTags: (limit?: number) => { tag: string; count: number }[];
}

// Generate unique ID
const generateId = () => `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const generateCommentId = () => `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: MOCK_POSTS,
      comments: MOCK_COMMENTS,

      addPost: (postData, author) => {
        const id = generateId();
        const newPost: MockPost = {
          id,
          ...postData,
          author,
          createdAt: new Date().toISOString(),
          likeCount: 0,
          likedBy: [],
          commentCount: 0,
          viewCount: 0,
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));

        return id;
      },

      updatePost: (id, updates) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, ...updates } : post
          ),
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
          comments: state.comments.filter((comment) => comment.postId !== id),
        }));
      },

      incrementViewCount: (id) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, viewCount: post.viewCount + 1 } : post
          ),
        }));
      },

      toggleLike: (postId, userId) => {
        const post = get().posts.find((p) => p.id === postId);
        if (!post) return false;

        const isCurrentlyLiked = post.likedBy.includes(userId);

        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;

            if (isCurrentlyLiked) {
              // Unlike: remove user from likedBy and decrement count
              return {
                ...p,
                likedBy: p.likedBy.filter((id) => id !== userId),
                likeCount: Math.max(0, p.likeCount - 1),
              };
            } else {
              // Like: add user to likedBy and increment count
              return {
                ...p,
                likedBy: [...p.likedBy, userId],
                likeCount: p.likeCount + 1,
              };
            }
          }),
        }));

        return !isCurrentlyLiked; // Returns new state: true if now liked
      },

      addComment: (postId, content, author, parentId = null) => {
        const newComment: MockComment = {
          id: generateCommentId(),
          postId,
          parentId,
          content,
          author,
          likeCount: 0,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          comments: [...state.comments, newComment],
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, commentCount: post.commentCount + 1 }
              : post
          ),
        }));
      },

      deleteComment: (commentId) => {
        const comment = get().comments.find((c) => c.id === commentId);
        if (!comment) return;

        set((state) => ({
          comments: state.comments.filter((c) => c.id !== commentId),
          posts: state.posts.map((post) =>
            post.id === comment.postId
              ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
              : post
          ),
        }));
      },

      toggleCommentLike: (commentId) => {
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likeCount: comment.likeCount + 1 }
              : comment
          ),
        }));
      },

      getPostById: (id) => {
        return get().posts.find((post) => post.id === id);
      },

      getCommentsByPostId: (postId) => {
        // 루트 댓글만 반환 (parentId가 null인 것)
        return get().comments.filter(
          (comment) => comment.postId === postId && comment.parentId === null
        );
      },

      getReplies: (commentId) => {
        return get().comments.filter((comment) => comment.parentId === commentId);
      },

      isLikedByUser: (postId, userId) => {
        const post = get().posts.find((p) => p.id === postId);
        return post ? post.likedBy.includes(userId) : false;
      },

      getAdjacentPosts: (currentId) => {
        const posts = get().posts;
        const currentIndex = posts.findIndex((p) => p.id === currentId);

        if (currentIndex === -1) {
          return { prev: null, next: null };
        }

        // Posts are sorted newest first, so "next" is older (higher index), "prev" is newer (lower index)
        const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

        return { prev, next };
      },

      // User Statistics
      getUserStats: (userId) => {
        const state = get();
        const userPosts = state.posts.filter((p) => p.author.id === userId);
        const userComments = state.comments.filter((c) => c.author.id === userId);
        const likesReceived = userPosts.reduce((sum, post) => sum + post.likeCount, 0);

        return {
          posts: userPosts.length,
          comments: userComments.length,
          likesReceived,
        };
      },

      getUserPosts: (userId) => {
        return get().posts.filter((p) => p.author.id === userId);
      },

      getUserComments: (userId) => {
        return get().comments.filter((c) => c.author.id === userId);
      },

      // Tag Statistics
      getPopularTags: (limit = 10) => {
        const tagCount: Record<string, number> = {};

        get().posts.forEach((post) => {
          post.tags.forEach((tag) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        });

        return Object.entries(tagCount)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
      },
    }),
    {
      name: "kimchupa-posts",
      partialize: (state) => ({
        posts: state.posts,
        comments: state.comments,
      }),
    }
  )
);
