import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { bookmarkTags, tags } from "@/db/schema";
import { fetchOgForUrl } from "./og";

const normalizeTag = (t: string) => t.toLowerCase().trim().replace(/\s+/g, " ");

/**
 * Splits a comma- or space-separated list into clean tag strings.
 */
export function parseTagInput(raw: string): string[] {
  if (!raw.trim()) return [];
  const fromCommas = raw
    .split(",")
    .map(normalizeTag)
    .filter(Boolean);
  if (fromCommas.length > 1) return [...new Set(fromCommas)];
  return [...new Set(raw.split(/\s+/).map(normalizeTag).filter(Boolean))];
}

export async function setBookmarkTags(
  bookmarkId: number,
  tagNames: string[]
): Promise<void> {
  const unique = [...new Set(tagNames.map(normalizeTag).filter(Boolean))];
  const db = getDb();

  await db.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, bookmarkId));
  if (unique.length === 0) return;

  for (const name of unique) {
    await db
      .insert(tags)
      .values({ name })
      .onConflictDoNothing({ target: tags.name });
  }

  const nameRows = await db
    .select({ id: tags.id, name: tags.name })
    .from(tags)
    .where(
      inArray(
        tags.name,
        unique
      )
    );

  if (nameRows.length === 0) return;
  await db.insert(bookmarkTags).values(
    nameRows.map((row) => ({ bookmarkId, tagId: row.id }))
  );
}

export async function deleteTagsForBookmark(bookmarkId: number) {
  const db = getDb();
  await db.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, bookmarkId));
}

export async function seedMetadataFromUrl(url: string) {
  return fetchOgForUrl(url);
}
