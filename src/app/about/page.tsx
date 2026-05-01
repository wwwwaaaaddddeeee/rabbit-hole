import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "About — rabit.wtf",
  description:
    "A public, curated bookmark collection with editorial spotlights. Built to feel like a product, not a list.",
};

export default function AboutPage() {
  return (
    <div className="min-h-full">
      <article className="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16 text-zinc-800 dark:text-zinc-200">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          About
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          <Link href="/" className="underline underline-offset-4">
            rabit.wtf
          </Link>{" "}
          is a personal bookmarking surface: a public archive of things worth
          saving, with a few links highlighted in{" "}
          <span className="text-zinc-700 dark:text-zinc-200">spotlight</span>{" "}
          at a time.
        </p>
        <p className="text-[15px] leading-relaxed mb-4">
          The goal is a calm, image-forward reading experience—system light and
          dark, fast loads, and no accounts for visitors. A private admin path is
          how new links are added, tagged, and featured.
        </p>
        <p className="text-[15px] leading-relaxed mb-10">
          Stack: Next.js, PostgreSQL, Drizzle, hosted where you deploy modern
          apps (e.g. Vercel + Neon). Open Graph data backs rich thumbnails; you
          can refresh per link when metadata changes.
        </p>
        <SiteFooter />
      </article>
    </div>
  );
}
