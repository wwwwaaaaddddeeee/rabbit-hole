import { getBookmarks } from "@/lib/bookmarks";
import { Feed } from "@/components/feed";
import { ChatDrawer } from "@/components/chat-drawer";

export const dynamic = "force-dynamic";

export default async function Home() {
  let bookmarks: Awaited<ReturnType<typeof getBookmarks>> = [];
  try {
    bookmarks = await getBookmarks();
  } catch {
    bookmarks = [];
  }

  return (
    <>
      <main className="w-full max-w-[640px] mx-auto px-5 py-12 sm:py-16">
        <header className="mb-10">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            rabbit hole
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
            things found on the internet
          </p>
        </header>

        <Feed bookmarks={bookmarks} />
      </main>

      <ChatDrawer />
    </>
  );
}
