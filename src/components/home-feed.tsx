"use client";

import { useMemo, useState, useCallback } from "react";
import type { Bookmark } from "@/lib/types";
import { BookmarkCard } from "./bookmark-row";
import { Pagination } from "./pagination";
import { TagFilter } from "./tag-filter";
import { getTagStats } from "@/lib/tag-stats";

const PAGE_SIZE = 24;

type Props = {
  spotlight: Bookmark[];
  archive: Bookmark[];
  source: "database" | "mock";
};

export function HomeFeed({ spotlight, archive, source }: Props) {
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const onTagSelect = useCallback((tag: string | null) => {
    setActiveTag(tag);
    setPage(1);
  }, []);

  const allForStats = useMemo(
    () => [...spotlight, ...archive],
    [spotlight, archive]
  );

  const tagList = useMemo(
    () => getTagStats([allForStats]),
    [allForStats]
  );

  const filtered = useMemo(() => {
    if (!activeTag) return archive;
    return archive.filter((b) => b.tags.includes(activeTag));
  }, [archive, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const paged = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filtered, currentPage]
  );

  const handlePageChange = (next: number) => {
    setPage(next);
    if (typeof window !== "undefined") {
      const el = document.getElementById("archive-heading");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (allForStats.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Nothing here yet. Add bookmarks in the admin to populate the feed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {source === "mock" && (
        <p className="mb-6 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-[13px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
          Running with demo data. Set <code className="font-mono">DATABASE_URL</code> and run{" "}
          <code className="font-mono">npx drizzle-kit push</code> and{" "}
          <code className="font-mono">npm run db:seed</code> to use the database.
        </p>
      )}

      <TagFilter
        tags={tagList}
        activeTag={activeTag}
        onTagSelect={onTagSelect}
      />

      {filtered.length === 0 && activeTag && (
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          No bookmarks with tag <span className="font-medium text-zinc-700 dark:text-zinc-200">{activeTag}</span>.
        </p>
      )}

      {archive.length === 0 && !activeTag && spotlight.length > 0 && (
        <p className="mb-10 text-sm text-zinc-500 dark:text-zinc-400">
          Everything lives in spotlight for now—add more in admin to build the long tail.
        </p>
      )}

      {(archive.length > 0 || activeTag) && (
        <>
          <h2
            id="archive-heading"
            className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400"
          >
            {activeTag ? `Archive — ${activeTag}` : "Archive"}
          </h2>
          {paged.length > 0 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {paged.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          )}
        </>
      )}

      {filtered.length > PAGE_SIZE && paged.length > 0 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
