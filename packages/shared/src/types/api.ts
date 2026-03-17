import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { updateProfileSchema } from "../schemas/user.schema";
import {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  postTypeSchema,
} from "../schemas/post.schema";
import {
  paginationMetaSchema,
  apiErrorSchema,
  paginationQuerySchema,
} from "../schemas/common.schema";

// Auth types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// User types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Post types
export type PostTypeEnum = z.infer<typeof postTypeSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// Common types
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
