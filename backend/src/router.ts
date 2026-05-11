import { adminRouter } from "./routers/admin.js";
import { authorsRouter } from "./routers/authors.js";
import { categoriesRouter } from "./routers/categories.js";
import { commentsRouter } from "./routers/comments.js";
import { postsRouter } from "./routers/posts.js";
import { router } from "./trpc.js";

export const appRouter = router({
  admin: adminRouter,
  posts: postsRouter,
  comments: commentsRouter,
  categories: categoriesRouter,
  authors: authorsRouter
});

export type AppRouter = typeof appRouter;
