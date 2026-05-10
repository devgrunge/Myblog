import cron from "node-cron";
import { and, eq, lte } from "drizzle-orm";
import { db } from "../db/index.js";
import { comments, posts } from "../db/schema.js";
export const startCronJobs = () => {
    cron.schedule("*/5 * * * *", async () => {
        const now = new Date().toISOString();
        await db.update(posts).set({
            status: "published",
            publishedAt: now,
            updatedAt: now
        }).where(and(eq(posts.status, "draft"), lte(posts.scheduledFor, now)));
    });
    cron.schedule("0 2 * * *", async () => {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - 30);
        await db.delete(comments).where(and(eq(comments.status, "spam"), lte(comments.createdAt, threshold.toISOString())));
    });
};
