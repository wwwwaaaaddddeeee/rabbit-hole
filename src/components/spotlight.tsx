import type { Bookmark } from "@/lib/types";
import { BookmarkCard } from "./bookmark-row";

export function Spotlight({ items }: { items: Bookmark[] }) {
  if (items.length === 0) return null;

  return (
    <section
      className="mb-14 sm:mb-20"
      aria-label="Spotlight"
    >
      <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        Spotlight
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b, i) => (
          <BookmarkCard
            key={b.id}
            bookmark={b}
            priority={i === 0}
            variant="spotlight"
          />
        ))}
      </div>
    </section>
  );
}
