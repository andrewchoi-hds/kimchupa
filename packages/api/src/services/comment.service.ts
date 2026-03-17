import { prisma } from "@kimchupa/db";
import { commentRepository } from "../repositories/comment.repository";

export const commentService = {
  async getByPostId(postId: string) {
    return commentRepository.findByPostId(postId);
  },

  async getById(id: string) {
    return commentRepository.findById(id);
  },

  async getReplies(commentId: string) {
    return commentRepository.findReplies(commentId);
  },

  async create(data: {
    postId: string;
    authorId: string;
    content: string;
    parentId?: string | null;
  }) {
    // Create comment and update post's commentCount in a transaction
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          postId: data.postId,
          authorId: data.authorId,
          content: data.content,
          parentId: data.parentId || null,
        },
        include: { author: true },
      }),
      prisma.post.update({
        where: { id: data.postId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);

    return comment;
  },

  async update(id: string, content: string) {
    return commentRepository.update(id, { content });
  },

  async delete(commentId: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) return null;

    // Delete comment and decrement post's commentCount in a transaction
    const [deleted] = await prisma.$transaction([
      prisma.comment.delete({ where: { id: commentId } }),
      prisma.post.update({
        where: { id: comment.postId },
        data: { commentCount: { decrement: 1 } },
      }),
    ]);

    return deleted;
  },

  async toggleLike(commentId: string) {
    return commentRepository.toggleLike(commentId);
  },

  async getUserComments(userId: string, options?: { page?: number; limit?: number }) {
    return commentRepository.findByUserId(userId, options);
  },
};
