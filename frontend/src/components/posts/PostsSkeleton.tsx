export const PostsSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="h-4 w-32 rounded bg-zinc-200" />
          <div className="mt-3 h-6 w-3/4 rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-full rounded bg-zinc-200" />
          <div className="mt-2 h-4 w-11/12 rounded bg-zinc-200" />
        </div>
      ))}
    </div>
  );
};
