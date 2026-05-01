import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F0F0F0",
};

export const metadata: Metadata = {
  title: "rabit.wtf",
  description: "Things found on the internet.",
  metadataBase: new URL("https://rabit.wtf"),
  openGraph: {
    title: "rabit.wtf",
    description: "Things found on the internet.",
    url: "https://rabit.wtf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rabit.wtf",
    description: "Things found on the internet.",
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
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans text-zinc-900" style={{ backgroundColor: "#F0F0F0" }}>
        {children}
      </body>
    </html>
  );
}
