import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
export const authors = sqliteTable("authors", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    createdAt: text("created_at").notNull().default(sql `CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql `CURRENT_TIMESTAMP`)
}, (table) => ({
    emailUnique: uniqueIndex("authors_email_unique").on(table.email)
}));
export const categories = sqliteTable("categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    createdAt: text("created_at").notNull().default(sql `CURRENT_TIMESTAMP`)
}, (table) => ({
    nameUnique: uniqueIndex("categories_name_unique").on(table.name),
    slugUnique: uniqueIndex("categories_slug_unique").on(table.slug)
}));
export const posts = sqliteTable("posts", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    authorId: text("author_id").notNull().references(() => authors.id),
    status: text("status").notNull().default("draft"),
    scheduledFor: text("scheduled_for"),
    publishedAt: text("published_at"),
    createdAt: text("created_at").notNull().default(sql `CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql `CURRENT_TIMESTAMP`)
}, (table) => ({
    slugUnique: uniqueIndex("posts_slug_unique").on(table.slug),
    slugIdx: index("idx_posts_slug").on(table.slug),
    authorIdx: index("idx_posts_author").on(table.authorId),
    statusIdx: index("idx_posts_status").on(table.status),
    publishedIdx: index("idx_posts_published").on(table.publishedAt)
}));
export const postCategories = sqliteTable("post_categories", {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" })
}, (table) => ({
    pk: primaryKey({ columns: [table.postId, table.categoryId] })
}));
export const comments = sqliteTable("comments", {
    id: text("id").primaryKey(),
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    authorEmail: text("author_email"),
    content: text("content").notNull(),
    parentId: text("parent_id").references(() => comments.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    createdAt: text("created_at").notNull().default(sql `CURRENT_TIMESTAMP`)
}, (table) => ({
    postIdx: index("idx_comments_post").on(table.postId)
}));
export const authorsRelations = relations(authors, ({ many }) => ({
    posts: many(posts)
}));
export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(authors, {
        fields: [posts.authorId],
        references: [authors.id]
    }),
    postCategories: many(postCategories),
    comments: many(comments)
}));
export const categoriesRelations = relations(categories, ({ many }) => ({
    postCategories: many(postCategories)
}));
export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
    post: one(posts, {
        fields: [postCategories.postId],
        references: [posts.id]
    }),
    category: one(categories, {
        fields: [postCategories.categoryId],
        references: [categories.id]
    })
}));
export const commentsRelations = relations(comments, ({ one, many }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id]
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id]
    }),
    replies: many(comments)
}));
