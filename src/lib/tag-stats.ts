import type { Bookmark } from "./types";

export function getTagStats(bookmarkLists: Bookmark[][]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const list of bookmarkLists) {
    for (const b of list) {
      for (const t of b.tags) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
