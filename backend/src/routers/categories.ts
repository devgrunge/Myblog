import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { z } from "zod";
import { categories } from "../db/schema.js";
import { procedure, protectedProcedure, router } from "../trpc.js";

export const categoriesRouter = router({
  list: procedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: (category, operators) => [operators.asc(category.name)]
    });
  }),

  bySlug: procedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.categories.findFirst({ where: eq(categories.slug, input.slug) });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      await ctx.db.insert(categories).values({
        id,
        name: input.name,
        slug: slugify(input.name, { lower: true, strict: true }),
        description: input.description
      });
      return ctx.db.query.categories.findFirst({ where: eq(categories.id, id) });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string().min(1), name: z.string().min(1).optional(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const updates: Partial<typeof categories.$inferInsert> = {};
      if (input.name !== undefined) {
        updates.name = input.name;
        updates.slug = slugify(input.name, { lower: true, strict: true });
      }
      if (input.description !== undefined) updates.description = input.description;
      await ctx.db.update(categories).set(updates).where(eq(categories.id, input.id));
      return ctx.db.query.categories.findFirst({ where: eq(categories.id, input.id) });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
      return { ok: true };
    })
});
