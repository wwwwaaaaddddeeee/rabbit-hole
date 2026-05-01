import Image from "next/image";
import { getHomeBookmarks } from "@/lib/bookmarks";
import { HomeFeed } from "@/components/home-feed";
import { ProjectAttribution } from "@/components/project-attribution";
import { Spotlight } from "@/components/spotlight";
import { SiteFooter } from "@/components/site-footer";
import siteHeaderIcon from "./site-header-icon.png";

export const revalidate = 60;

export default async function Home() {
  const { spotlight, archive, source } = await getHomeBookmarks();

  return (
    <div className="min-h-full flex flex-col">
      <main className="w-full max-w-[1440px] mx-auto flex-1 px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        <header className="mb-10 sm:mb-14">
          <h1 className="flex items-center gap-2 sm:gap-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Image
              src={siteHeaderIcon}
              alt=""
              width={28}
              height={28}
              className="size-6 sm:size-7 shrink-0 rounded-lg ring-2 ring-[#a2ff86]/25 dark:ring-[#a2ff86]/20"
              priority
            />
            rabit.wtf
          </h1>
          <ProjectAttribution />
        </header>

        <Spotlight items={spotlight} />
        <HomeFeed spotlight={spotlight} archive={archive} source={source} />
        <SiteFooter />
      </main>
    </div>
  );
}
