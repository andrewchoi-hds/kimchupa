import { z } from "zod";

export const updateProfileSchema = z.object({
  nickname: z.string().min(2).max(20).optional(),
  bio: z.string().max(200).optional(),
  image: z.string().optional(),
});
