"use client";

import { motion, AnimatePresence } from "framer-motion";

export function TagFilter({
  tags,
  activeTag,
  onTagSelect,
}: {
  tags: { tag: string; count: number }[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-8">
      <AnimatePresence>
        {activeTag && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => onTagSelect(null)}
            className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium cursor-pointer"
          >
            &times; {activeTag}
          </motion.button>
        )}
      </AnimatePresence>
      {tags
        .filter((t) => t.tag !== activeTag)
        .slice(0, 20)
        .map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150 cursor-pointer"
          >
            {tag}
            <span className="ml-1 text-zinc-400 dark:text-zinc-500">
              {count}
            </span>
          </button>
        ))}
    </div>
  );
}
