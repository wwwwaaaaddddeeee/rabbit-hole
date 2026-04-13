"use client";

import { motion } from "framer-motion";
import type { Bookmark } from "@/lib/types";
import { relativeTime } from "@/lib/time";

export function BookmarkRow({
  bookmark,
  index,
  onTagClick,
}: {
  bookmark: Bookmark;
  index: number;
  onTagClick: (tag: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group"
    >
      <a
        href={bookmark.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-4 rounded-xl p-3 -mx-3 transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
      >
        {bookmark.cover && (
          <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={bookmark.cover}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-medium leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
            {bookmark.title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
              {bookmark.domain}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">&middot;</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
              {relativeTime(bookmark.created)}
            </span>
          </div>
          {bookmark.excerpt && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
              {bookmark.excerpt}
            </p>
          )}
        </div>
      </a>
      {bookmark.aiTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 pl-0">
          {bookmark.aiTags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault();
                onTagClick(tag);
              }}
              className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </motion.article>
  );
}
