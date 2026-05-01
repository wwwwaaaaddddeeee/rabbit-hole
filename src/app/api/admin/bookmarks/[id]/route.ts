import { auth } from "@/auth";
import { getDb } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { parseTagInput, setBookmarkTags } from "@/lib/tags-db";

const patchSchema = z
  .object({
    url: z.string().url().optional(),
    title: z.string().max(2000).optional(),
    excerpt: z.string().max(8000).optional(),
    cover: z.string().max(2000).optional(),
    domain: z.string().max(500).optional(),
    tags: z.string().optional(),
    featured: z.boolean().optional(),
    spotlightOrder: z.number().int().min(0).max(100).nullable().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field" });

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  const id = Number((await params).id);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const db = getDb();

  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, id))
    .limit(1);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { tags, ...rest } = data;
  const hasColumnPatch = Object.values(rest).some((v) => v !== undefined);
  if (hasColumnPatch) {
    const updateFields: Partial<typeof existing> = { updatedAt: new Date() };
    if (rest.url !== undefined) updateFields.url = rest.url;
    if (rest.title !== undefined) updateFields.title = rest.title;
    if (rest.excerpt !== undefined) updateFields.excerpt = rest.excerpt;
    if (rest.cover !== undefined) updateFields.cover = rest.cover;
    if (rest.domain !== undefined) updateFields.domain = rest.domain;
    if (rest.featured !== undefined) updateFields.featured = rest.featured;
    if (rest.spotlightOrder !== undefined) {
      updateFields.spotlightOrder = rest.spotlightOrder;
    }
    await db.update(bookmarks).set(updateFields).where(eq(bookmarks.id, id));
  } else if (tags !== undefined) {
    await db
      .update(bookmarks)
      .set({ updatedAt: new Date() })
      .where(eq(bookmarks.id, id));
  }

  if (tags !== undefined) {
    await setBookmarkTags(id, parseTagInput(tags));
  }

  const [row] = await db.select().from(bookmarks).where(eq(bookmarks.id, id));

  return Response.json({ bookmark: row });
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  const id = Number((await params).id);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = getDb();
  await db.delete(bookmarks).where(eq(bookmarks.id, id));

  return Response.json({ ok: true });
}
