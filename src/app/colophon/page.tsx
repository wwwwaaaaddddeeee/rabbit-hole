import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";

export const metadata = {
  title: "Colophon — rabit.wtf",
  description: "How rabit.wtf is built: stack, data flow, and design notes.",
};

export default function ColophonPage() {
  return (
    <div className="min-h-full">
      <article className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16 text-zinc-800 dark:text-zinc-200">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Colophon
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Technical notes and credits for the curious.
        </p>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
          Data flow
        </h2>
        <ul className="list-disc pl-5 text-[15px] leading-relaxed space-y-2 mb-8">
          <li>Bookmarks and tags live in PostgreSQL; the public site reads with caching.</li>
          <li>Curated “spotlight” links are a subset of rows flagged as featured.</li>
          <li>Open Graph scrapes refresh cover images and text when you ask in admin.</li>
        </ul>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
          Stack
        </h2>
        <p className="text-[15px] leading-relaxed mb-8">
          Next.js App Router, Tailwind CSS, Drizzle ORM, NextAuth (credentials
          for the operator), open-graph-scraper, Zod. Typography: Geist Sans via{" "}
          <code className="text-sm font-mono">next/font</code>.
        </p>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
          Case study
        </h2>
        <p className="text-[15px] leading-relaxed mb-8">
          A longer write-up can live on your portfolio site. If you add a
          public URL, link it from{" "}
          <Link href="/about" className="underline underline-offset-4">
            About
          </Link>{" "}
          or the footer.
        </p>
        <SiteFooter />
      </article>
    </div>
  );
}
