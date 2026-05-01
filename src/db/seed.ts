/**
 * Run: `npm run db:seed` (requires DATABASE_URL)
 * Populates the database from the same demo set as in-memory mock data.
 */
import { getDb } from "./index";
import { bookmarkTags, bookmarks, tags } from "./schema";
import { inArray } from "drizzle-orm";
import { splitMockForHome, MOCK_BOOKMARKS } from "@/lib/mock-data";

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("Set DATABASE_URL to run the seed script.");
    process.exit(1);
  }

  const db = getDb();
  const { spotlight, archive } = splitMockForHome(MOCK_BOOKMARKS);
  const all = [...spotlight, ...archive].sort((a, b) => a.id - b.id);

  await db.delete(bookmarkTags);
  await db.delete(bookmarks);
  await db.delete(tags);

  console.log("Seeding", all.length, "bookmarks...");

  for (const b of all) {
    const created = new Date(b.created);
    const [row] = await db
      .insert(bookmarks)
      .values({
        url: b.link,
        title: b.title,
        excerpt: b.excerpt,
        domain: b.domain,
        cover: b.cover,
        featured: b.featured,
        spotlightOrder: b.featured ? b.id : null,
        createdAt: created,
        updatedAt: created,
      })
      .returning({ id: bookmarks.id });

    const newId = row.id;
    for (const tag of b.tags) {
      await db.insert(tags).values({ name: tag }).onConflictDoNothing({ target: tags.name });
    }
    if (b.tags.length === 0) continue;
    const nameRows = await db
      .select({ id: tags.id, name: tags.name })
      .from(tags)
      .where(inArray(tags.name, b.tags));
    if (nameRows.length > 0) {
      await db.insert(bookmarkTags).values(
        nameRows.map((t) => ({ bookmarkId: newId, tagId: t.id }))
      );
    }
  }

  console.log("Done.");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
