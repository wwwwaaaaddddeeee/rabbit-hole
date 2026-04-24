"use client";

import type { Bookmark } from "@/lib/types";
import { formatDate } from "@/lib/time";

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <article className="group">
      <a
        href={bookmark.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950 rounded-xl"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200/70 dark:ring-zinc-800/70 transition-all duration-200 group-hover:ring-zinc-300 dark:group-hover:ring-zinc-700">
          {bookmark.cover ? (
            <img
              src={bookmark.cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 text-sm font-medium tracking-wide">
              {bookmark.domain}
            </div>
          )}
        </div>

        <div className="mt-3 px-0.5">
          <h2 className="text-[14px] font-medium leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {bookmark.title}
          </h2>
          <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
            <span>{bookmark.domain}</span>
            <span
              className="mx-1.5 text-zinc-400 dark:text-zinc-600"
              aria-hidden="true"
            >
              &middot;
            </span>
            <span>{formatDate(bookmark.created)}</span>
          </p>
        </div>
      </a>
    </article>
  );
}
