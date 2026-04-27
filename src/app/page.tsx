import { RabitHoleCard } from "@/components/RabitHoleCard";

export const metadata = {
  title: "rabit.wtf — coming soon",
};

export default function ComingSoon() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "var(--coming-bg)", color: "var(--coming-fg)" }}
    >
      <div style={{ width: "min(180px, 30vmin)" }}>
        <RabitHoleCard />
      </div>
      <p className="inline-flex items-center gap-0.5 font-sans font-medium text-base tracking-tight text-[#FF5D00] underline underline-offset-2">
        rabit.wtf
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 7L7 3" />
          <path d="M3.5 3H7v3.5" />
        </svg>
      </p>
    </div>
  );
}
