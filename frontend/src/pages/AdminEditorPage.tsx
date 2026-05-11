import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Container } from "../components/layout/Container";
import { trpc } from "../hooks/trpc";
import { useAdminAuthStore } from "../stores/adminAuthStore";

export const AdminEditorPage = () => {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const logout = useAdminAuthStore((state) => state.logout);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const utils = trpc.useUtils();
  const categoriesQuery = trpc.categories.list.useQuery();
  const authorsQuery = trpc.authors.list.useQuery();

  const createCategoryMutation = trpc.categories.create.useMutation({
    onSuccess: async () => {
      setCategoryName("");
      setCategoryDescription("");
      setMessage("Category created.");
      await utils.categories.list.invalidate();
    },
    onError: () => setMessage("Failed to create category.")
  });

  const createPostMutation = trpc.posts.create.useMutation({
    onSuccess: async () => {
      setTitle("");
      setContent("");
      setExcerpt("");
      setCategoryIds([]);
      setMessage("Post created.");
      await utils.posts.list.invalidate();
    },
    onError: () => setMessage("Failed to create post.")
  });

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="py-10 sm:py-12">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">Admin editor</h1>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-zinc-700">View site</Link>
            <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-medium text-zinc-900">Create category</h2>
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setMessage("");
                createCategoryMutation.mutate({ name: categoryName, description: categoryDescription || undefined });
              }}
            >
              <input
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Category name"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                required
              />
              <textarea
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Description"
                value={categoryDescription}
                onChange={(event) => setCategoryDescription(event.target.value)}
                rows={3}
              />
              <button type="submit" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white" disabled={createCategoryMutation.isPending}>
                {createCategoryMutation.isPending ? "Saving..." : "Create category"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-medium text-zinc-900">Create post (Markdown)</h2>
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                setMessage("");
                createPostMutation.mutate({
                  title,
                  content,
                  excerpt: excerpt || undefined,
                  authorId,
                  status,
                  categoryIds
                });
              }}
            >
              <input
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Post title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <select
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                value={authorId}
                onChange={(event) => setAuthorId(event.target.value)}
                required
              >
                <option value="">Select an author</option>
                {(authorsQuery.data ?? []).map((author) => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
              <select
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                value={status}
                onChange={(event) => setStatus(event.target.value as "draft" | "published" | "archived")}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
              <input
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
              />
              <label className="block text-sm text-zinc-700">Categories</label>
              <div className="grid gap-2 rounded-lg border border-zinc-200 p-3">
                {(categoriesQuery.data ?? []).map((category) => (
                  <label key={category.id} className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={(event) => {
                        setCategoryIds((prev) => event.target.checked ? [...prev, category.id] : prev.filter((id) => id !== category.id));
                      }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
              <textarea
                className="min-h-[240px] w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
                placeholder="Write markdown content here"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
              />
              <button type="submit" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white" disabled={createPostMutation.isPending}>
                {createPostMutation.isPending ? "Saving..." : "Create post"}
              </button>
            </form>
          </section>
        </div>

        {message ? <p className="mt-4 text-sm text-zinc-700">{message}</p> : null}
      </Container>
    </main>
  );
};
