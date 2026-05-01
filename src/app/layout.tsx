import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "rabit.wtf — things found on the internet",
    template: "%s | rabit.wtf",
  },
  description:
    "A curated bookmark gallery with spotlight picks, tag filters, and a calm reading layout.",
  metadataBase: new URL("https://rabit.wtf"),
  openGraph: {
    title: "rabit.wtf",
    description:
      "A curated bookmark gallery with spotlight picks and image-forward cards.",
    url: "https://rabit.wtf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rabit.wtf",
    description:
      "A curated bookmark gallery with spotlight picks and image-forward cards.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased scheme-light dark:scheme-dark`}
    >
      <body className="min-h-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
