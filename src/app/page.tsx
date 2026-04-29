import { RwtfPill } from "@/components/RwtfPill";

export const metadata = {
  title: "rabit.wtf — coming soon",
};

export default function ComingSoon() {
  return (
    <main
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "var(--coming-bg)" }}
    >
      <div className="flex items-center gap-[6vmin] px-[6vmin]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/rabit-figma.svg"
          alt="rabit"
          className="block"
          style={{ width: "min(110px, 13vmin)", height: "auto" }}
        />
        <a
          href="https://rabit.wtf"
          aria-label="rabit.wtf"
          className="block"
          style={{ color: "var(--pill)" }}
        >
          <RwtfPill
            className="block h-auto"
            style={{ width: "min(310px, 36.8vmin)" }}
          />
        </a>
      </div>
    </main>
  );
}
