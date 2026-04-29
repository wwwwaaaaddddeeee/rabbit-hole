export const metadata = {
  title: "rabit.wtf — coming soon",
};

const ORANGE = "#FF5D00";

export default function ComingSoon() {
  return (
    <main
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: ORANGE }}
    >
      <div className="flex items-center gap-[6vmin] px-[6vmin]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/rabit-figma.svg"
          alt="rabit"
          className="block"
          style={{ width: "min(110px, 13vmin)", height: "auto" }}
        />
        <a href="https://rabit.wtf" aria-label="rabit.wtf" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rwtf-pill.svg"
            alt="rabit.wtf"
            className="block"
            style={{ width: "min(270px, 32vmin)", height: "auto" }}
          />
        </a>
      </div>
    </main>
  );
}
