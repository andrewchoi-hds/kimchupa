import { z } from "zod";

export const postTypeSchema = z.enum(["recipe", "free", "qna", "review", "diary"]);

export const createPostSchema = z.object({
  type: postTypeSchema,
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  excerpt: z.string().max(300).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  images: z.array(z.string().url()).max(10).optional(),
});

export const updatePostSchema = z.object({
  type: postTypeSchema.optional(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  excerpt: z.string().max(300).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  images: z.array(z.string().url()).max(10).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});
