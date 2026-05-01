import ogs from "open-graph-scraper";
import { getDb } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";

function firstOgImage(
  val: { url?: string } | { url?: string }[] | string | undefined
): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    const u = val[0];
    return typeof u === "object" && u?.url ? u.url : "";
  }
  return val.url ?? "";
}

export type OgResult = {
  title: string;
  description: string;
  image: string;
  url: string;
  domain: string;
};

/**
 * Fetches Open Graph metadata and normalizes image URL. Does not write to the database.
 */
export async function fetchOgForUrl(targetUrl: string): Promise<OgResult> {
  const parsed = new URL(targetUrl);
  const { result, error } = await ogs({ url: targetUrl, timeout: 12_000 });
  if (error) {
    return {
      title: parsed.hostname,
      description: "",
      image: "",
      url: targetUrl,
      domain: parsed.hostname,
    };
  }
  const title = result.ogTitle || result.dcTitle || result.twitterTitle || parsed.hostname;
  const description =
    result.ogDescription || result.dcDescription || result.twitterDescription || "";
  const image =
    firstOgImage(result.ogImage) ||
    firstOgImage(result.twitterImage) ||
    "";
  return {
    title: String(title),
    description: String(description).slice(0, 4000),
    image: image ? new URL(image, targetUrl).toString() : "",
    url: targetUrl,
    domain: parsed.hostname,
  };
}

/**
 * Fetches OG data and updates the bookmark cover + title/excerpt in the database.
 */
export async function refreshBookmarkOg(
  id: number
): Promise<
  { ok: true; cover: string } | { ok: false; error: string }
> {
  if (!process.env.DATABASE_URL) {
    return { ok: false, error: "Database not configured" };
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, id))
    .limit(1);
  if (!row) {
    return { ok: false, error: "Bookmark not found" };
  }
  const og = await fetchOgForUrl(row.url);
  const cover = og.image || row.cover;
  const title = og.title || row.title;
  const excerpt = og.description || row.excerpt;
  const domain = og.domain || row.domain;
  await db
    .update(bookmarks)
    .set({
      cover,
      title,
      excerpt: excerpt.slice(0, 8000),
      domain,
      updatedAt: new Date(),
    })
    .where(eq(bookmarks.id, id));
  return { ok: true, cover };
}
