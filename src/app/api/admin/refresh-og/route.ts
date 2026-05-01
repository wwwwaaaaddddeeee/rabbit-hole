import { auth } from "@/auth";
import { z } from "zod";
import { refreshBookmarkOg } from "@/lib/og";

const bodySchema = z.object({ id: z.number().int().positive() });

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const p = bodySchema.safeParse(json);
  if (!p.success) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }
  const result = await refreshBookmarkOg(p.data.id);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  return Response.json({ ok: true, cover: result.cover });
}
