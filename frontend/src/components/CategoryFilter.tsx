import { trpc } from "../hooks/trpc";
import { useBlogStore } from "../stores/blogStore";

export const CategoryFilter = () => {
  const selectedCategory = useBlogStore((state) => state.selectedCategory);
  const setCategory = useBlogStore((state) => state.setCategory);
  const categoriesQuery = trpc.categories.list.useQuery();

  return (
    <div>
      <label htmlFor="category-filter">Categoria</label>
      <select
        id="category-filter"
        value={selectedCategory ?? ""}
        onChange={(event) => setCategory(event.target.value || null)}
      >
        <option value="">Todas</option>
        {(categoriesQuery.data ?? []).map((category) => (
          <option key={category.id} value={category.slug}>{category.name}</option>
        ))}
      </select>
    </div>
  );
};
