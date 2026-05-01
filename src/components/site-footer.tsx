import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/colophon", label: "Colophon" },
  { href: "https://brianawade.com", label: "Wade" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-zinc-200/80 pt-10 pb-16 dark:border-zinc-800/80">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          A personal showcase for links worth saving. Built with care.
        </p>
        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm"
          aria-label="Footer"
        >
          {links.map((l) => (
            l.href.startsWith("http") ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-zinc-100"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-zinc-100"
              >
                {l.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </footer>
  );
}
