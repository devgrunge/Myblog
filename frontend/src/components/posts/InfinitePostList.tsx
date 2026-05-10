import { useEffect, useMemo, useRef } from "react";
import { trpc } from "../../hooks/trpc";
import { PostCard } from "./PostCard";
import { PostsSkeleton } from "./PostsSkeleton";

export const InfinitePostList = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const postsQuery = trpc.posts.list.useInfiniteQuery(
    {
      limit: 8,
      status: "published"
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined
    }
  );

  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) {
        void postsQuery.fetchNextPage();
      }
    }, { rootMargin: "200px" });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [postsQuery]);

  const posts = useMemo(() => {
    return postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  }, [postsQuery.data]);

  if (postsQuery.isLoading) {
    return <PostsSkeleton />;
  }

  if (postsQuery.isError) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">Failed to load posts.</p>;
  }

  if (!posts.length) {
    return <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">No posts published yet.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} id={post.id} slug={post.slug} title={post.title} excerpt={post.excerpt} createdAt={post.createdAt} />
      ))}
      <div ref={observerRef} className="h-1" />
      {postsQuery.isFetchingNextPage ? <PostsSkeleton /> : null}
    </div>
  );
};
