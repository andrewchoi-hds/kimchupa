import { z } from "zod";

export const postTypeSchema = z.enum(["recipe", "free", "qna", "review", "diary"]);

export const createPostSchema = z.object({
  type: postTypeSchema,
  title: z.string().min(1).max(100),
  content: z.string().min(1),
  excerpt: z.string().max(200).optional(),
  tags: z.array(z.string()).max(5).optional(),
  images: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  type: postTypeSchema.optional(),
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(200).optional(),
  tags: z.array(z.string()).max(5).optional(),
  images: z.array(z.string()).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().optional(),
});
