import { notFound } from "next/navigation";
import { getBookmarkById } from "@/lib/bookmarks";
import { BookmarkForm } from "@/components/bookmark-form";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const id = Number((await params).id);
  const b = await getBookmarkById(id);
  if (!b) return { title: "Not found" };
  return { title: `Edit — ${b.title}` };
}

export default async function EditBookmarkPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isFinite(id)) notFound();
  const bookmark = await getBookmarkById(id);
  if (!bookmark) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        Edit bookmark
      </h1>
      <BookmarkForm mode="edit" initial={bookmark} />
    </div>
  );
}
