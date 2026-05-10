import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../components/layout/Container";
import { trpc } from "../hooks/trpc";

export const PostDetailsPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const queryInput = useMemo(() => {
    return slug ? { slug } : undefined;
  }, [slug]);

  const postQuery = trpc.posts.bySlug.useQuery(queryInput as { slug: string }, {
    enabled: Boolean(slug)
  });

  return (
    <main className="py-10 sm:py-12">
      <Container>
        {postQuery.isLoading ? <p className="text-sm text-zinc-600">Loading post...</p> : null}
        {postQuery.isError ? <p className="text-sm text-red-600">Failed to load post.</p> : null}
        {!postQuery.isLoading && !postQuery.data ? <p className="text-sm text-zinc-600">Post not found.</p> : null}
        {postQuery.data ? (
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{postQuery.data.title}</h1>
            <p className="mt-3 text-xs text-zinc-500">{new Date(postQuery.data.createdAt).toLocaleDateString()}</p>
            <div className="prose prose-zinc mt-6 max-w-none whitespace-pre-wrap text-sm leading-7 text-zinc-700">
              {postQuery.data.content}
            </div>
          </article>
        ) : null}
      </Container>
    </main>
  );
};
