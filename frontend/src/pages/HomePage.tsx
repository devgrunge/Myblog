import { Container } from "../components/layout/Container";
import { InfinitePostList } from "../components/posts/InfinitePostList";

export const HomePage = () => {
  return (
    <main className="py-10 sm:py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Latest posts</h1>
          <p className="mt-2 text-sm text-zinc-600">Scroll to load more posts.</p>
        </div>
        <InfinitePostList />
      </Container>
    </main>
  );
};
