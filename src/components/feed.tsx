"use client";

import { useState, useMemo, useEffect } from "react";
import type { Bookmark } from "@/lib/types";
import { BookmarkCard } from "./bookmark-row";
import { Pagination } from "./pagination";

const PAGE_SIZE = 24;

export function Feed({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarks.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = useMemo(
    () => bookmarks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [bookmarks, page]
  );

  const handlePageChange = (next: number) => {
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Nothing here yet. Save some bookmarks to your Raindrop showcase
          collection.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-6 gap-y-10 sm:gap-y-12">
        {paged.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>

      {bookmarks.length > PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
