import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockPost, MockComment, MockUser, MOCK_POSTS, MOCK_COMMENTS, CURRENT_USER } from "@/constants/mockData";

interface PostsState {
  posts: MockPost[];
  comments: MockComment[];

  // Actions
  addPost: (post: Omit<MockPost, "id" | "author" | "createdAt" | "likeCount" | "commentCount" | "viewCount">) => string;
  updatePost: (id: string, updates: Partial<Pick<MockPost, "title" | "content" | "tags" | "type">>) => void;
  deletePost: (id: string) => void;
  incrementViewCount: (id: string) => void;
  toggleLike: (id: string) => void;

  // Comments
  addComment: (postId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  toggleCommentLike: (commentId: string) => void;

  // Utils
  getPostById: (id: string) => MockPost | undefined;
  getCommentsByPostId: (postId: string) => MockComment[];
}

// Generate unique ID
const generateId = () => `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const generateCommentId = () => `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: MOCK_POSTS,
      comments: MOCK_COMMENTS,

      addPost: (postData) => {
        const id = generateId();
        const newPost: MockPost = {
          id,
          ...postData,
          author: CURRENT_USER,
          createdAt: new Date().toISOString(),
          likeCount: 0,
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

      toggleLike: (id) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id
              ? { ...post, likeCount: post.likeCount + 1 }
              : post
          ),
        }));
      },

      addComment: (postId, content) => {
        const newComment: MockComment = {
          id: generateCommentId(),
          postId,
          content,
          author: CURRENT_USER,
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
        return get().comments.filter((comment) => comment.postId === postId);
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
