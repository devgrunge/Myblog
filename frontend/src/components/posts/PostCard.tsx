import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface PostCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  createdAt: string;
}

export const PostCard = ({ slug, title, excerpt, createdAt }: PostCardProps) => {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-3 inline-flex items-center gap-1 text-xs text-zinc-500">
        <CalendarDaysIcon className="h-4 w-4" />
        <time dateTime={createdAt}>{new Date(createdAt).toLocaleDateString()}</time>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900">
        <Link to={`/post/${slug}`} className="hover:text-zinc-700">
          {title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{excerpt ?? "No excerpt available."}</p>
      <div className="mt-4">
        <Link to={`/post/${slug}`} className="text-sm font-medium text-zinc-900 hover:text-zinc-700">
          Read more
        </Link>
      </div>
    </article>
  );
};
