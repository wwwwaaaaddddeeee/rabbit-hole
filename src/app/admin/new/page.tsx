import { BookmarkForm } from "@/components/bookmark-form";

export const metadata = { title: "New bookmark — rabit.wtf" };

export default function AdminNewBookmarkPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        New bookmark
      </h1>
      <BookmarkForm mode="create" />
    </div>
  );
}
