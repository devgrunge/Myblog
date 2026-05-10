import { CategoryFilter } from "../components/CategoryFilter";
import { PostList } from "../components/PostList";

export const HomePage = () => {
  return (
    <main>
      <h1>Blog</h1>
      <CategoryFilter />
      <PostList />
    </main>
  );
};
