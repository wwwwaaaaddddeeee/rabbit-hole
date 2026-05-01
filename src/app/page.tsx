export const metadata = {
  title: "rabit.wtf — coming soon",
};

export default function ComingSoon() {
  return (
    <main className="page-bg fixed inset-0 flex flex-col items-center justify-center">
      <div
        className="flex flex-col"
        style={{ width: "min(560px, 88vw, 70vh)" }}
      >
        <picture>
          <source
            srcSet="/carrot-juice-or.svg"
            media="(prefers-color-scheme: dark)"
          />
          <img
            src="/carrot-juice.svg"
            alt=""
            className="block h-auto w-full"
          />
        </picture>
        <p className="mt-1.5 self-center whitespace-nowrap text-[10px] leading-relaxed text-black sm:text-xs">
          Things found on the internet by{" "}
          <a
            href="http://wa-de.org"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-70"
          >
            <span className="underline underline-offset-2">Wade</span>
            <svg
              width="0.95em"
              height="0.95em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-0.5 inline-block align-[-0.1em]"
              aria-hidden="true"
            >
              <path d="M17 7L7 17M8 7h9v9" />
            </svg>
          </a>
          , coming back soon.
        </p>
      </div>
    </main>
  );
}
