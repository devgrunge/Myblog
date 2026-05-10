import { create } from "zustand";
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  authorId: string;
  status: string;
  scheduledFor: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: unknown;
  postCategories?: unknown[];
}

interface BlogStore {
  posts: Post[];
  currentPost: Post | null;
  selectedCategory: string | null;
  setPosts: (posts: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setCategory: (category: string | null) => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  posts: [],
  currentPost: null,
  selectedCategory: null,
  setPosts: (posts) => set({ posts }),
  setCurrentPost: (currentPost) => set({ currentPost }),
  setCategory: (selectedCategory) => set({ selectedCategory })
}));
