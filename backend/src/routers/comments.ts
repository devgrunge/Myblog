import { and, eq, lte } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { comments } from "../db/schema.js";
import { procedure, router } from "../trpc.js";

const commentStatusSchema = z.enum(["pending", "approved", "spam"]);

export const commentsRouter = router({
  listByPost: procedure
    .input(z.object({ postId: z.string().min(1), status: commentStatusSchema.optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.comments.findMany({
        where: input.status
          ? and(eq(comments.postId, input.postId), eq(comments.status, input.status))
          : eq(comments.postId, input.postId),
        orderBy: (comment, operators) => [operators.desc(comment.createdAt)]
      });
    }),

  create: procedure
    .input(z.object({
      postId: z.string().min(1),
      authorName: z.string().min(1),
      authorEmail: z.string().email().optional(),
      content: z.string().min(1),
      parentId: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(comments).values({
        id,
        postId: input.postId,
        authorName: input.authorName,
        authorEmail: input.authorEmail,
        content: input.content,
        parentId: input.parentId
      });
      return ctx.db.query.comments.findFirst({ where: eq(comments.id, id) });
    }),

  setStatus: procedure
    .input(z.object({ id: z.string().min(1), status: commentStatusSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(comments).set({ status: input.status }).where(eq(comments.id, input.id));
      return ctx.db.query.comments.findFirst({ where: eq(comments.id, input.id) });
    }),

  cleanupSpam: procedure
    .mutation(async ({ ctx }) => {
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - 30);
      const cutoff = threshold.toISOString();

      const oldSpam = await ctx.db.query.comments.findMany({
        where: and(eq(comments.status, "spam"), lte(comments.createdAt, cutoff))
      });

      for (const item of oldSpam) {
        await ctx.db.delete(comments).where(eq(comments.id, item.id));
      }

      return { removed: oldSpam.length };
    })
});
