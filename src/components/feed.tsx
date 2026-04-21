"use client";

import { useState, useMemo, useEffect } from "react";
import type { Bookmark } from "@/lib/types";
import { BookmarkCard } from "./bookmark-row";
import { Pagination } from "./pagination";

const PAGE_SIZE = 10;

export function Feed({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!activeTag) return bookmarks;
    return bookmarks.filter((b) => b.aiTags.includes(activeTag));
  }, [bookmarks, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [activeTag]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handlePageChange = (next: number) => {
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {paged.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onTagClick={setActiveTag}
          />
        ))}

        {filtered.length > PAGE_SIZE && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {bookmarks.length === 0
                ? "Nothing here yet. Save some bookmarks to your Raindrop showcase collection."
                : `No bookmarks tagged "${activeTag}".`}
            </p>
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="mt-3 text-xs text-zinc-600 dark:text-zinc-300 underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950 rounded-sm px-0.5 -mx-0.5 cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
