import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authors } from "../db/schema.js";
import { procedure, router } from "../trpc.js";
export const authorsRouter = router({
    list: procedure.query(async ({ ctx }) => {
        return ctx.db.query.authors.findMany({
            orderBy: (author, operators) => [operators.asc(author.name)]
        });
    }),
    byId: procedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
        return ctx.db.query.authors.findFirst({ where: eq(authors.id, input.id) });
    }),
    create: procedure
        .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        avatarUrl: z.string().url().optional(),
        bio: z.string().optional()
    }))
        .mutation(async ({ ctx, input }) => {
        const id = nanoid();
        await ctx.db.insert(authors).values({
            id,
            name: input.name,
            email: input.email,
            avatarUrl: input.avatarUrl,
            bio: input.bio
        });
        return ctx.db.query.authors.findFirst({ where: eq(authors.id, id) });
    }),
    update: procedure
        .input(z.object({
        id: z.string().min(1),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        avatarUrl: z.string().url().optional(),
        bio: z.string().optional()
    }))
        .mutation(async ({ ctx, input }) => {
        const updates = {
            updatedAt: new Date().toISOString()
        };
        if (input.name !== undefined)
            updates.name = input.name;
        if (input.email !== undefined)
            updates.email = input.email;
        if (input.avatarUrl !== undefined)
            updates.avatarUrl = input.avatarUrl;
        if (input.bio !== undefined)
            updates.bio = input.bio;
        await ctx.db.update(authors).set(updates).where(eq(authors.id, input.id));
        return ctx.db.query.authors.findFirst({ where: eq(authors.id, input.id) });
    }),
    remove: procedure
        .input(z.object({ id: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
        await ctx.db.delete(authors).where(eq(authors.id, input.id));
        return { ok: true };
    })
});
