import { desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { bookmarkTags, bookmarks, tags } from "@/db/schema";
import { splitMockForHome, MOCK_BOOKMARKS } from "./mock-data";
import type { Bookmark } from "./types";

export type HomeBookmarks = {
  spotlight: Bookmark[];
  archive: Bookmark[];
  source: "database" | "mock";
};

function mapRow(
  row: {
    id: number;
    url: string;
    title: string;
    excerpt: string;
    domain: string;
    cover: string;
    featured: boolean;
    spotlightOrder: number | null;
    createdAt: Date;
  },
  tagNames: string[]
): Bookmark {
  return {
    id: row.id,
    title: row.title,
    link: row.url,
    excerpt: row.excerpt,
    cover: row.cover,
    created: row.createdAt.toISOString(),
    domain: row.domain,
    tags: tagNames,
    featured: row.featured,
    spotlightOrder: row.spotlightOrder,
  };
}

/**
 * Fetches all bookmarks with tags, then splits into spotlight (up to 3 featured) and archive.
 */
export async function getHomeBookmarks(): Promise<HomeBookmarks> {
  if (!process.env.DATABASE_URL) {
    const { spotlight, archive } = splitMockForHome(MOCK_BOOKMARKS);
    return { spotlight, archive, source: "mock" };
  }

  const db = getDb();

  const rows = await db
    .select({
      id: bookmarks.id,
      url: bookmarks.url,
      title: bookmarks.title,
      excerpt: bookmarks.excerpt,
      domain: bookmarks.domain,
      cover: bookmarks.cover,
      featured: bookmarks.featured,
      spotlightOrder: bookmarks.spotlightOrder,
      createdAt: bookmarks.createdAt,
    })
    .from(bookmarks)
    .orderBy(
      desc(bookmarks.featured),
      sql`${bookmarks.spotlightOrder} ASC NULLS LAST`,
      desc(bookmarks.createdAt)
    );

  if (rows.length === 0) {
    return { spotlight: [], archive: [], source: "database" };
  }

  const ids = rows.map((r) => r.id);
  const tagJoin = await db
    .select({
      bookmarkId: bookmarkTags.bookmarkId,
      name: tags.name,
    })
    .from(bookmarkTags)
    .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
    .where(inArray(bookmarkTags.bookmarkId, ids));

  const byId = new Map<number, string[]>();
  for (const t of tagJoin) {
    const list = byId.get(t.bookmarkId) ?? [];
    list.push(t.name);
    byId.set(t.bookmarkId, list);
  }

  const asBookmarks = rows.map((r) =>
    mapRow(r, byId.get(r.id) ?? [])
  );

  const featured = asBookmarks.filter((b) => b.featured);
  const spotlight = [...featured]
    .sort((a, b) => {
      const ra = rows.find((x) => x.id === a.id);
      const rb = rows.find((x) => x.id === b.id);
      const oa = ra?.spotlightOrder ?? 9999;
      const ob = rb?.spotlightOrder ?? 9999;
      if (oa !== ob) return oa - ob;
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    })
    .slice(0, 3);

  const inSpot = new Set(spotlight.map((b) => b.id));
  const archive = asBookmarks
    .filter((b) => !inSpot.has(b.id))
    .sort(
      (a, b) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
    );

  return { spotlight, archive, source: "database" };
}

export function searchBookmarks(bookmarks: Bookmark[], query: string): Bookmark[] {
  const q = query.toLowerCase();
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.domain.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function getBookmarkById(id: number) {
  if (!process.env.DATABASE_URL) {
    return MOCK_BOOKMARKS.find((b) => b.id === id) ?? null;
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, id))
    .limit(1);
  if (!row) return null;
  const tagNames = await db
    .select({ name: tags.name })
    .from(bookmarkTags)
    .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
    .where(eq(bookmarkTags.bookmarkId, id));
  return mapRow(
    row,
    tagNames.map((t) => t.name)
  );
}

export async function listAllBookmarksAdmin(): Promise<Bookmark[]> {
  if (!process.env.DATABASE_URL) {
    return [...MOCK_BOOKMARKS].sort(
      (a, b) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(bookmarks)
    .orderBy(desc(bookmarks.createdAt));
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const tagJoin = await db
    .select({
      bookmarkId: bookmarkTags.bookmarkId,
      name: tags.name,
    })
    .from(bookmarkTags)
    .innerJoin(tags, eq(bookmarkTags.tagId, tags.id))
    .where(inArray(bookmarkTags.bookmarkId, ids));
  const byId = new Map<number, string[]>();
  for (const t of tagJoin) {
    const list = byId.get(t.bookmarkId) ?? [];
    list.push(t.name);
    byId.set(t.bookmarkId, list);
  }
  return rows.map((r) => mapRow(r, byId.get(r.id) ?? []));
}
