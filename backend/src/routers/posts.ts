import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { z } from "zod";
import { comments, postCategories, posts } from "../db/schema.js";
import { procedure, protectedProcedure, router } from "../trpc.js";

const postStatusSchema = z.enum(["draft", "published", "archived"]);

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  authorId: z.string().min(1),
  status: postStatusSchema.default("draft"),
  categoryIds: z.array(z.string()).default([]),
  scheduledFor: z.string().datetime().optional()
});

const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().min(1)
});

export const postsRouter = router({
  list: procedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      cursor: z.number().int().min(0).optional(),
      status: postStatusSchema.optional(),
      categorySlug: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const offset = input.cursor ?? 0;
      const items = await ctx.db.query.posts.findMany({
        limit: input.limit + 1,
        offset,
        where: input.status ? eq(posts.status, input.status) : undefined,
        orderBy: [desc(posts.createdAt)],
        with: {
          author: true,
          postCategories: {
            with: {
              category: true
            }
          }
        }
      });

      const filtered = input.categorySlug
        ? items.filter((item) => item.postCategories.some((pc) => pc.category.slug === input.categorySlug))
        : items;

      const hasMore = filtered.length > input.limit;

      return {
        items: filtered.slice(0, input.limit),
        nextCursor: hasMore ? offset + input.limit : null
      };
    }),

  bySlug: procedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          author: true,
          postCategories: {
            with: {
              category: true
            }
          },
          comments: {
            where: eq(comments.status, "approved"),
            orderBy: (comment, operators) => [desc(comment.createdAt)]
          }
        }
      });
    }),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      const slug = slugify(input.title, { lower: true, strict: true });

      await ctx.db.insert(posts).values({
        id,
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt,
        authorId: input.authorId,
        status: input.status,
        scheduledFor: input.scheduledFor
      });

      if (input.categoryIds.length) {
        await ctx.db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: id,
            categoryId
          }))
        );
      }

      return ctx.db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
          author: true,
          postCategories: {
            with: {
              category: true
            }
          }
        }
      });
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...rest } = input;
      const values: Partial<typeof posts.$inferInsert> = {};

      if (rest.title !== undefined) {
        values.title = rest.title;
        values.slug = slugify(rest.title, { lower: true, strict: true });
      }
      if (rest.content !== undefined) values.content = rest.content;
      if (rest.excerpt !== undefined) values.excerpt = rest.excerpt;
      if (rest.authorId !== undefined) values.authorId = rest.authorId;
      if (rest.status !== undefined) values.status = rest.status;
      if (rest.scheduledFor !== undefined) values.scheduledFor = rest.scheduledFor;
      values.updatedAt = new Date().toISOString();

      if (Object.keys(values).length > 0) {
        await ctx.db.update(posts).set(values).where(eq(posts.id, id));
      }

      if (categoryIds) {
        await ctx.db.delete(postCategories).where(eq(postCategories.postId, id));
        if (categoryIds.length) {
          await ctx.db.insert(postCategories).values(categoryIds.map((categoryId) => ({ postId: id, categoryId })));
        }
      }

      return ctx.db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
          author: true,
          postCategories: {
            with: {
              category: true
            }
          }
        }
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { ok: true };
    }),

  publishScheduled: procedure
    .mutation(async ({ ctx }) => {
      const now = new Date().toISOString();
      const draftPosts = await ctx.db.query.posts.findMany({
        where: eq(posts.status, "draft")
      });

      const toPublish = draftPosts.filter((post) => post.scheduledFor && post.scheduledFor <= now);

      for (const post of toPublish) {
        await ctx.db.update(posts).set({
          status: "published",
          publishedAt: now,
          updatedAt: now
        }).where(and(eq(posts.id, post.id), eq(posts.status, "draft")));
      }

      return { updated: toPublish.length };
    })
});
