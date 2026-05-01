export const metadata = {
  title: "rabit.wtf — coming soon",
};

export default function ComingSoon() {
  return (
    <main
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#FFEB00" }}
    >
      <img
        src="/carrot-juice.svg"
        alt=""
        className="block h-auto"
        style={{ width: "min(560px, 70vmin)" }}
      />
    </main>
  );
}
