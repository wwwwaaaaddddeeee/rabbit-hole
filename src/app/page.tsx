import Image from "next/image";
import { getBookmarks } from "@/lib/bookmarks";
import { Feed } from "@/components/feed";
import { ProjectAttribution } from "@/components/project-attribution";
import siteHeaderIcon from "./site-header-icon.png";

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
      <main className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <header className="mb-10 sm:mb-14">
          <h1 className="flex items-center gap-2 sm:gap-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Image
              src={siteHeaderIcon}
              alt=""
              width={28}
              height={28}
              className="size-6 sm:size-7 shrink-0 rounded-lg"
              priority
            />
            rabit.wtf
          </h1>
          <ProjectAttribution />
        </header>

        <Feed bookmarks={bookmarks} />
      </main>
    </>
  );
}
