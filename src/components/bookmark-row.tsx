"use client";

import { Card } from "@heroui/react";
import type { Bookmark } from "@/lib/types";
import { formatDate } from "@/lib/time";

export function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  return (
    <Card
      as="article"
      variant="transparent"
      className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-b-0"
    >
      <a
        href={bookmark.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950 rounded-md"
      >
        <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {bookmark.cover && (
            <img
              src={bookmark.cover}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        <Card.Content className="min-w-0 flex-1 py-0.5">
          <Card.Title className="text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {bookmark.title}
          </Card.Title>
          <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            <span>{bookmark.domain}</span>
            <span
              className="mx-1.5 text-zinc-400 dark:text-zinc-600"
              aria-hidden="true"
            >
              &middot;
            </span>
            <span>{formatDate(bookmark.created)}</span>
          </p>
        </Card.Content>
      </a>
    </Card>
  );
}
