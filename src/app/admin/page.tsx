import { listAllBookmarksAdmin } from "@/lib/bookmarks";
import Link from "next/link";

export const metadata = { title: "Admin — rabit.wtf" };

export default async function AdminDashboardPage() {
  const list = await listAllBookmarksAdmin();
  const hasDb = !!process.env.DATABASE_URL;

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Bookmarks
      </h1>
      {!hasDb && (
        <p className="mb-6 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-[13px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
          <code className="font-mono">DATABASE_URL</code> is not set. The list
          below is demo data; create/save requires a PostgreSQL connection.
        </p>
      )}
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        {list.map((b) => (
          <li key={b.id}>
            <Link
              href={`/admin/bookmarks/${b.id}/edit`}
              className="flex flex-col gap-0.5 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {b.title}
              </span>
              <span className="text-xs text-zinc-500 truncate">{b.link}</span>
              <span className="text-[11px] text-zinc-400">
                {b.featured ? "featured · " : ""}
                {b.tags.join(", ") || "no tags"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="text-sm text-zinc-500 mt-4">No bookmarks yet.</p>
      )}
    </div>
  );
}
