import { z } from "zod";

export const postStatusSchema = z.enum(["draft", "published", "archived"]);
export const commentStatusSchema = z.enum(["pending", "approved", "spam"]);

export const createAuthorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional()
});

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  authorId: z.string().min(1),
  status: postStatusSchema.default("draft"),
  categoryIds: z.array(z.string()).default([]),
  scheduledFor: z.string().datetime().optional()
});

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  authorName: z.string().min(1),
  authorEmail: z.string().email().optional(),
  content: z.string().min(1),
  parentId: z.string().optional()
});
