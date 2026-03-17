import { postRepository } from "../repositories/post.repository";
import type { PostType } from "@kimchupa/db";

export const postService = {
  async list(options: {
    page?: number;
    limit?: number;
    type?: PostType;
    tag?: string;
    authorId?: string;
  }) {
    return postRepository.findMany(options);
  },

  async getById(id: string) {
    return postRepository.findById(id);
  },

  async getByIdWithViewIncrement(id: string) {
    // Increment view count and return the post
    await postRepository.incrementViewCount(id);
    return postRepository.findById(id);
  },

  async create(data: {
    type: PostType;
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
    images?: string[];
  }) {
    // Auto-generate excerpt from content (first 200 chars, strip HTML-like content)
    const excerpt = generateExcerpt(data.content);

    return postRepository.create({
      ...data,
      excerpt,
    });
  },

  async update(
    id: string,
    data: { title?: string; content?: string; tags?: string[] }
  ) {
    const updateData: { title?: string; content?: string; excerpt?: string; tags?: string[] } = {
      ...data,
    };

    // Regenerate excerpt if content changed
    if (data.content) {
      updateData.excerpt = generateExcerpt(data.content);
    }

    return postRepository.update(id, updateData);
  },

  async delete(id: string) {
    return postRepository.delete(id);
  },

  async toggleLike(postId: string, userId: string) {
    return postRepository.toggleLike(postId, userId);
  },

  async isLikedByUser(postId: string, userId: string) {
    return postRepository.isLikedByUser(postId, userId);
  },

  async getAdjacentPosts(currentId: string) {
    return postRepository.getAdjacentPosts(currentId);
  },

  async getUserStats(userId: string) {
    return postRepository.getUserStats(userId);
  },

  async getPopularTags(limit = 10) {
    return postRepository.getPopularTags(limit);
  },
};

/** Generate excerpt from content: strip markdown/HTML, take first 200 characters */
function generateExcerpt(content: string, maxLength = 200): string {
  // Remove HTML tags
  let text = content.replace(/<[^>]*>/g, "");
  // Remove markdown formatting
  text = text.replace(/[#*_~`>\[\]()!]/g, "");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
