import { auth } from "@/auth";
import { getDb } from "@/db";
import { bookmarks } from "@/db/schema";
import { z } from "zod";
import { fetchOgForUrl } from "@/lib/og";
import { parseTagInput, setBookmarkTags } from "@/lib/tags-db";
import { listAllBookmarksAdmin } from "@/lib/bookmarks";

const createSchema = z.object({
  url: z.string().url(),
  title: z.string().max(2000).optional(),
  excerpt: z.string().max(8000).optional(),
  tags: z.string().optional(),
  featured: z.boolean().optional().default(false),
  spotlightOrder: z.number().int().min(0).max(100).nullable().optional(),
  skipOg: z.boolean().optional().default(false),
});

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const list = await listAllBookmarksAdmin();
  return Response.json({ bookmarks: list });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: "Database not configured (DATABASE_URL)" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { url, title, excerpt, tags, featured, spotlightOrder, skipOg } =
    parsed.data;
  const db = getDb();

  const meta = {
    title: title ?? "",
    excerpt: excerpt ?? "",
    cover: "",
    domain: new URL(url).hostname,
  };

  if (!skipOg) {
    const og = await fetchOgForUrl(url);
    if (!title) meta.title = og.title;
    if (!excerpt) meta.excerpt = og.description;
    meta.cover = og.image;
    meta.domain = og.domain;
  } else {
    if (!meta.title) meta.title = new URL(url).hostname;
  }

  const [row] = await db
    .insert(bookmarks)
    .values({
      url,
      title: meta.title,
      excerpt: meta.excerpt,
      cover: meta.cover,
      domain: meta.domain,
      featured,
      spotlightOrder: spotlightOrder ?? (featured ? 0 : null),
      updatedAt: new Date(),
    })
    .returning();

  await setBookmarkTags(row.id, parseTagInput(tags ?? ""));

  return Response.json({ id: row.id, bookmark: row }, { status: 201 });
}
