export type PostStatus = "draft" | "published" | "archived";
export type CommentStatus = "pending" | "approved" | "spam";
export interface Author {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
}
export interface Comment {
    id: string;
    postId: string;
    authorName: string;
    authorEmail: string | null;
    content: string;
    parentId: string | null;
    status: CommentStatus;
    createdAt: string;
}
export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    authorId: string;
    status: PostStatus;
    scheduledFor: string | null;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}
