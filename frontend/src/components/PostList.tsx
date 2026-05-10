import { useMemo } from "react";
import { trpc } from "../hooks/trpc";
import { useBlogStore } from "../stores/blogStore";

export const PostList = () => {
  const selectedCategory = useBlogStore((state) => state.selectedCategory);
  const setPosts = useBlogStore((state) => state.setPosts);

  const queryInput = useMemo(() => ({
    limit: 10,
    status: "published" as const,
    categorySlug: selectedCategory ?? undefined
  }), [selectedCategory]);

  const postsQuery = trpc.posts.list.useQuery(queryInput);

  if (postsQuery.data) {
    setPosts(postsQuery.data);
  }

  if (postsQuery.isLoading) {
    return <p>Carregando posts...</p>;
  }

  if (postsQuery.isError) {
    return <p>Erro ao carregar posts.</p>;
  }

  return (
    <ul>
      {(postsQuery.data ?? []).map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.excerpt ?? "Sem resumo"}</p>
          <small>Status: {post.status}</small>
        </li>
      ))}
    </ul>
  );
};
