import { z } from "zod";
export declare const postStatusSchema: z.ZodEnum<{
    draft: "draft";
    published: "published";
    archived: "archived";
}>;
export declare const commentStatusSchema: z.ZodEnum<{
    pending: "pending";
    approved: "approved";
    spam: "spam";
}>;
export declare const createAuthorSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    avatarUrl: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    authorId: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
    categoryIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    scheduledFor: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createCommentSchema: z.ZodObject<{
    postId: z.ZodString;
    authorName: z.ZodString;
    authorEmail: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
